/**
 * Durable outbox processor (Phase 3).
 *
 * Claims PENDING welcome jobs with optimistic locking, sends through the
 * mailer, and records outcomes on the EmailLog + OutboxJob.
 *
 * Guarantees:
 * - Unsubscribed/bounced subscribers are never sent to, even if they
 *   unsubscribed after being queued (re-checked immediately before sending).
 * - A recipient is never double-sent: claims are exclusive, the EmailLog is
 *   created once at signup, a set providerMessageId short-circuits retries,
 *   and the provider idempotency key is the job id.
 * - Transient failures retry with exponential backoff; permanent provider
 *   validation failures fail the job and suppress the address.
 * - Subscriber rows are never deleted by failures.
 */
import "server-only";

import { requireDatabaseEnv } from "@/lib/env";
import { createFreshActiveToken, type TokenDb } from "@/modules/tokens";

import type { Mailer } from "./mailer";

export interface OutboxDb extends TokenDb {
  outboxJob: {
    findMany(args: {
      where: { status: "PENDING"; runAfter: { lte: Date } };
      orderBy: { createdAt: "asc" };
      take: number;
    }): Promise<unknown>;
    updateMany(args: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }): Promise<{ count: number }>;
  };
  subscriber: {
    findUnique(args: {
      where: { id: string };
      select: Record<string, boolean>;
    }): Promise<unknown>;
    updateMany(args: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }): Promise<{ count: number }>;
  };
  emailLog: {
    findFirst(args: {
      where: Record<string, unknown>;
      orderBy: { createdAt: "asc" };
      select?: Record<string, boolean>;
    }): Promise<unknown>;
    update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  };
  $transaction<T>(callback: (tx: OutboxDb) => Promise<T>): Promise<T>;
}

interface JobRow {
  id: string;
  subscriberId: string;
  attempts: number;
  maxAttempts: number;
}

interface SubscriberRow {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
}

interface EmailLogRow {
  id: string;
  providerMessageId: string | null;
}

const BACKOFF_MINUTES = [1, 5, 30, 120, 360];

function backoffMinutes(attempts: number): number {
  return BACKOFF_MINUTES[Math.min(attempts, BACKOFF_MINUTES.length) - 1] ?? 360;
}

export interface ProcessSummary {
  claimed: number;
  sent: number;
  retried: number;
  failed: number;
  skipped: number;
}

export async function processOutboxBatch(
  db: OutboxDb,
  mailer: Mailer,
  options: {
    now?: Date;
    limit?: number;
    workerId?: string;
  } = {},
): Promise<ProcessSummary> {
  const now = options.now ?? new Date();
  const limit = options.limit ?? 25;
  const workerId = options.workerId ?? "outbox-processor";
  const { NEXT_PUBLIC_APP_URL } = requireDatabaseEnv();

  const summary: ProcessSummary = {
    claimed: 0,
    sent: 0,
    retried: 0,
    failed: 0,
    skipped: 0,
  };

  const candidates = (await db.outboxJob.findMany({
    where: { status: "PENDING", runAfter: { lte: now } },
    orderBy: { createdAt: "asc" },
    take: limit,
  })) as JobRow[];

  for (const job of candidates) {
    // Optimistic claim: only one processor may win PENDING -> PROCESSING.
    const claimed = await db.outboxJob.updateMany({
      where: { id: job.id, status: "PENDING" },
      data: { status: "PROCESSING", lockedAt: now, lockedBy: workerId },
    });
    if (claimed.count === 0) continue;
    summary.claimed += 1;

    const subscriber = (await db.subscriber.findUnique({
      where: { id: job.subscriberId },
      select: { id: true, email: true, status: true },
    })) as SubscriberRow | null;

    // Suppress: re-check immediately before sending — never email
    // unsubscribed/bounced addresses.
    if (!subscriber || subscriber.status !== "ACTIVE") {
      await db.outboxJob.updateMany({
        where: { id: job.id },
        data: { status: "COMPLETED", completedAt: now },
      });
      summary.skipped += 1;
      continue;
    }

    const log = (await db.emailLog.findFirst({
      where: {
        subscriberId: job.subscriberId,
        status: "PENDING",
      },
      orderBy: { createdAt: "asc" },
    })) as EmailLogRow | null;

    // Idempotency: an already-accepted send is never repeated.
    if (log?.providerMessageId) {
      await db.outboxJob.updateMany({
        where: { id: job.id },
        data: { status: "COMPLETED", completedAt: now },
      });
      summary.skipped += 1;
      continue;
    }

    const token = await createFreshActiveToken(db, subscriber.id);
    const result = await mailer.sendWelcome({
      to: subscriber.email,
      unsubscribeUrl: `${NEXT_PUBLIC_APP_URL}/unsubscribe/${token.raw}`,
    });

    if (result.ok) {
      if (log) {
        await db.emailLog.update({
          where: { id: log.id },
          data: { status: "SENT", providerMessageId: result.providerId, sentAt: now },
        });
      }
      await db.outboxJob.updateMany({
        where: { id: job.id },
        data: { status: "COMPLETED", completedAt: now },
      });
      summary.sent += 1;
      continue;
    }

    // Permanent provider rejection (e.g. invalid address): fail + suppress.
    if (result.code === "validation") {
      await db.$transaction(async (tx) => {
        if (log) {
          await tx.emailLog.update({
            where: { id: log.id },
            data: {
              status: "FAILED",
              errorCode: result.code,
              errorMessage: "Recipient address rejected by the provider.",
            },
          });
        }
        await tx.outboxJob.updateMany({
          where: { id: job.id },
          data: {
            status: "FAILED",
            attempts: job.attempts + 1,
            lastErrorCode: result.code,
            lastErrorMessage: "Recipient address rejected by the provider.",
            completedAt: now,
          },
        });
        await tx.subscriber.updateMany({
          where: { id: job.subscriberId, status: "ACTIVE" },
          data: { status: "UNSUBSCRIBED", unsubscribedAt: now },
        });
        await tx.unsubscribeToken.updateMany({
          where: { subscriberId: job.subscriberId, revokedAt: null },
          data: { revokedAt: now },
        });
      });
      summary.failed += 1;
      continue;
    }

    const attempts = job.attempts + 1;
    if (attempts >= job.maxAttempts) {
      if (log) {
        await db.emailLog.update({
          where: { id: log.id },
          data: {
            status: "FAILED",
            errorCode: result.code,
            errorMessage: "Welcome email could not be delivered.",
          },
        });
      }
      await db.outboxJob.updateMany({
        where: { id: job.id },
        data: {
          status: "FAILED",
          attempts,
          lastErrorCode: result.code,
          lastErrorMessage: "Welcome email could not be delivered.",
          completedAt: now,
        },
      });
      summary.failed += 1;
    } else {
      await db.outboxJob.updateMany({
        where: { id: job.id },
        data: {
          status: "PENDING",
          attempts,
          lockedAt: null,
          lockedBy: null,
          runAfter: new Date(now.getTime() + backoffMinutes(attempts) * 60_000),
          lastErrorCode: result.code,
        },
      });
      summary.retried += 1;
    }
  }

  return summary;
}
