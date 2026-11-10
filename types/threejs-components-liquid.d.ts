/**
 * Ambient declaration for the untyped threejs-components liquid backdrop.
 *
 * LiquidBackground: LiquidBackgroundFactory
 * Attribution (per upstream author):
 *   Library: threejs-components (build/backgrounds/liquid1.min.js)
 *   Licence: CC BY-NC-SA 4.0 (see https://creativecommons.org/licenses/by-nc-sa/4.0/)
 */
declare module "threejs-components/build/backgrounds/liquid1.min" {
  export interface LiquidPlane {
    material: {
      metalness: number;
      roughness: number;
      uniforms: { displacementScale: { value: number } } & Record<string, { value: unknown }>;
      dispose?: () => void;
    };
    geometry?: { dispose?: () => void };
  }

  export interface LiquidApp {
    loadImage: (url: string) => Promise<void> | void;
    setRain: (enabled: boolean) => void;
    liquidPlane: LiquidPlane;
    stop?: () => void;
    dispose?: () => void;
    renderer?: { dispose?: () => void; domElement?: HTMLCanvasElement };
  }

  type LiquidBackgroundFactory = (
    canvas: HTMLCanvasElement,
  ) => LiquidApp;

  const LiquidBackground: LiquidBackgroundFactory;
  export default LiquidBackground;
}
