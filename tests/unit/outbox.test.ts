import { beforeEach, describe, expect, it, vi } from "vitest";

import { processOutboxBatch, type OutboxDb } from "@/modules/email/outbox";
import type { Mailer, SendResult } from "@/modules/email/mailer";

process.env.DATABASE_URL = "postgresql://u:p@localhost:5432/db";
process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

const NOW = new Date("2026-11-08T12:00:00Z");

function mailerWith(result: SendResult): Mailer {
  return {
    sendWelcome: vi.fn(async () => result),
  };
}

function makeDb(options: {
  jobs?: Array<{
    id: string;
    subscriberId: string;
    attempts?: number;
    maxAttempts?: number;
  }>;
  subscriber?: { id: string; email: string; status: "ACTIVE" | "UNSUBSCRIBED" } | null;
}) {
  const jobs = (options.jobs ?? []).map((job) => ({
    attempts: 0,
    maxAttempts: 5,
    ...job,
  }));
  const jobUpdates: Array<{ where: unknown; data: Record<string, unknown> }> = [];
  const logUpdates: Array<{ where: unknown; data: Record<string, unknown> }> = [];

  const updateManyMock = vi.fn(
    async (args: { where: unknown; data: Record<string, unknown> }) => {
      jobUpdates.push(args);
      return { count: 1 };
    },
  );

  const db = {
    outboxJob: {
      findMany: vi.fn(async () => jobs),
      updateMany: updateManyMock,
    },
    subscriber: {
      findUnique: vi.fn(async () => options.subscriber ?? null),
    },
    emailLog: {
      findFirst: vi.fn(async () => ({ id: "log-1" })),
      update: vi.fn(async (args: { where: unknown; data: Record<string, unknown> }) => {
        logUpdates.push(args);
        return {};
      }),
    },
    unsubscribeToken: {
      findFirst: vi.fn(async () => null),
      create: vi.fn(async () => ({ id: "token-1" })),
      findUnique: vi.fn(async () => null),
      update: vi.fn(async () => ({})),
      updateMany: vi.fn(async () => ({ count: 0 })),
    },
    $transaction: vi.fn(async <T>(cb: (tx: unknown) => Promise<T>) => cb(db)),
  } as unknown as OutboxDb;

  return { db, jobUpdates, logUpdates, updateManyMock };
}

describe("processOutboxBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends and marks the job COMPLETED and the log SENT on success", async () => {
    const { db, jobUpdates, logUpdates } = makeDb({
      jobs: [{ id: "job-1", subscriberId: "sub-1" }],
      subscriber: { id: "sub-1", email: "a@b.com", status: "ACTIVE" },
    });
    const summary = await processOutboxBatch(
      db,
      mailerWith({ ok: true, providerId: "msg-1" }),
      { now: NOW },
    );

    expect(summary.sent).toBe(1);
    expect(logUpdates).toHaveLength(1);
    expect(logUpdates[0].data).toMatchObject({
      status: "SENT",
      providerMessageId: "msg-1",
    });
    const completed = jobUpdates.find((u) => u.data.status === "COMPLETED");
    expect(completed).toBeTruthy();
  });

  it("skips sending for unsubscribed subscribers", async () => {
    const { db } = makeDb({
      jobs: [{ id: "job-1", subscriberId: "sub-1" }],
      subscriber: { id: "sub-1", email: "a@b.com", status: "UNSUBSCRIBED" },
    });
    const mailer = mailerWith({ ok: true, providerId: "msg-1" });
    const summary = await processOutboxBatch(db, mailer, { now: NOW });
    expect(summary.skipped).toBe(1);
    expect(mailer.sendWelcome).not.toHaveBeenCalled();
  });

  it("retries transient failures with backoff and retains the subscriber", async () => {
    const { db, jobUpdates } = makeDb({
      jobs: [{ id: "job-1", subscriberId: "sub-1", attempts: 0 }],
      subscriber: { id: "sub-1", email: "a@b.com", status: "ACTIVE" },
    });
    const summary = await processOutboxBatch(
      db,
      mailerWith({ ok: false, code: "provider_error" }),
      { now: NOW },
    );
    expect(summary.retried).toBe(1);
    const retry = jobUpdates.find((u) => u.data.status === "PENDING");
    expect(retry).toBeTruthy();
    expect(retry?.data.attempts).toBe(1);
    const runAfter = retry?.data.runAfter as Date;
    expect(runAfter.getTime()).toBe(NOW.getTime() + 60_000); // 1-minute backoff
  });

  it("marks the job FAILED after max attempts without deleting the subscriber", async () => {
    const { db, jobUpdates, logUpdates } = makeDb({
      jobs: [{ id: "job-1", subscriberId: "sub-1", attempts: 4, maxAttempts: 5 }],
      subscriber: { id: "sub-1", email: "a@b.com", status: "ACTIVE" },
    });
    const summary = await processOutboxBatch(
      db,
      mailerWith({ ok: false, code: "provider_error" }),
      { now: NOW },
    );
    expect(summary.failed).toBe(1);
    expect(logUpdates[0].data).toMatchObject({ status: "FAILED" });
    expect(jobUpdates.some((u) => u.data.status === "FAILED")).toBe(true);
  });

  it("does not claim jobs another worker already claimed", async () => {
    const { db, updateManyMock } = makeDb({
      jobs: [{ id: "job-1", subscriberId: "sub-1" }],
      subscriber: { id: "sub-1", email: "a@b.com", status: "ACTIVE" },
    });
    updateManyMock.mockResolvedValueOnce({ count: 0 });
    const summary = await processOutboxBatch(
      db,
      mailerWith({ ok: true, providerId: "msg-1" }),
      { now: NOW },
    );
    expect(summary.claimed).toBe(0);
    expect(summary.sent).toBe(0);
  });
});
