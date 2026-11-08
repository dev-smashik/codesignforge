/**
 * Resend webhook processing (AGENTS.md §7, §10).
 *
 * - Signature verification over the RAW request body (Svix scheme), with a
 *   5-minute timestamp tolerance.
 * - Duplicate deliveries are skipped via the stored `lastEventId`.
 * - Out-of-order events never regress a log's status (forward-only ranking).
 * - Bounces and complaints suppress the subscriber immediately.
 */
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { Prisma } from "@/src/generated/prisma/client";

export function verifySvixSignature(
  rawBody: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string,
): boolean {
  const timestamp = Number(headers.timestamp);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > 300) return false;

  const key = Buffer.from(
    secret.replace(/^whsec_/, ""),
    "base64",
  );
  const signed = `${headers.id}.${headers.timestamp}.${rawBody}`;
  const expected = createHmac("sha256", key).update(signed).digest();

  return headers.signature
    .split(" ")
    .some((entry) => {
      const [version, signature] = entry.split(",");
      if (version !== "v1" || !signature) return false;
      try {
        const candidate = Buffer.from(signature, "base64");
        return (
          candidate.length === expected.length &&
          timingSafeEqual(candidate, expected)
        );
      } catch {
        return false;
      }
    });
}

export interface ResendWebhookEvent {
  id?: string;
  type: string;
  data: {
    email_id?: string;
    id?: string;
    [key: string]: unknown;
  };
}

export interface WebhookDb {
  emailLog: {
    findUnique(args: Prisma.EmailLogFindUniqueArgs): Promise<unknown>;
  };
  $transaction<T>(callback: (tx: WebhookTx) => Promise<T>): Promise<T>;
}

export interface WebhookTx {
  emailLog: {
    update(args: Prisma.EmailLogUpdateArgs): Promise<unknown>;
  };
  subscriber: {
    updateMany(args: Prisma.SubscriberUpdateManyArgs): Promise<unknown>;
  };
  unsubscribeToken: {
    updateMany(args: Prisma.UnsubscribeTokenUpdateManyArgs): Promise<unknown>;
  };
}

type LogStatus = "PENDING" | "SENT" | "DELIVERED" | "BOUNCED" | "COMPLAINED" | "FAILED";

const STATUS_RANK: Record<LogStatus, number> = {
  PENDING: 0,
  SENT: 1,
  DELIVERED: 2,
  FAILED: 3,
  BOUNCED: 3,
  COMPLAINED: 3,
};

const EVENT_TO_STATUS: Record<string, LogStatus> = {
  "email.sent": "SENT",
  "email.delivery_delayed": "SENT",
  "email.delivered": "DELIVERED",
  "email.bounced": "BOUNCED",
  "email.complained": "COMPLAINED",
  "email.failed": "FAILED",
};

interface LogRow {
  id: string;
  subscriberId: string;
  status: LogStatus;
  metadata: { lastEventId?: string } | null;
}

export async function handleResendEvent(
  db: WebhookDb,
  event: ResendWebhookEvent,
): Promise<
  | { handled: true; action: "updated" | "duplicate" | "stale" | "ignored" }
  | { handled: false; reason: "unknown_log" }
> {
  const status = EVENT_TO_STATUS[event.type];
  if (!status) return { handled: true, action: "ignored" };

  const providerMessageId = event.data.email_id ?? event.data.id;
  if (typeof providerMessageId !== "string" || !providerMessageId) {
    return { handled: true, action: "ignored" };
  }

  const existing = (await db.emailLog.findUnique({
    where: { providerMessageId },
  })) as LogRow | null;

  if (!existing) {
    // Not our log (unknown/test address) — ignore silently.
    return { handled: false, reason: "unknown_log" };
  }

  // Duplicate delivery of the very same event.
  if (event.id && existing.metadata?.lastEventId === event.id) {
    return { handled: true, action: "duplicate" };
  }

  const isTerminalSignal = status === "BOUNCED" || status === "COMPLAINED";
  const advances = STATUS_RANK[status] >= STATUS_RANK[existing.status];

  await db.$transaction(async (tx) => {
    if (advances) {
      await tx.emailLog.update({
        where: { id: existing.id },
        data: {
          status,
          deliveredAt:
            status === "DELIVERED" ? new Date() : undefined,
          metadata: {
            lastEventId: event.id ?? null,
            eventType: event.type,
          },
        },
      });
    }

    if (isTerminalSignal) {
      // Bounce/complaint: suppress immediately and revoke tokens so no
      // campaign or retry can ever reach this address again.
      await tx.subscriber.updateMany({
        where: { id: existing.subscriberId, status: "ACTIVE" },
        data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
      });
      await tx.unsubscribeToken.updateMany({
        where: { subscriberId: existing.subscriberId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  });

  return { handled: true, action: advances ? "updated" : "stale" };
}
