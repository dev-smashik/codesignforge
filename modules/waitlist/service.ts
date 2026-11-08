/**
 * Waitlist signup use case (Phase 3).
 *
 * Business rules (AGENTS.md §6):
 * - Duplicate ACTIVE or UNSUBSCRIBED addresses are never reactivated or
 *   re-emailed here; a deliberate resubscribe flow is separate. Duplicates
 *   return the generic "duplicate" result (the client shows "already on the
 *   waitlist") without creating any records.
 * - A subscriber and its durable welcome job are created atomically.
 * - Provider failures never happen in this path — email is sent by the
 *   outbox processor, so a failed send can never lose a subscriber.
 */
import {
  createSubscriberWithWelcomeJob,
  findSubscriberByEmail,
  type WaitlistDb,
} from "./repository";
import type { NormalizedSignupInput } from "./schema";

export type SignupResult =
  | { status: "created"; subscriberId: string }
  | { status: "duplicate" }
  | { status: "error"; code: "database" };

/** Prisma unique-constraint violation (P2002), detected structurally. */
export function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export async function registerSubscriber(
  db: WaitlistDb,
  input: NormalizedSignupInput,
): Promise<SignupResult> {
  const email = input.email;

  try {
    const existing = await findSubscriberByEmail(db, email);
    if (existing) {
      // Covers ACTIVE and UNSUBSCRIBED alike: no silent reactivation,
      // no second welcome email.
      return { status: "duplicate" };
    }

    const created = await createSubscriberWithWelcomeJob(db, {
      email,
      signupSource: input.signupSource,
      referrer: input.referrer,
    });
    return { status: "created", subscriberId: created.subscriberId };
  } catch (error) {
    // Concurrent signups race past the existence check; PostgreSQL's unique
    // constraint is the source of truth and turns the race into a duplicate.
    if (isPrismaUniqueViolation(error)) {
      return { status: "duplicate" };
    }
    // Server-side only: real failures must be diagnosable. Bounded fields,
    // no emails or message bodies.
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;
    console.error(
      `waitlist signup database error${code ? ` (${code})` : ""}: ` +
        (error instanceof Error ? error.message.slice(0, 300) : "unknown"),
    );
    return { status: "error", code: "database" };
  }
}
