/**
 * Unsubscribe confirmation endpoint (Phase 3).
 *
 * POST only — the matching GET page never mutates state. Browser form posts
 * (Origin present) are same-origin checked and 303-redirected to the "done"
 * page; one-click List-Unsubscribe posts (no Origin) get a plain 200.
 */
import { db } from "@/lib/db";
import { requireDatabaseEnv } from "@/lib/env";
import { confirmUnsubscribe } from "@/modules/email/unsubscribe";

import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Same-origin check for browser mutations; non-browser one-click posts
  // carry no Origin and are allowed through (token is the auth).
  const origin = request.headers.get("origin");
  if (origin) {
    const { NEXT_PUBLIC_APP_URL } = requireDatabaseEnv();
    if (origin !== NEXT_PUBLIC_APP_URL) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  let result;
  try {
    result = await confirmUnsubscribe(db, token);
  } catch {
    return new Response("Something went wrong", { status: 500 });
  }

  if (!result.ok) {
    return new Response("This unsubscribe link is invalid or has expired.", {
      status: 404,
    });
  }

  if (origin) {
    return NextResponse.redirect(new URL("/unsubscribe/done", request.url), 303);
  }
  return Response.json({ ok: true });
}
