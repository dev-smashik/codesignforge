/**
 * Resend webhook endpoint (Phase 3).
 *
 * Verifies the Svix signature over the raw body, then updates EmailLog
 * outcomes. Bounce/complaint events suppress the subscriber immediately.
 * Returns 200 for processed (and duplicate) deliveries so Resend does not
 * retry them; 400 for forged payloads.
 */
import { db } from "@/lib/db";
import {
  handleResendEvent,
  verifySvixSignature,
  type ResendWebhookEvent,
} from "@/modules/email/webhook";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const id = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signature = request.headers.get("svix-signature") ?? "";

  if (
    !secret ||
    !id ||
    !timestamp ||
    !signature ||
    !verifySvixSignature(rawBody, { id, timestamp, signature }, secret)
  ) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(rawBody) as ResendWebhookEvent;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    await handleResendEvent(db, event);
    return new Response("OK", { status: 200 });
  } catch {
    // Transient failure: ask Resend to retry the delivery.
    return new Response("Retry later", { status: 500 });
  }
}
