/**
 * Outbox worker trigger (Phase 3).
 *
 * Intended for scheduled invocation (vercel.json cron, every minute) with
 * `Authorization: Bearer $CRON_SECRET`. Processes welcome jobs and records
 * outcomes. Without a configured secret the route stays closed (401).
 */
import { db } from "@/lib/db";
import { createMailer } from "@/modules/email/mailer";
import { processOutboxBatch } from "@/modules/email/outbox";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || authorization !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const summary = await processOutboxBatch(db, createMailer(), {
      workerId: "cron",
    });
    return Response.json(summary);
  } catch {
    // Never leak internals to the caller.
    return Response.json({ error: "processing_failed" }, { status: 500 });
  }
}
