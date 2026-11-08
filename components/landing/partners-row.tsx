import { SITE } from "@/lib/site";

/**
 * Partner / customer logo row near the lower viewport.
 *
 * The design uses neutral "Logoipsum" placeholder marks. These are clearly
 * labeled development placeholders — no fabricated endorsement is published.
 * Replace the marks and copy with verified partner assets before launch.
 *
 * Auto marquee: the logo set is repeated so the track is wider than any
 * viewport, then CSS `animate-marquee` loops it seamlessly (`translateX(-50%)`).
 * Pauses on hover/focus; disabled under `prefers-reduced-motion`.
 */
const PLACEHOLDER_LOGOS = [
  { src: "/landing/partner-01.svg", width: 202 },
  { src: "/landing/partner-02.svg", width: 166 },
  { src: "/landing/partner-03.svg", width: 164 },
  { src: "/landing/partner-04.svg", width: 166 },
  { src: "/landing/partner-05.svg", width: 220 },
] as const;

function LogoList({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      role={ariaHidden ? undefined : "list"}
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 lg:gap-16 lg:pr-16"
    >
      {PLACEHOLDER_LOGOS.map((logo) => (
        <li key={logo.src} className="shrink-0">
          <img
            src={logo.src}
            alt=""
            aria-hidden="true"
            width={logo.width}
            className="h-6 w-auto lg:h-10"
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
}

export function PartnersRow() {
  return (
    <section aria-label="Partners" className="group relative z-10 lg:mt-2">
      <div className="px-4 pb-4 pt-4 sm:px-10">
        <div className="mx-auto flex w-full max-w-325 flex-col gap-2 lg:max-w-7xl">
          {/* Non-claiming copy; entries are explicit placeholders */}
          <p className="text-center text-sm font-normal leading-[1.8] text-muted lg:text-base lg:font-medium lg:leading-[1.48]">
            {SITE.partnersPlaceholderNotice}
          </p>
          {/* Marquee viewport: hides overflow, loops via track */}
          <div
            className="overflow-hidden py-3 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] lg:py-5"
            aria-label="Partner logos (scrolling)"
          >
            <div className="animate-marquee flex w-max">
              <LogoList />
              <LogoList ariaHidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
