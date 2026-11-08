/**
 * Shared rate limiting (AGENTS.md §12).
 *
 * Uses Upstash Redis when configured, otherwise an in-memory sliding window
 * (dev/CI only — documented as such; multi-instance production needs
 * Upstash keys). The waitlist limiter is 5 requests/minute/IP; login is
 * stricter; export is coarse.
 */
import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, nowMs?: number): Promise<RateLimitResult>;
}

type LimiterOptions = { limit: number; windowMs: number; prefix: string };

function createUpstashLimiter({ limit, windowMs, prefix }: LimiterOptions): RateLimiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const seconds = Math.max(1, Math.round(windowMs / 1000));
  const redis = new Redis({ url, token });
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${seconds} s`),
    prefix,
  });

  return {
    async check(key) {
      try {
        const { success, reset } = await ratelimit.limit(key);
        return {
          allowed: success,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((reset - Date.now()) / 1000),
          ),
        };
      } catch {
        // Fail open so a limiter outage never drops legitimate traffic.
        return { allowed: true, retryAfterSeconds: 0 };
      }
    },
  };
}

function createMemoryLimiter({ limit, windowMs }: LimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();
  let warned = false;

  return {
    async check(key, nowMs = Date.now()) {
      if (!warned) {
        console.warn(
          "[ratelimit] Upstash not configured — using in-memory limiter (dev only).",
        );
        warned = true;
      }
      const cutoff = nowMs - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
      // opportunistic cleanup so the map does not grow unboundedly
      if (recent.length === 0) hits.delete(key);
      if (recent.length >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((recent[0] + windowMs - nowMs) / 1000),
          ),
        };
      }
      recent.push(nowMs);
      hits.set(key, recent);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

function buildLimiter(options: LimiterOptions): RateLimiter {
  return createUpstashLimiter(options) ?? createMemoryLimiter(options);
}

let waitlistLimiter: RateLimiter | null = null;

export function getWaitlistRateLimiter(): RateLimiter {
  waitlistLimiter ??= buildLimiter({ limit: 5, windowMs: 60_000, prefix: "waitlist-signup" });
  return waitlistLimiter;
}

/** For tests: a fresh in-memory limiter with explicit options. */
export function createMemoryRateLimiter(options: LimiterOptions): RateLimiter {
  return createMemoryLimiter(options);
}

/** Best-effort client IP (platform headers; used only as a rate-limit key). */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
