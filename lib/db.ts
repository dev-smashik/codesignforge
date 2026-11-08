/**
 * Shared Prisma client for the whole application.
 *
 * Server-only: never import this module from a client component
 * (AGENTS.md §4). Prisma 7 runs with the query compiler and the `pg` driver
 * adapter, so the connection string is passed to the adapter, not the client.
 *
 * Lazy: the client is created on first property access, NOT at import time.
 * This lets `next build` collect page data without requiring DATABASE_URL
 * to be present during the build phase (env is only needed at runtime).
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
function getClient(): PrismaClient {
  if (!globalThis.codeSignForgePrisma) {
    globalThis.codeSignForgePrisma = createPrismaClient();
  }
  return globalThis.codeSignForgePrisma;
}

// Defer PrismaClient construction until first use so builds never throw
// MissingEnvError while collecting route config.
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
