"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CTA_LINKS, NAV_LINKS } from "@/lib/site";

/**
 * Mobile hamburger menu (Figma: menu-09 icon button) with a lightweight
 * disclosure panel. Server-rendered until opened; fully keyboard accessible.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = "home-mobile-menu";
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex size-8 items-center justify-center overflow-hidden rounded-social bg-[#101010] p-1 transition-opacity hover:opacity-80"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <img
          src="/landing/home/menu-icon.svg"
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          className="size-6"
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="absolute right-0 top-10 z-50 w-64 rounded-lg border border-line bg-panel p-2 shadow-xl backdrop-blur-2xl"
        >
          <nav aria-label="Mobile">
            <ul role="list" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-md px-4 py-2.5 text-base font-medium text-white hover:bg-[#1f1f1f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-2 border-t border-line pt-2">
            <Link
              href={CTA_LINKS.letstalk.href}
              onClick={() => setOpen(false)}
              className="cta-glow flex h-10 items-center justify-center gap-1 rounded-social border border-[#dc532c] px-5 font-brand text-base font-medium text-white"
            >
              {CTA_LINKS.letstalk.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
