import { createHmac, randomBytes } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import {
  handleResendEvent,
  verifySvixSignature,
  type ResendWebhookEvent,
  type WebhookDb,
} from "@/modules/email/webhook";

const SECRET = "whsec_" + Buffer.from("test-secret").toString("base64");

function signedHeaders(payload: string, timestampSeconds: number) {
  const id = "evt_" + randomBytes(6).toString("hex");
  const timestamp = String(timestampSeconds);
  const key = Buffer.from(SECRET.replace(/^whsec_/, ""), "base64");
  const signature = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  return { id, timestamp, signature: `v1,${signature}` };
}

describe("verifySvixSignature", () => {
  it("accepts a correctly signed payload", () => {
    const payload = JSON.stringify({ type: "email.sent" });
    const headers = signedHeaders(payload, Math.floor(Date.now() / 1000));
    expect(verifySvixSignature(payload, headers, SECRET)).toBe(true);
  });

  it("rejects a tampered payload", () => {
    const payload = JSON.stringify({ type: "email.sent" });
    const headers = signedHeaders(payload, Math.floor(Date.now() / 1000));
    expect(
      verifySvixSignature(payload + " ", headers, SECRET),
    ).toBe(false);
  });

  it("rejects stale timestamps", () => {
    const payload = "{}";
    const headers = signedHeaders(payload, Math.floor(Date.now() / 1000) - 600);
    expect(verifySvixSignature(payload, headers, SECRET)).toBe(false);
  });
});

function makeDb(options: {
  log?: {
    id: string;
    subscriberId: string;
    status: "PENDING" | "SENT" | "DELIVERED" | "BOUNCED" | "COMPLAINED" | "FAILED";
    metadata?: { lastEventId?: string } | null;
  } | null;
}) {
  const updates: string[] = [];
  const tx = {
    emailLog: {
      findUnique: vi.fn(async () => options.log ?? null),
      create: vi.fn(async () => ({})),
      update: vi.fn(async () => {
        updates.push("log.update");
        return {};
      }),
    },
    subscriber: {
      update: vi.fn(async () => ({})),
      updateMany: vi.fn(async () => {
        updates.push("subscriber.suppress");
        return { count: 1 };
      }),
    },
    unsubscribeToken: {
      updateMany: vi.fn(async () => {
        updates.push("tokens.revoke");
        return { count: 1 };
      }),
    },
  };
  const db = {
    ...tx,
    $transaction: vi.fn(async <T>(cb: (t: typeof tx) => Promise<T>) => cb(tx)),
  } as unknown as WebhookDb;
  return { db, updates };
}

function event(type: string, id: string): ResendWebhookEvent {
  return { id, type, data: { email_id: "msg-1" } };
}

describe("handleResendEvent", () => {
  it("updates SENT -> DELIVERED", async () => {
    const { db, updates } = makeDb({
      log: { id: "log-1", subscriberId: "sub-1", status: "SENT" },
    });
    const result = await handleResendEvent(db, event("email.delivered", "ev-2"));
    expect(result).toEqual({ handled: true, action: "updated" });
    expect(updates).toContain("log.update");
  });

  it("skips duplicate deliveries of the same event", async () => {
    const { db, updates } = makeDb({
      log: {
        id: "log-1",
        subscriberId: "sub-1",
        status: "DELIVERED",
        metadata: { lastEventId: "ev-2" },
      },
    });
    const result = await handleResendEvent(db, event("email.delivered", "ev-2"));
    expect(result).toEqual({ handled: true, action: "duplicate" });
    expect(updates).not.toContain("log.update");
  });

  it("never regresses DELIVERED back to SENT (out-of-order)", async () => {
    const { db, updates } = makeDb({
      log: { id: "log-1", subscriberId: "sub-1", status: "DELIVERED" },
    });
    const result = await handleResendEvent(db, event("email.sent", "ev-3"));
    expect(result).toEqual({ handled: true, action: "stale" });
    expect(updates).not.toContain("log.update");
  });

  it("suppresses the subscriber on bounce", async () => {
    const { db, updates } = makeDb({
      log: { id: "log-1", subscriberId: "sub-1", status: "SENT" },
    });
    const result = await handleResendEvent(db, event("email.bounced", "ev-4"));
    expect(result).toEqual({ handled: true, action: "updated" });
    expect(updates).toContain("subscriber.suppress");
    expect(updates).toContain("tokens.revoke");
  });

  it("ignores unknown message ids", async () => {
    const { db } = makeDb({ log: null });
    const result = await handleResendEvent(db, event("email.sent", "ev-5"));
    expect(result).toEqual({ handled: false, reason: "unknown_log" });
  });

  it("ignores unmapped event types", async () => {
    const { db } = makeDb({});
    const result = await handleResendEvent(db, event("email.opened", "ev-6"));
    expect(result).toEqual({ handled: true, action: "ignored" });
  });
});
