import { Suspense } from "react";
import { GlobeBackdrop } from "@/components/landing/globe-backdrop";
import { SiteHeader } from "@/components/landing/site-header";
import { EarlyAccessBadge } from "@/components/landing/early-access-badge";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { SocialProof } from "@/components/landing/social-proof";
import { PartnersRow } from "@/components/landing/partners-row";
import { SITE } from "@/lib/site";
import { db } from "@/lib/db";
import { countActiveSubscribers } from "@/modules/waitlist/repository";
import { cacheLife } from "next/cache";

/**
 * Cached live waitlist count from PostgreSQL (ACTIVE subscribers only).
 * 'use cache' + cacheLife keeps it fresh (~minutes) without hammering the
 * DB on traffic spikes; errors return null so the caller can fall back.
 */
async function getCachedSubscriberCount(): Promise<number | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const n = await countActiveSubscribers(db);
    return n > 0 ? n : null;
  } catch {
    return null;
  }
}

/**
 * Live waitlist count from PostgreSQL (ACTIVE subscribers only).
 * Failed lookups fall back to the non-claiming copy; a count of 0 also
 * falls back so we never render "0 people on the waitlist".
 */
async function SocialProofWithCount() {
  const count = await getCachedSubscriberCount();
  return (
    <SocialProof subscriberCount={count} fallbackCopy={SITE.waitlistFallback} />
  );
}

/**
 * Public waitlist landing page (Phase 2).
 *
 * Layout follows the Figma frames (desktop 3:2 / mobile 4:141003):
 * header - hero (badge, headline, copy, email form, social proof) - partners.
 *
 * The subscriber count is fetched live from the database (ACTIVE only)
 * inside a Suspense boundary so the page shell stays static and streams in
 * the count; on failure (or zero subscribers) the non-claiming fallback
 * copy is shown instead of a fabricated number.
 */
export default function LandingPage() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-x-clip">
      <GlobeBackdrop />

      <SiteHeader />

      {/* Mobile hero is centered over the full viewport (Fig editor frame),
          while the flow keeps the header + partners anchored at top/bottom. */}
      <div
        aria-hidden="true"
        className="flex-1 lg:hidden"
      />
      <div className="absolute left-0 right-0 top-0 z-5 flex min-h-svh items-center justify-center px-4 sm:px-10 lg:static lg:z-10 lg:min-h-0 lg:flex-none lg:py-0 lg:pt-[max(2.5rem,calc(49.2svh-370px))]">
        <div className="flex w-full max-w-155 translate-y-3.75 flex-col items-center gap-6 lg:translate-y-0 lg:gap-12">
          <div className="flex w-full flex-col items-center gap-4">
            <EarlyAccessBadge />

            <div className="flex w-full flex-col items-center gap-6 text-center">
              <h1 className="w-full font-brand text-[clamp(2.75rem,1.98vw+2.22rem,4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white lg:font-normal">
                Join our website launch waitlist
              </h1>
              <p className="w-full max-w-[34em] text-base leading-[1.48] text-muted-strong lg:text-4.5 lg:leading-[1.44]">
                {SITE.tagline}
              </p>
            </div>
          </div>

          <WaitlistForm />

          <div className="mt-6 flex justify-center lg:mt-0">
            <Suspense
              fallback={
                <SocialProof
                  subscriberCount={null}
                  fallbackCopy={SITE.waitlistFallback}
                />
              }
            >
              <SocialProofWithCount />
            </Suspense>
          </div>        </div>
      </div>

      <PartnersRow />
    </main>
  );
}
