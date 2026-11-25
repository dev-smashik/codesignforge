"use client";

import { useEffect, useRef } from "react";

const introduction = "We are a digital product design and engineering partner helping startups, scaleups, and enterprises build meaningful digital experiences through human centered design, modern technology, and AI powered innovation.";
const characters = Array.from(introduction);

function getColor(progress: number) {
  const from = progress < 0.45 ? [212, 212, 216] : [255, 75, 0];
  const to = progress < 0.45 ? [255, 75, 0] : [11, 11, 11];
  const amount = progress < 0.45 ? progress / 0.45 : (progress - 0.45) / 0.55;
  const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  return `rgb(${channels.join(" ")})`;
}

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const textCharacters = textRef.current?.querySelectorAll<HTMLElement>("[data-intro-character]");
    if (!textCharacters?.length) return;

    let frame = 0;
    let countFrame = 0;
    let lastFrame = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    let countsStarted = false;
    let countStartedAt = 0;
    const counters = sectionRef.current?.querySelectorAll<HTMLElement>("[data-count-to]");

    const renderCounts = (progress: number) => {
      counters?.forEach((counter) => {
        const target = Number(counter.dataset.countTo);
        const suffix = counter.dataset.countSuffix ?? "";
        const eased = 1 - (1 - progress) ** 4;
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
      });
    };

    const animateCounts = (now: number) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - countStartedAt) / 700);
      renderCounts(progress);
      if (progress < 1) {
        countFrame = window.requestAnimationFrame(animateCounts);
      } else {
        countFrame = 0;
      }
    };

    const renderProgress = (sectionProgress: number) => {
      textCharacters.forEach((character, index) => {
        const progress = Math.max(0, Math.min(1, sectionProgress * textCharacters.length - index));
        character.style.color = getColor(progress);
        character.style.opacity = String(progress);
      });
    };

    const animateReveal = (now: number) => {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 16;
      lastFrame = now;
      const smoothing = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 85);
      currentProgress += (targetProgress - currentProgress) * smoothing;

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
        renderProgress(currentProgress);
        frame = 0;
        lastFrame = 0;
        return;
      }

      renderProgress(currentProgress);
      frame = window.requestAnimationFrame(animateReveal);
    };

    const requestUpdate = () => {
      if (!sectionRef.current) return;
      const viewportHeight = window.innerHeight;
      const statsTop = sectionRef.current.querySelector(".stats")?.getBoundingClientRect().top ?? Infinity;
      if (!countsStarted && statsTop < viewportHeight * 0.85) {
        countsStarted = true;
        countStartedAt = performance.now();
        countFrame = window.requestAnimationFrame(animateCounts);
      }
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const revealStart = viewportHeight * 0.85;
      const revealRange = viewportHeight * 0.35;
      const rawProgress = reducedMotion.matches
        ? 1
        : Math.max(0, Math.min(1, (revealStart - sectionTop) / revealRange));
      targetProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      if (!frame) frame = window.requestAnimationFrame(animateReveal);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(countFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <section className="intro" ref={sectionRef}>
      <span className="eyebrow">The Codesign Forge</span>
      <div className="intro-content">
        <p className="intro-copy" ref={textRef} aria-label={introduction}>
          {characters.map((character, index) => (
            <span aria-hidden="true" data-intro-character key={`${character}-${index}`}>
              {character}
            </span>
          ))}
        </p>
        <div className="stats">
          <div><strong>Since <span data-count-to="2026">2026</span></strong><span>Founded</span></div>
          <div><strong><span data-count-to="10" data-count-suffix="+">10+</span></strong><span>Product Launched</span></div>
          <div><strong><span data-count-to="6" data-count-suffix="+">6+</span></strong><span>Countries our clients ship from</span></div>
        </div>
        <a className="text-link" href="#about">
          About Codesign Forge
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="currentColor" /></svg>
        </a>
      </div>
    </section>
  );
}
