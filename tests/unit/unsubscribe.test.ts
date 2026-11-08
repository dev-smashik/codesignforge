import { describe, expect, it, vi } from "vitest";

import {
  confirmUnsubscribe,
  lookupUnsubscribeTarget,
  type UnsubscribeDb,
} from "@/modules/email/unsubscribe";
import { hashToken } from "@/modules/tokens";

function makeDb(options: {
  token?: { id: string; subscriberId: string; revokedAt: Date | null } | null;
  subscriberStatus?: string;
}) {
  const updates: string[] = [];
  const tx = {
    unsubscribeToken: {
      findUnique: vi.fn(async () => options.token ?? null),
      update: vi.fn(async () => {
        updates.push("token.update");
        return {};
      }),
      updateMany: vi.fn(async () => {
        updates.push("token.updateMany");
        return { count: 1 };
      }),
    },
    subscriber: {
      findUnique: vi.fn(async () => ({
        id: "sub-1",
        email: "a@b.com",
        status: options.subscriberStatus ?? "ACTIVE",
      })),
      update: vi.fn(async () => {
        updates.push("subscriber.update");
        return {};
      }),
    },
  };
  const db = {
    ...tx,
    $transaction: vi.fn(async <T>(cb: (t: typeof tx) => Promise<T>) => cb(tx)),
  } as unknown as UnsubscribeDb;
  return { db, updates };
}

describe("lookupUnsubscribeTarget (read-only)", () => {
  it("resolves an active token to the subscriber email", async () => {
    const { db } = makeDb({
      token: { id: "tok-1", subscriberId: "sub-1", revokedAt: null },
    });
    const target = await lookupUnsubscribeTarget(db, "raw-token");
    expect(target).toEqual({ subscriberId: "sub-1", email: "a@b.com" });
    // No mutation during lookup.
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("returns null for revoked tokens", async () => {
    const { db } = makeDb({
      token: { id: "tok-1", subscriberId: "sub-1", revokedAt: new Date() },
    });
    await expect(lookupUnsubscribeTarget(db, "raw")).resolves.toBeNull();
  });
});

describe("confirmUnsubscribe", () => {
  it("suppresses the subscriber and revokes tokens", async () => {
    const { db, updates } = makeDb({
      token: { id: "tok-1", subscriberId: "sub-1", revokedAt: null },
      subscriberStatus: "ACTIVE",
    });
    const result = await confirmUnsubscribe(db, "raw-token");
    expect(result).toEqual({ ok: true });
    expect(updates).toContain("subscriber.update");
    expect(updates).toContain("token.update");
  });

  it("is idempotent for already-unsubscribed subscribers", async () => {
    const { db, updates } = makeDb({
      token: { id: "tok-1", subscriberId: "sub-1", revokedAt: new Date() },
      subscriberStatus: "UNSUBSCRIBED",
    });
    const result = await confirmUnsubscribe(db, "raw-token");
    expect(result).toEqual({ ok: true });
    // No duplicate suppression write.
    expect(updates).not.toContain("subscriber.update");
  });

  it("rejects unknown tokens", async () => {
    const { db } = makeDb({ token: null });
    const result = await confirmUnsubscribe(db, "nope");
    expect(result).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("hashToken", () => {
  it("is deterministic and hex-encoded", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken("abc")).not.toBe("abc");
  });
});
