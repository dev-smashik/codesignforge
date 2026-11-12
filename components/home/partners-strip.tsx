import { SITE } from "@/lib/site";

/**
 * Trust strip (Figma desktop 81:2228 / mobile 85:2761): "Trusted by 30+
 * companies" copied verbatim from the design, followed by the five supplied
 * partner marks. Desktop lays them out on a single row (justify-between);
 * mobile centers and clips the row like the Figma mobile frame.
 *
 * The marks are the exact assets from the design file — no invented
 * endorsements. Replace or drop any company before publishing without
 * their consent.
 */
const icon = "/landing/home/siteassist-icon.svg";
const aarsisIcon = "/landing/home/aarsis-icon.svg";

function PartnerLogos() {
  return (
    <div className="partner-marquee-group">
      <img
        src="/landing/home/skinsinz-logo.png"
        alt="ScreenSkinz Technology"
        className="h-6 w-auto min-[1400px]:h-[42px]"
        draggable={false}
      />

      <span className="flex items-center gap-2">
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="size-6 shrink-0 min-[1400px]:size-10"
        />
        <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white min-[1400px]:text-[32px] min-[1400px]:leading-[1.3]">
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
          className="size-6 w-[22.4px] shrink-0 min-[1400px]:size-10"
        />
        <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white min-[1400px]:text-[32px] min-[1400px]:leading-[1.3]">
          aarsis
        </span>
      </span>

      <span className="text-center font-sans text-2xl font-medium leading-[1.5] text-white min-[1400px]:text-[32px] min-[1400px]:leading-[1.3]">
        Khantrast
      </span>

      <span className="relative inline-block h-6 w-[133px] overflow-hidden min-[1400px]:h-[42px] min-[1400px]:w-[232px]">
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
  );
}

export function PartnersStrip() {
  return (
    <section
      aria-label="Trusted by companies"
      className="relative z-20 order-2 w-full overflow-hidden px-4 py-4 min-[1400px]:absolute min-[1400px]:left-1/2 min-[1400px]:top-[658px] min-[1400px]:order-none min-[1400px]:h-[162px] min-[1400px]:w-[1236px] min-[1400px]:-translate-x-1/2 min-[1400px]:px-10 min-[1400px]:py-4"
    >
      <div className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-2 lg:gap-6">
        <p className="text-center text-sm font-medium leading-[1.8] text-white lg:text-base lg:leading-[1.48]">
          {SITE.trustedLabel}
        </p>

        <div
          role="region"
          aria-label="Partner logos, automatically scrolling"
          tabIndex={0}
          className="partner-marquee no-scrollbar w-full max-w-[1120px] overflow-x-auto focus-visible:outline-2 focus-visible:outline-[#fd4f24] focus-visible:outline-offset-2 min-[1400px]:overflow-visible"
        >
          <div className="partner-marquee-track">
            <PartnerLogos />
            <div aria-hidden="true" className="partner-marquee-copy">
              <PartnerLogos />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
