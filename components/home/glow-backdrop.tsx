/**
 * Homepage background: the supplied radial orange "glow" bitmap, blurred
 * (95px blur radius), positioned to match the desktop and mobile Figma frames.
 * The glow gently pulses without affecting foreground content and stays still
 * for visitors who prefer reduced motion.
 */
export function GlowBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <img
        src="/landing/home/glow-bg.png"
        alt=""
        className="absolute inset-x-0 top-[-133px] h-[945px] w-full blur-[95px] object-fill object-bottom lg:top-0 lg:h-[1080px]"
      />
      <div className="animate-glow-backdrop absolute -inset-x-[12%] top-[32%] h-[55%] bg-[radial-gradient(ellipse_at_34%_68%,rgba(255,125,70,0.48)_0%,rgba(244,77,34,0.25)_31%,transparent_68%),radial-gradient(ellipse_at_66%_72%,rgba(255,30,66,0.36)_0%,rgba(180,0,35,0.2)_34%,transparent_70%)] blur-[100px] lg:top-[38%] lg:h-[62%]" />
    </div>
  );
}
