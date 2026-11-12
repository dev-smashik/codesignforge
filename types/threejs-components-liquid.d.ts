/**
 * Ambient declaration for the untyped threejs-components liquid backdrop.
 *
 * LiquidBackground: LiquidBackgroundFactory
 * Attribution (per upstream author):
 *   Library: threejs-components (build/backgrounds/liquid1.min.js)
 *   Licence: CC BY-NC-SA 4.0 (see https://creativecommons.org/licenses/by-nc-sa/4.0/)
 */
declare module "threejs-components/build/backgrounds/liquid1.min.js" {
  export interface LiquidPlane {
    material: {
      metalness: number;
      roughness: number;
      dispose?: () => void;
    };
    /** Plane-level uniforms (uvMapScale, displacementMap, displacementScale). */
    uniforms: {
      displacementScale: { value: number };
      uvMapScale?: { value: unknown };
      displacementMap?: { value: unknown };
    };
    geometry?: { dispose?: () => void };
  }

  export interface LiquidApp {
    loadImage: (url: string) => Promise<void> | void;
    setRain: (enabled: boolean) => void;
    liquidPlane: LiquidPlane;
    /** Releases mouse listeners, the liquid plane and the WebGL renderer. */
    dispose?: () => void;
    renderer?: { dispose?: () => void; domElement?: HTMLCanvasElement };
  }

  type LiquidBackgroundFactory = (
    canvas: HTMLCanvasElement,
  ) => LiquidApp;

  const LiquidBackground: LiquidBackgroundFactory;
  export default LiquidBackground;
}
