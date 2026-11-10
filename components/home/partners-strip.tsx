import { SITE } from "@/lib/site";

/**
 * Trust strip (Figma desktop 81:2228 / mobile 85:2761): "Trusted by 30+
 * companies" copied verbatim from the design, followed by the five supplied
 * partner marks. Desktop lays them out on a single row (justify-between);
 * mobile is a horizontally scrollable row that clips exactly like the
 * Figma mobile frame.
 *
 * The marks are the exact assets from the design file — no invented
 * endorsements. Replace or drop any company before publishing without
 * their consent.
 */
const icon = "/landing/home/siteassist-icon.svg";
const aarsisIcon = "/landing/home/aarsis-icon.svg";

export function PartnersStrip() {
  return (
    <section
      aria-label="Trusted by companies"
      className="relative z-10 px-2 py-2 sm:px-6 lg:px-20 lg:pb-[80px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-2 lg:gap-6">
        <p className="text-center text-sm font-medium leading-[1.8] text-white lg:text-base lg:leading-[1.48]">
          {SITE.trustedLabel}
        </p>

        {/* Mobile: scrollable row; Desktop: justify-between across 1120px */}
        <div className="w-full max-w-[1120px] overflow-x-auto no-scrollbar lg:overflow-x-visible">
          <div className="mx-auto flex w-max items-center gap-4 py-2 lg:justify-between">
            <img
              src="/landing/home/skinsinz-logo.png"
              alt="ScreenSkinz Technology"
              className="h-6 w-auto lg:h-[42px]"
              draggable={false}
            />

            <span className="flex items-center gap-2">
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="size-6 shrink-0 lg:size-10"
              />
              <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white lg:text-[32px] lg:leading-[1.3]">
                siteassist
              </span>
            </span>

            <span className="flex items-center gap-2">
              <img
                src={aarsisIcon}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="size-6 w-[22.4px] shrink-0 lg:size-10"
              />
              <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white lg:text-[32px] lg:leading-[1.3]">
                aarsis
              </span>
            </span>

            <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white lg:text-[32px] lg:leading-[1.3]">
              Khantrast
            </span>

            {/* Composite mark: icon + wordmark inside the design's box
                (desktop 232×42 / mobile 133×24), positioned with the
                design's own inset percentages. */}
            <span className="relative inline-block h-6 w-[133px] overflow-hidden lg:h-[42px] lg:w-[232px]">
              <img
                src="/landing/home/spawndrop-icon.svg"
                alt=""
                aria-hidden="true"
                className="absolute h-[91.31%] w-auto"
                style={{ left: "0.79%", top: "4.34%" }}
              />
              <img
                src="/landing/home/spawndrop-wordmark.svg"
                alt=""
                aria-hidden="true"
                className="absolute h-[77.66%] w-auto"
                style={{ left: "18.77%", top: "11.17%" }}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
