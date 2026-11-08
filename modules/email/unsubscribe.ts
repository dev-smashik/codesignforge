/**
 * Unsubscribe confirmation (AGENTS.md §7).
 *
 * - Lookups are read-only (the GET confirmation page never mutates).
 * - Confirmation is a single transaction: token used + revoked, subscriber
 *   suppressed, any other active tokens revoked. Idempotent: confirming an
 *   already-unsubscribed subscriber (by re-clicking an old link) is a no-op
 *   success.
 */
import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";

import { findActiveTokenByRaw } from "@/modules/tokens";
import { hashToken, type TokenDb } from "@/modules/tokens";

export interface UnsubscribeDb extends TokenDb {
  subscriber: {
    findUnique(args: Prisma.SubscriberFindUniqueArgs): Promise<unknown>;
    update(args: Prisma.SubscriberUpdateArgs): Promise<unknown>;
  };
  $transaction<T>(callback: (tx: UnsubscribeTx) => Promise<T>): Promise<T>;
}

export interface UnsubscribeTx {
  unsubscribeToken: {
    findUnique(args: Prisma.UnsubscribeTokenFindUniqueArgs): Promise<unknown>;
    update(args: Prisma.UnsubscribeTokenUpdateArgs): Promise<unknown>;
    updateMany(args: Prisma.UnsubscribeTokenUpdateManyArgs): Promise<unknown>;
  };
  subscriber: {
    findUnique(args: Prisma.SubscriberFindUniqueArgs): Promise<unknown>;
    update(args: Prisma.SubscriberUpdateArgs): Promise<unknown>;
  };
}

export async function lookupUnsubscribeTarget(
  db: UnsubscribeDb,
  rawToken: string,
): Promise<{ subscriberId: string; email: string } | null> {
  const found = await findActiveTokenByRaw(db, rawToken);
  if (!found) return null;
  const subscriber = (await db.subscriber.findUnique({
    where: { id: found.subscriberId },
    select: { id: true, email: true, status: true },
  })) as { id: string; email: string; status: string } | null;
  if (!subscriber) return null;
  return { subscriberId: subscriber.id, email: subscriber.email };
}

export async function confirmUnsubscribe(
  db: UnsubscribeDb,
  rawToken: string,
): Promise<{ ok: true } | { ok: false; reason: "invalid" }> {
  return db.$transaction(async (tx) => {
    const token = (await tx.unsubscribeToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
      select: { id: true, subscriberId: true, revokedAt: true },
    })) as {
      id: string;
      subscriberId: string;
      revokedAt: Date | null;
    } | null;

    if (!token) {
      return { ok: false, reason: "invalid" } as const;
    }

    const subscriber = (await tx.subscriber.findUnique({
      where: { id: token.subscriberId },
      select: { id: true, status: true },
    })) as { id: string; status: string } | null;

    if (!subscriber) {
      return { ok: false, reason: "invalid" } as const;
    }

    if (token.revokedAt === null) {
      await tx.unsubscribeToken.update({
        where: { id: token.id },
        data: { usedAt: new Date(), revokedAt: new Date() },
      });
    }
    if (subscriber.status === "ACTIVE") {
      await tx.subscriber.update({
        where: { id: subscriber.id },
        data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
      });
    }
    await tx.unsubscribeToken.updateMany({
      where: { subscriberId: subscriber.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { ok: true } as const;
  });
}
