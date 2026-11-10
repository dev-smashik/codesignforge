/**
 * Homepage background: the supplied radial orange "glow" bitmap, blurred
 * (145px blur radius per the design), pinned to the bottom of the viewport
 * and fully decorative (pointer-events-none). Reduced motion / static by
 * construction — it's a plain image, no canvas or WebGL involved.
 */
export function GlowBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-clip"
    >
      <img
        src="/landing/home/glow-bg.png"
        alt=""
        className="absolute inset-0 size-full object-cover object-bottom blur-[20px]"
      />
      {/* The design keeps the upper viewport nearly #101010 with the glow
          concentrated low; the blurred bitmap alone washes the top, so a
          scrim restores the intended falloff. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101010] from-[16%] via-[#101010]/60 via-[45%] to-transparent" />
    </div>
  );
}
