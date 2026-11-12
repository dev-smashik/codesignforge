import Link from "next/link";

import { CTA_LINKS, NAV_LINKS } from "@/lib/site";

import { MobileMenu } from "./mobile-menu";

/**
 * Sticky homepage navbar (Figma container 54:1632 / mobile 85:2502).
 *
 * Desktop: 32px logo + wordmark, centered nav items (px-16 py-12,
 * Inter Tight Medium 16), "Let's Talk" glow-border CTA on the right.
 * Mobile: 24px logo + wordmark and a hamburger disclosure button.
 */
export function HomeHeader() {
  return (
    <header className="relative z-40">
      <div className="sticky top-0 z-40 backdrop-blur-2xl">
        <div className="mx-auto flex w-full min-w-0 max-w-[1280px] items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 min-[1400px]:px-0">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-offset-4"
          >
            <span className="sr-only">CoDesign Forge — home</span>
            <img
              src="/landing/home/brand-mark.svg"
              alt=""
              aria-hidden="true"
              className="size-6 shrink-0 lg:size-8"
              width={32}
              height={32}
            />
            <span className="whitespace-nowrap font-brand text-xl font-semibold leading-[1.4] tracking-[-0.24px] text-white lg:text-2xl lg:tracking-[-0.288px]">
              CoDesign Forge
            </span>
          </Link>

          {/* Desktop nav (Figma: hidden on mobile, hamburger instead) */}
          <nav aria-label="Primary" className="hidden min-[1200px]:block">
            <ul role="list" className="flex items-stretch">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-center font-sans text-base font-medium text-white transition-opacity hover:opacity-80"
                  >
                    {link.label}
                    {"hasChevron" in link && (
                      <img
                        src="/landing/home/chevron-down.svg"
                        alt=""
                        aria-hidden="true"
                        width={16}
                        height={16}
                        className="size-4 shrink-0"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side: button container is 219px wide, justify-end */}
          <div className="flex items-center justify-end min-[1200px]:w-[219px]">
            <MobileMenu />
            <Link
              href={CTA_LINKS.letstalk.href}
              className="cta-glow hidden h-12 items-center justify-center gap-1 rounded-social border border-[#dc532c] pb-[11px] pl-5 pr-4 pt-3 font-brand text-base font-medium text-white transition-opacity min-[1200px]:flex"
            >
              {CTA_LINKS.letstalk.label}
              <img
                src="/landing/home/arrow-right-orange.svg"
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
