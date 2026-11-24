"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Insights", "#case-studies"],
  ["Pricing", "#pricing"],
  ["More", "#more"],
] as const;

const strokeTrail = Array.from({ length: 24 }, (_, index) => ({
  length: 24 - index,
  opacity: index / 23,
}));

function TalkButton() {
  return (
    <a
      className="nav-talk-button"
      href="#contact"
    >
      <span>Let’s Talk</span>
      <svg className="nav-button-stroke" viewBox="0 0 134.5 49.5" preserveAspectRatio="none" aria-hidden="true">
        {strokeTrail.map(({ length, opacity }) => {
          const offset = length - 24;

          return (
            <rect
              key={length}
              x=".25"
              y=".25"
              width="134"
              height="49"
              rx="8.25"
              fill="none"
              stroke="#f97316"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity={opacity}
              pathLength="100"
              strokeDasharray={`${length} ${100 - length}`}
            >
              <animate
                attributeName="stroke-dashoffset"
                from={offset}
                to={offset - 100}
                dur="6s"
                repeatCount="indefinite"
              />
            </rect>
          );
        })}
      </svg>
      <Image src="/assets/case-studies/1e04d.svg" alt="" width={24} height={24} />
    </a>
  );
}

export function HomeNavbar() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateNavbar = () => setCompact(window.scrollY > 72);
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  return (
    <header className="home-nav-shell">
      <div className={`home-nav${compact ? " is-compact" : ""}`}>
        <a className="wordmark" href="#home" aria-label="CoDesign Forge home">
          <Image src="/assets/navbar-mark.svg" alt="" width={32} height={32} />
          <span>CoDesign Forge</span>
        </a>
        <nav className={menuOpen ? "is-open" : ""} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              <span>{label}</span>
              {label === "Services" && <span className="nav-chevron" aria-hidden="true"><Image src="/assets/navbar-chevron.svg" alt="" width={16} height={16} /></span>}
            </a>
          ))}
          <div className="nav-mobile-cta"><TalkButton /></div>
        </nav>
        <div className="nav-desktop-cta"><TalkButton /></div>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
