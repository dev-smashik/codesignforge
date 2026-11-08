/**
 * Public waitlist signup input (Phase 3).
 *
 * The route validates the raw JSON body with Zod, normalizes the email
 * consistently, and hands `registerSubscriber` a clean input. Nothing in this
 * module touches the database.
 */
import { z } from "zod";

/** Single source of truth for how signup emails are normalized. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

const signupInputSchema = z
  .object({
    email: z.string().trim().min(3).max(320),
    /** Must be boolean true — consent is explicit, never assumed. */
    consent: z.boolean(),
    /** Honeypot: invisible to humans; any content means "bot". */
    website: z.string().max(200).optional().default(""),
    signupSource: z.string().trim().min(1).max(128).optional(),
    referrer: z.string().trim().min(1).max(512).optional(),
  })
  .transform((value) => ({
    email: normalizeEmail(value.email),
    consent: value.consent,
    website: value.website,
    signupSource: value.signupSource,
    referrer: value.referrer,
  }));

/** Shape of the validated signup request after normalization. */
export type NormalizedSignupInput = z.output<typeof signupInputSchema>;

/**
 * Validates and normalizes the raw `/api/waitlist` JSON body.
 * Returns a discriminated result — validation failures never reach the DB.
 */
export function parseSignupInput(body: unknown):
  | { ok: true; input: NormalizedSignupInput }
  | { ok: false; code: "invalid_email" | "consent_required" | "invalid_input" } {
  const parsed = signupInputSchema.safeParse(body);
  if (!parsed.success) {
    // Consent problems get their own code so clients can explain precisely.
    const consentIssue = parsed.error.issues.find((issue) =>
      issue.path.includes("consent"),
    );
    return {
      ok: false,
      code: consentIssue ? "consent_required" : "invalid_input",
    };
  }

  const { email } = parsed.data;
  if (parsed.data.consent !== true) {
    return { ok: false, code: "consent_required" };
  }
  if (!z.email().safeParse(email).success) {
    return { ok: false, code: "invalid_email" };
  }
  return { ok: true, input: parsed.data };
}
