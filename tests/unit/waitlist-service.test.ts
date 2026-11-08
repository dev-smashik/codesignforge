import { describe, expect, it, vi } from "vitest";

import { registerSubscriber } from "@/modules/waitlist/service";
import type { NormalizedSignupInput } from "@/modules/waitlist/schema";
import type { WaitlistDb } from "@/modules/waitlist/repository";

const INPUT: NormalizedSignupInput = {
  email: "reader@example.com",
  consent: true,
  website: "",
  signupSource: undefined,
  referrer: undefined,
};

function makeDb(options: {
  existing?: { id: string; email: string; status: "ACTIVE" | "UNSUBSCRIBED" } | null;
  createError?: unknown;
}) {
  const calls: string[] = [];

  const tx = {
    subscriber: {
      findUnique: vi.fn(async () => options.existing ?? null),
      create: vi.fn(async () => {
        calls.push("subscriber.create");
        if (options.createError) throw options.createError;
        return { id: "sub-1" };
      }),
    },
    emailLog: {
      create: vi.fn(async () => {
        calls.push("emailLog.create");
        return { id: "log-1" };
      }),
      findUnique: vi.fn(async () => null),
    },
    outboxJob: {
      create: vi.fn(async () => {
        calls.push("outboxJob.create");
        return { id: "job-1" };
      }),
    },
  };

  const db = {
    subscriber: { findUnique: tx.subscriber.findUnique, create: tx.subscriber.create },
    emailLog: { create: tx.emailLog.create },
    outboxJob: { create: tx.outboxJob.create },
    $transaction: vi.fn(async <T>(callback: (t: typeof tx) => Promise<T>) =>
      callback(tx),
    ),
  };

  return { db: db as unknown as WaitlistDb, calls, tx };
}

describe("registerSubscriber", () => {
  it("creates subscriber, welcome log and outbox job in one transaction", async () => {
    const { db, calls } = makeDb({ existing: null });
    const result = await registerSubscriber(db, INPUT);
    expect(result).toEqual({ status: "created", subscriberId: "sub-1" });
    expect(calls).toEqual([
      "subscriber.create",
      "emailLog.create",
      "outboxJob.create",
    ]);
  });

  it("returns duplicate for an existing ACTIVE subscriber without writes", async () => {
    const { db, calls } = makeDb({
      existing: { id: "sub-1", email: INPUT.email, status: "ACTIVE" },
    });
    const result = await registerSubscriber(db, INPUT);
    expect(result).toEqual({ status: "duplicate" });
    expect(calls).toEqual([]);
  });

  it("never reactivates an UNSUBSCRIBED address", async () => {
    const { db, calls } = makeDb({
      existing: { id: "sub-1", email: INPUT.email, status: "UNSUBSCRIBED" },
    });
    const result = await registerSubscriber(db, INPUT);
    expect(result).toEqual({ status: "duplicate" });
    expect(calls).toEqual([]);
  });

  it("maps a unique-constraint race to duplicate", async () => {
    const { db } = makeDb({ existing: null, createError: { code: "P2002" } });
    const result = await registerSubscriber(db, INPUT);
    expect(result).toEqual({ status: "duplicate" });
  });

  it("maps other database errors to a generic error", async () => {
    const { db } = makeDb({
      existing: null,
      createError: new Error("connection refused"),
    });
    const result = await registerSubscriber(db, INPUT);
    expect(result).toEqual({ status: "error", code: "database" });
  });
});
