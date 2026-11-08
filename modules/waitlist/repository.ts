/**
 * Database access for the waitlist use case (Phase 3).
 *
 * Only this layer talks to Prisma. The signup use case receives a minimal
 * structural `WaitlistDb` so unit tests can inject a fake without a live
 * database; the real Prisma client satisfies it.
 */
import type { Prisma } from "@/src/generated/prisma/client";

export interface WaitlistDb {
  subscriber: {
    findUnique(args: Prisma.SubscriberFindUniqueArgs): Promise<unknown>;
    create(args: Prisma.SubscriberCreateArgs): Promise<unknown>;
    count(args?: Prisma.SubscriberCountArgs): Promise<number>;
  };
  emailLog: {
    create(args: Prisma.EmailLogCreateArgs): Promise<unknown>;
  };
  outboxJob: {
    create(args: Prisma.OutboxJobCreateArgs): Promise<unknown>;
  };
  $transaction<T>(
    callback: (tx: WaitlistTx) => Promise<T>,
  ): Promise<T>;
}

export interface WaitlistTx {
  subscriber: {
    findUnique(args: Prisma.SubscriberFindUniqueArgs): Promise<unknown>;
    create(args: Prisma.SubscriberCreateArgs): Promise<unknown>;
  };
  emailLog: {
    create(args: Prisma.EmailLogCreateArgs): Promise<unknown>;
    findUnique(args: Prisma.EmailLogFindUniqueArgs): Promise<unknown>;
  };
  outboxJob: {
    create(args: Prisma.OutboxJobCreateArgs): Promise<unknown>;
  };
}

export interface SubscriberRecord {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
}

const CONSENT_SOURCE = "waiting_page";

export async function findSubscriberByEmail(
  db: WaitlistDb,
  email: string,
): Promise<SubscriberRecord | null> {
  const row = (await db.subscriber.findUnique({
    where: { email },
    select: { id: true, email: true, status: true },
  })) as SubscriberRecord | null;
  return row;
}

/**
 * Live ACTIVE subscriber count for public social proof.
 * Only ACTIVE (consented, not unsubscribed) rows count — unsubscribed
 * addresses are not waitlist members.
 */
export async function countActiveSubscribers(
  db: WaitlistDb,
): Promise<number> {
  return db.subscriber.count({ where: { status: "ACTIVE" } });
}

export interface NewSubscriber {
  email: string;
  signupSource?: string;
  referrer?: string;
}

/**
 * Creates the subscriber, its welcome EmailLog (PENDING) and the durable
 * WELCOME OutboxJob in a single transaction: either all three exist or none
 * do, so a subscriber can never exist without a schedulable welcome email
 * (and vice versa).
 */
export async function createSubscriberWithWelcomeJob<T extends WaitlistDb>(
  db: T,
  input: NewSubscriber,
): Promise<{ subscriberId: string; emailLogId: string; outboxJobId: string }> {
  return db.$transaction(async (tx) => {
    const subscriber = (await tx.subscriber.create({
      data: {
        email: input.email,
        status: "ACTIVE",
        consentedAt: new Date(),
        consentSource: CONSENT_SOURCE,
        signupSource: input.signupSource,
        referrer: input.referrer,
      },
      select: { id: true },
    })) as { id: string };

    const emailLog = (await tx.emailLog.create({
      data: {
        subscriberId: subscriber.id,
        status: "PENDING",
      },
      select: { id: true },
    })) as { id: string };

    const outboxJob = (await tx.outboxJob.create({
      data: {
        subscriberId: subscriber.id,
        status: "PENDING",
        maxAttempts: 5,
      },
      select: { id: true },
    })) as { id: string };

    return {
      subscriberId: subscriber.id,
      emailLogId: emailLog.id,
      outboxJobId: outboxJob.id,
    };
  });
}
