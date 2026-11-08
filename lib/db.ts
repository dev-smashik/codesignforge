/**
 * Shared Prisma client for the whole application.
 *
 * Server-only: never import this module from a client component
 * (AGENTS.md §4). Prisma 7 runs with the query compiler and the `pg` driver
 * adapter, so the connection string is passed to the adapter, not the client.
 */
import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";

import { requireDatabaseEnv } from "@/lib/env";

declare global {
  var codeSignForgePrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = requireDatabaseEnv();

  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({
    adapter,
  });
}

// Reuse a single client across dev-server hot reloads and route invocations.
export const db: PrismaClient =
  globalThis.codeSignForgePrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.codeSignForgePrisma = db;
}
