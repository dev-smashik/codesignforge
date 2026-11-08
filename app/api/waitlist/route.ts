/**
 * Public waitlist signup endpoint (Phase 3).
 *
 * POST { email, consent, website?, signupSource?, referrer? }
 *   200 { ok: true }                                   -> created (or honeypot)
 *   400 { ok: false, code }                            -> validation / consent
 *   409 { ok: false, code: "duplicate" }               -> already on the list
 *   429 { ok: false, code: "rate_limited" }            -> too many attempts
 *   500 { ok: false, code: "internal" }                -> unexpected failure
 *
 * Fail-closed and generic: raw provider/database errors never reach clients.
 */
import { db } from "@/lib/db";
import { clientIpFromHeaders, getWaitlistRateLimiter } from "@/lib/ratelimit";
import { parseSignupInput } from "@/modules/waitlist/schema";
import { registerSubscriber } from "@/modules/waitlist/service";

const MAX_BODY_BYTES = 4096;

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function POST(request: Request) {
  // Rate limiting first — cheapest abuse control.
  const ip = clientIpFromHeaders(request.headers);
  const limit = await getWaitlistRateLimiter().check(`waitlist:${ip}`);
  if (!limit.allowed) {
    return json(
      429,
      { ok: false, code: "rate_limited" },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  // Size-capped body read (never trust unbounded payloads).
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json(400, { ok: false, code: "invalid_input" });
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return json(400, { ok: false, code: "invalid_input" });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false, code: "invalid_input" });
  }

  // Honeypot: bots get a fake success and touch nothing.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return json(200, { ok: true });
  }

  const parsed = parseSignupInput(body);
  if (!parsed.ok) {
    return json(400, { ok: false, code: parsed.code });
  }

  const result = await registerSubscriber(db, parsed.input);
  if (result.status === "created") {
    return json(200, { ok: true });
  }
  if (result.status === "duplicate") {
    return json(409, { ok: false, code: "duplicate" });
  }
  return json(500, { ok: false, code: "internal" });
}
