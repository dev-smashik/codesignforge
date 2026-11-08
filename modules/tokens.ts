/**
 * Unsubscribe tokens (AGENTS.md §7).
 *
 * Raw tokens are cryptographically random and sent only inside the email;
 * the database stores SHA-256 hashes so a leak cannot be used to
 * unsubscribe people. A subscriber keeps one active token, created lazily
 * at their first email and reused thereafter.
 */
import "server-only";

import { createHash, randomBytes } from "node:crypto";

import type { Prisma } from "@/src/generated/prisma/client";

export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export interface TokenDb {
  unsubscribeToken: {
    findFirst(args: Prisma.UnsubscribeTokenFindFirstArgs): Promise<unknown>;
    create(args: Prisma.UnsubscribeTokenCreateArgs): Promise<unknown>;
    findUnique(args: Prisma.UnsubscribeTokenFindUniqueArgs): Promise<unknown>;
    update(args: Prisma.UnsubscribeTokenUpdateArgs): Promise<unknown>;
    updateMany(args: Prisma.UnsubscribeTokenUpdateManyArgs): Promise<unknown>;
  };
}

export interface ActiveToken {
  id: string;
  raw: string;
}

/**
 * Returns a fresh unsubscribe token for the subscriber as part of rendering
 * an email. Each email carries its own working link; any previously active
 * token is superseded (revoked) so links cannot be replayed across emails.
 */
export async function createFreshActiveToken(
  db: TokenDb,
  subscriberId: string,
): Promise<ActiveToken> {
  const raw = generateRawToken();
  await db.unsubscribeToken.updateMany({
    where: { subscriberId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  const token = (await db.unsubscribeToken.create({
    data: { subscriberId, tokenHash: hashToken(raw) },
    select: { id: true },
  })) as { id: string };
  return { id: token.id, raw };
}

export interface TokenLookup {
  tokenId: string;
  subscriberId: string;
}

/** Read-only lookup used by the confirmation page (GET never mutates). */
export async function findActiveTokenByRaw(
  db: TokenDb,
  raw: string,
): Promise<TokenLookup | null> {
  const row = (await db.unsubscribeToken.findUnique({
    where: { tokenHash: hashToken(raw) },
    select: { id: true, subscriberId: true, revokedAt: true },
  })) as { id: string; subscriberId: string; revokedAt: Date | null } | null;
  if (!row || row.revokedAt !== null) return null;
  return { tokenId: row.id, subscriberId: row.subscriberId };
}
