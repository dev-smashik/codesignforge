"use client";

import { useEffect, useRef, useState } from "react";

import { GlowBackdrop } from "./glow-backdrop";

/**
 * Liquid WebGL backdrop for the hero (threejs-components, liquid1).
 *
 * Progressive enhancement over the static GlowBackdrop:
 * - The canvas is client-only (dynamic import inside an effect), so nothing
 *   is rendered or downloaded on the server.
 * - The static blurred-glow backdrop stays underneath and is used verbatim
 *   as the fallback for `prefers-reduced-motion`, missing WebGL support
 *   and any initialization/network failure.
 * - The canvas fades in once the liquid scene is live; it is
 *   `pointer-events-none` so it can never block the page, and the
 *   underlying static image still provides the page's visual anchor.
 *
 * Settings match the owner's reference snippet: the local copy of the
 * design's glow bitmap, metalness 0.75, roughness 0.25,
 * displacementScale 5, rain disabled.
 *
 * Note: the displacement uniform lives on the plane
 * (`liquidPlane.uniforms.displacementScale`), not on the material.
 *
 * Licensing note: threejs-components is CC BY-NC-SA 4.0 (non-commercial
 * use). Attribution is retained in types/threejs-components-liquid.d.ts.
 */
export function LiquidBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liquidReady, setLiquidReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Declined paths → static fallback only.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("WebGLRenderingContext" in window)
    ) {
      return;
    }

    let disposed = false;
    let app: { dispose?: () => void } | null = null;

    import("threejs-components/build/backgrounds/liquid1.min.js")
      .then((create) => {
        if (disposed) return;
        const liquid = create.default(canvas);
        app = liquid;
        liquid.loadImage("/landing/home/glow-bg.png");
        liquid.liquidPlane.material.metalness = 0.75;
        liquid.liquidPlane.material.roughness = 0.25;
        liquid.liquidPlane.uniforms.displacementScale.value = 5;
        liquid.setRain(false);
        if (disposed) return;
        setLiquidReady(true);
      })
      .catch((error: unknown) => {
        // Initialization failed → the static backdrop remains visible.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[liquid] backdrop unavailable", error);
        }
      });

    return () => {
      disposed = true;
      setLiquidReady(false);
      // Releases the mouse listeners, the liquid plane and the WebGL
      // renderer, so nothing keeps running after the canvas is gone.
      app?.dispose?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-clip blur-[5px]"
    >
      {/* Static fallback: blurred glow bitmap (also the no-WebGL state). */}
      <GlowBackdrop />

      {/* Live liquid surface. */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-500 ${
          liquidReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Brand scrim above the canvas: the library's environment
          reflections wash the upper viewport grey, while the design keeps
          it #101010 with the glow concentrated low. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#101010] from-[0%] via-[#101010]/60 via-[45%] to-transparent" />
    </div>
  );
}
