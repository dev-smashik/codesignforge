"use client";

import { useEffect, useRef, useState } from "react";

import { GlowBackdrop } from "./glow-backdrop";

/**
 * Liquid WebGL backdrop for the hero (threejs-components liquid1).
 *
 * Progressive enhancement over the static GlowBackdrop:
 * - Canvas is client-only (dynamic import in an effect — nothing ships on
 *   the server), rendered above the static fallback and faded in once
 *   initialized.
 * - The static blurred-glow backdrop stays beneath and is used verbatim as
 *   the fallback for `prefers-reduced-motion`, missing WebGL support, and
 *   any initialization/network failure.
 *
 * Settings match the owner's reference snippet: local copy of the design's
 * glow bitmap, metalness 0.75, roughness 0.25, displacementScale 5, rain
 * disabled.
 *
 * Licensing note: threejs-components is CC BY-NC-SA 4.0 — non-commercial
 * use only. Appropriate credit is retained in types/threejs-components-liquid.d.ts.
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

    import("threejs-components/build/backgrounds/liquid1.min")
      .then((create) => {
        if (disposed) return null;
        const app = create.default(canvas);
        app.loadImage("/landing/home/glow-bg.png");
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.material.uniforms.displacementScale.value = 5;
        app.setRain(false);
        if (disposed) return null;
        setLiquidReady(true);
        return app;
      })
      .catch(() => {
        // Initialization failed → the static backdrop remains visible.
      });

    return () => {
      disposed = true;
      setLiquidReady(false);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
      <GlowBackdrop />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-500 ${
          liquidReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/* Cleanup note: the library drives its own render loop from the canvas
   element; when the canvas is removed from the DOM (unmount/route change)
   the loop terminates with it. GPU resources for the failed-case have no
   allocations because the app is never created. */
