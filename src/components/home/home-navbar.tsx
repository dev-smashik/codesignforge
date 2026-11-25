"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatedStroke } from "@/components/home/animated-stroke";

const links = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Insights", "#case-studies"],
  ["Pricing", "#pricing"],
  ["More", "#more"],
] as const;

function TalkButton() {
  return (
    <a
      className="nav-talk-button"
      href="#contact"
    >
      <span>Let’s Talk</span>
      <AnimatedStroke className="nav-button-stroke" />
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
