/**
 * Social proof row: overlapping avatars and the waitlist count.
 *
 * The count MUST come from verified data (fetcher pass-in). When it is
 * unavailable a deliberately non-claiming message is shown — a fabricated
 * count is never rendered (AGENTS.md §2, §11).
 */
export function SocialProof({
  subscriberCount,
  fallbackCopy,
}: {
  subscriberCount: number | null | undefined;
  fallbackCopy: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 p-12">
      <div className="flex items-center" aria-hidden="true">
        {/* Design-supplied decorative avatars (not real users) */}
        <span className="relative -mr-2 size-10 overflow-hidden rounded-pill border border-line-avatar">
          <img
            src="/landing/avatar-01.png"
            alt=""
            className="absolute inset-0 size-full rounded-pill object-cover"
          />
        </span>
        <span className="relative -mr-2 size-10 overflow-hidden rounded-pill border border-line-avatar">
          <img
            src="/landing/avatar-02.png"
            alt=""
            className="absolute inset-0 size-full rounded-pill object-cover"
          />
        </span>
        <span className="relative size-10 overflow-hidden rounded-pill border border-line-avatar">
          <img
            src="/landing/avatar-03.png"
            alt=""
            className="absolute inset-0 size-full rounded-pill object-cover"
          />
        </span>
      </div>

      <p
        data-testid="subscriber-count"
        className="whitespace-nowrap text-sm font-normal leading-[1.8] text-white lg:font-medium"
      >
        {typeof subscriberCount === "number"
          ? `${subscriberCount.toLocaleString("en-US")} people on the waitlist`
          : fallbackCopy}
      </p>
    </div>
  );
}
