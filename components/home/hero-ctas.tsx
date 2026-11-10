import Link from "next/link";

import { CTA_LINKS } from "@/lib/site";

/**
 * Hero call-to-action pair (Figma nodes 85:2542 / 67:2145): solid white
 * "Let's Talk" pill + plain "Our Projects →" link, 160×48 each on desktop,
 * full-width stacked (40px tall) on mobile.
 */
export function HeroCtas() {
  return (
    <div className="flex w-full flex-col items-stretch gap-1 lg:w-auto lg:flex-row lg:items-start">
      <Link
        href={CTA_LINKS.letstalk.href}
        className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-social bg-white px-5 pb-[11px] pt-3 text-center font-brand text-base font-medium text-[#0b0b0b] transition-opacity hover:opacity-90 lg:h-12 lg:w-40"
      >
        {CTA_LINKS.letstalk.label}
      </Link>
      <Link
        href={CTA_LINKS.projects.href}
        className="flex h-10 w-full items-center justify-center gap-1 whitespace-nowrap rounded-social px-5 pb-[11px] pt-3 text-center font-brand text-base font-medium text-white transition-opacity hover:opacity-80 lg:h-12 lg:w-40"
      >
        {CTA_LINKS.projects.label}
        <img
          src="/landing/home/arrow-right-white.svg"
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          className="size-6 shrink-0"
        />
      </Link>
    </div>
  );
}
