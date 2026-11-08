/**
 * Decorative hero globe: orange rim glow + wireframe latitude/longitude grid.
 *
 * Rebuilt faithfully from the Figma "radial light" + "globe wire grid" layers
 * (frame 3:2). The light stack per the design, in order:
 *   1. wide rim arcs (additive via mix-blend-plus-lighter)
 *   2. opaque dark half-disk (Ellipse 3417) that occludes all glow inside the
 *      globe's face
 *   3. center spot glows (additive)
 *   4. second opaque dark half-disk (Ellipse 3418) that occludes the spots'
 *      inner spill, so light only shows outside/at the rim
 * - "globe wire grid": a 1697×1536 wire SVG clipped to 985px and faded with
 *   the design's alpha mask.
 *
 * The layer is strictly decorative: aria-hidden and pointer-events-none.
 * Positions/sizes come from the design (desktop frame 3:2, mobile 4:141003);
 * the vertical anchor is fluid between the two.
 */
import type { CSSProperties } from "react";

/** Glow stack geometries as absolute insets (percent = fraction of 1800px). */
const WIDE_GLOWS = [
  // Ellipse 3422 (wide outline band)
  "-1.22% -1.22% 48.78% -1.22%",
  // Ellipse 3423 (soft wide band, repeated 3× for additive depth)
  "-3.78% -3.78% 46.22% -3.78%",
  "-3.78% -3.78% 46.22% -3.78%",
  "-3.78% -3.78% 46.22% -3.78%",
] as const;
const SPOT_GLOWS = [
  "-1.22% 40.68% 96.76% 38.8%",
  "-3.78% 29.84% 91.73% 27.76%",
  "-3.78% 19.93% 87.87% 19.93%",
  "-3.78% 20.04% 87.94% 20.07%",
] as const;

const GLOW_FILES = {
  wide: "/landing/glow-wide-1.svg", // Ellipse 3422
  wideStack: "/landing/glow-wide-2.svg", // Ellipse 3423
  amber: "/landing/glow-amber.svg", // Ellipse 3417 — dark half-disk occluder
  spot1: "/landing/glow-narrow-1.svg", // Ellipse 3424
  spot2: "/landing/glow-narrow-2.svg", // Ellipse 3425
  spot3: "/landing/glow-narrow-3.svg", // Ellipse 3426
  spot4: "/landing/glow-narrow-4.svg", // Ellipse 3427
  loose: "/landing/glow-loose.svg", // Ellipse 3418 — dark half-disk occluder
} as const;

function GlowImage({
  file,
  inset,
}: {
  file: string;
  inset: string;
}) {
  return (
    <div className="absolute mix-blend-plus-lighter" style={{ inset }}>
      <img src={file} alt="" className="block size-full" aria-hidden="true" />
    </div>
  );
}

/** Opaque #101010 half-disk that occludes glow inside the globe's face. */
function OccluderDisk({ file }: { file: string }) {
  return (
    <div className="absolute inset-x-0 top-0 h-1/2">
      <img src={file} alt="" className="block size-full" aria-hidden="true" />
    </div>
  );
}

export function GlobeBackdrop() {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: "url(/landing/wire-grid-mask.svg)",
    maskImage: "url(/landing/wire-grid-mask.svg)",
    WebkitMaskSize: "var(--grid-mask-size)",
    maskSize: "var(--grid-mask-size)",
    WebkitMaskPosition: "var(--grid-mask-pos)",
    maskPosition: "var(--grid-mask-pos)",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {/* Figma 38:198 — full-frame gradient (transparent → #101010 at
          58.824%). Sits behind the globe stack, matching the design's layer
          order; solid #101010 over the page background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,16,16,0)_0%,#101010_58.824%)]"
      />
      {/* Anchored like the design: lower on small viewports, higher on desktop.
          The desktop top interpolates the two design frames (y=97 @897h,
          y=175 @1080h). The canvas width follows the viewport (1800px @1440,
          2024px @1920) so the rim always reaches both edges. */}
      <div className="absolute left-1/2 top-[21svh] -translate-x-1/2 lg:top-[max(6.25rem,calc(42.6svh-285px))]">
        {/* Radial light — 1800×1800 glow system. Matches Figma 3:71 exactly:
            a positioned 1800×718 box with NO mask and NO overflow-clip. The
            canvas intentionally spills above the box (halo fades into the
            sky) and below it (only off-viewport ring bottoms). Do NOT add a
            mask or clip here — either severs the halo with a hard edge. */}
        <div className="relative h-179.5 w-450 min-[1920px]:h-206.75 min-[1920px]:w-506">
          <div className="relative size-450 min-[1920px]:h-450 min-[1920px]:w-506 min-[1920px]:translate-x-2.5">
            {/* Wide bands, then dark occluder disk (design layer order) */}
            <GlowImage file={GLOW_FILES.wide} inset={WIDE_GLOWS[0] as string} />
            <GlowImage
              file={GLOW_FILES.wideStack}
              inset={WIDE_GLOWS[1] as string}
            />
            <GlowImage
              file={GLOW_FILES.wideStack}
              inset={WIDE_GLOWS[2] as string}
            />
            <GlowImage
              file={GLOW_FILES.wideStack}
              inset={WIDE_GLOWS[3] as string}
            />
            <OccluderDisk file={GLOW_FILES.amber} />
            {/* Bright center spots, then their occluder */}
            <GlowImage file={GLOW_FILES.spot1} inset={SPOT_GLOWS[0]} />
            <GlowImage file={GLOW_FILES.spot2} inset={SPOT_GLOWS[1]} />
            <GlowImage file={GLOW_FILES.spot3} inset={SPOT_GLOWS[2]} />
            <GlowImage file={GLOW_FILES.spot4} inset={SPOT_GLOWS[3]} />
            <OccluderDisk file={GLOW_FILES.loose} />
          </div>
        </div>
        {/* Wire grid, alpha-masked so it fades with distance from the rim */}
        <div className="absolute left-1/2 top-0 h-246.25 w-424.25 -translate-x-1/2 overflow-clip [--grid-mask-pos:0px_0.173px] [--grid-mask-size:1697px_985px] min-[1920px]:h-226.25 min-[1920px]:w-473 min-[1920px]:[--grid-mask-pos:0px_0.194px] min-[1920px]:[--grid-mask-size:1939px_1108px]">
          <div
            className="absolute inset-[-0.02%_0_-55.95%_0] min-[1920px]:inset-[-0.02%_-3.24%_-90.93%_-2.18%]"
            style={maskStyle}
          >
            <img
              src="/landing/wire-grid.svg"
              alt=""
              width={1697}
              className="absolute inset-0 block size-full"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
