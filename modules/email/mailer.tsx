/**
 * Email sending via Resend (Phase 3).
 *
 * Never throws for provider failures — callers get a typed result so they
 * can schedule retries without losing the subscriber. Raw provider errors
 * never leave this module.
 */
import "server-only";

import { render } from "@react-email/render";
import { Resend } from "resend";

import { WelcomeEmail } from "@/emails/welcome";
import { requireEmailEnv, requireDatabaseEnv } from "@/lib/env";

export interface SendWelcomeInput {
  to: string;
  unsubscribeUrl: string;
}

export type SendResult =
  | { ok: true; providerId: string }
  | {
      ok: false;
      code: "not_configured" | "render_failed" | "validation" | "provider_error";
    };

export interface Mailer {
  sendWelcome(input: SendWelcomeInput): Promise<SendResult>;
}

const SUBJECT = "You're on the CoDesign Forge launch waitlist";

export class ResendMailer implements Mailer {
  async sendWelcome(input: SendWelcomeInput): Promise<SendResult> {
    const env = requireEmailEnv();
    const { NEXT_PUBLIC_APP_URL } = requireDatabaseEnv();

    let html: string;
    try {
      html = await render(
        <WelcomeEmail
          appUrl={NEXT_PUBLIC_APP_URL}
          unsubscribeUrl={input.unsubscribeUrl}
        />,
      );
    } catch {
      return { ok: false, code: "render_failed" };
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: SUBJECT,
      html,
      headers: {
        "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error || !data?.id) {
      return { ok: false, code: mapErrorCode(error?.name) };
    }
    return { ok: true, providerId: data.id };
  }
}

function mapErrorCode(name: string | undefined): "validation" | "provider_error" {
  return name === "validation_error" ? "validation" : "provider_error";
}

/** Returned when email env is missing: the job fails (subscriber retained). */
export class UnconfiguredMailer implements Mailer {
  async sendWelcome(): Promise<SendResult> {
    return { ok: false, code: "not_configured" };
  }
}

/** Picks the Resend adapter when configured, otherwise the failure shim. */
export function createMailer(): Mailer {
  const configured =
    process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim();
  return configured ? new ResendMailer() : new UnconfiguredMailer();
}
