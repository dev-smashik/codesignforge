/** Small outlined pill badge with the key icon, per the Figma badge (node 3:131). */
export function EarlyAccessBadge() {
  return (
    <span className="relative inline-flex h-8 items-center justify-center gap-2 overflow-hidden rounded-pill border border-hairline px-4 shadow-[0px_0px_16px_1px_rgba(253,79,36,0.12)]">
      {/* Dark gradient underlay with slight inner inset shadows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-pill bg-linear-to-r from-[#070707] via-[#252525] to-[#070707]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-pill shadow-[inset_0px_-1px_4px_0.5px_rgba(19,19,19,0.5),inset_0px_1px_4px_0.5px_rgba(19,19,19,0.5)]"
      />
      <img
        src="/landing/icon-key.svg"
        alt=""
        aria-hidden="true"
        className="relative size-3.5 lg:size-4"
        width={16}
        height={16}
      />
      <span className="relative whitespace-nowrap text-center text-sm font-normal leading-[1.8] tracking-normal text-white">
        Get Early Access
      </span>
    </span>
  );
}
