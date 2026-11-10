/**
 * "Crafted by Humans. Accelerated by AI" pill badge (Figma node 67:2061).
 * Orange-tinted border + glow shadow, 101010→2a2a2a gradient wash behind,
 * inner top/bottom shading, 8px green status dot from the supplied asset.
 */
export function HeroBadge() {
  return (
    <div className="relative inline-flex h-8 shrink-0 items-center overflow-hidden rounded-full border border-[rgba(220,83,44,0.4)] px-4 shadow-[0px_0px_16px_1px_rgba(253,79,36,0.12)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#101010] via-[#2a2a2a] to-[#101010]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-1px_4px_0.5px_rgba(19,19,19,0.5),inset_0px_1px_4px_0.5px_rgba(19,19,19,0.5)]"
      />
      <img
        src="/landing/home/dot-success.svg"
        alt=""
        aria-hidden="true"
        width={8}
        height={8}
        className="relative size-2 shrink-0"
      />
      <span className="relative ml-2 whitespace-nowrap text-center text-sm leading-[1.8] text-white">
        Crafted by Humans. Accelerated by AI
      </span>
    </div>
  );
}
