import type { Metadata } from "next";

import { GlowBackdrop } from "@/components/home/glow-backdrop";
import { HomeHeader } from "@/components/home/home-header";
import { HeroBadge } from "@/components/home/hero-badge";
import { HeroCtas } from "@/components/home/hero-ctas";
import { ProjectGallery } from "@/components/home/project-gallery";
import { PartnersStrip } from "@/components/home/partners-strip";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — We Design, Engineer & Scale Digital Products`,
  description: SITE.homepageTagline,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — We Design, Engineer & Scale Digital Products`,
    description: SITE.homepageTagline,
  },
};

/**
 * Marketing homepage (Figma desktop frame 99:45, mobile frame 85:2495).
 *
 * Structure: sticky navbar → centered hero (badge, headline with Playfair
 * italic accents, supporting copy, CTA pair) → trust strip with the
 * supplied partner marks, anchored to the bottom of the first viewport.
 * The CTA links are internal placeholder routes (stubs) until real
 * destination pages exist.
 *
 * Headline font note: the design specifies "Almarena Neue" for the regular
 * (non-italic) spans. Almarena Neue is not available on Google Fonts /
 * next/font, so the project's brand grotesque (Bricolage Grotesque, also
 * the design's own mobile-heading token) is used instead. The italic
 * accents are exact: Playfair Display Medium Italic.
 */
export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-x-clip lg:min-h-[1078px]">
      <GlowBackdrop />

      <HomeHeader />

      {/* Hero: sits 64px under the 80px navbar (=> design top-144px on
          desktop); mobile offset tuned to the 375px frame. */}
      <section className="relative z-10 flex flex-none flex-col items-center px-4 py-6 text-center lg:pt-16 lg:pb-10">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-4 lg:gap-6">
          <div className="flex w-full flex-col items-center gap-4">
            <HeroBadge />

            <h1 className="max-w-[1146px] text-center font-brand font-medium text-white lg:font-display">
              <span className="text-[clamp(2.5rem,3.4vw+1.6rem,4rem)] leading-[1.2] tracking-[-0.02em] lg:leading-[1.3]">
                We{" "}
              </span>
              <span className="font-playfair text-[clamp(2.75rem,3.9vw+1.7rem,4rem)] font-medium italic leading-[1.1] tracking-[-0.02em] lg:leading-[1.3]">
                Design, Engineer
              </span>
              <span className="text-[clamp(2.5rem,3.4vw+1.6rem,4rem)] leading-[1.2] tracking-[-0.02em] lg:leading-[1.3]">
                {" "}
                &amp; Scale Digital Products That Drive{" "}
              </span>
              <span className="font-playfair text-[clamp(2.75rem,3.9vw+1.7rem,4rem)] font-medium italic leading-[1.1] tracking-[-0.02em] lg:leading-[1.3]">
                Business Growth.
              </span>
            </h1>
          </div>

          <p className="w-full max-w-[996px] text-[clamp(0.875rem,1.2vw+0.45rem,1.5rem)] leading-[1.8] text-ash-300 lg:leading-[1.5] lg:text-ash-400">
            {SITE.homepageTagline}
          </p>

          <div className="flex w-full flex-col items-stretch gap-1 lg:items-center">
            <HeroCtas />
          </div>
        </div>
      </section>

      <PartnersStrip />
      <ProjectGallery />
    </main>
  );
}
