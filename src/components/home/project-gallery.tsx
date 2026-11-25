"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const cardCount = 10;
const step = 360 / cardCount;
const projects = [
  { src: "/assets/hero/f2d5e.png", alt: "Healthcare app design" },
  { src: "/assets/hero/717a5.png", alt: "Online shopping product design" },
  { src: "/assets/hero/f8af1.png", alt: "Robotics website design" },
  { src: "/assets/hero/6f7bf.png", alt: "Mobile finance app design" },
  { src: "/assets/hero/eae1d.png", alt: "Featured digital product design" },
  { src: "/assets/hero/11c8e.png", alt: "Wellness mobile app design" },
];

export function ProjectGallery() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dragX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const rotation = useRef(180);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    let frame = 0;
    let lastFrame = 0;
    const animate = (now: number) => {
      if (lastFrame && !isDragging.current && ringRef.current) {
        const elapsed = Math.min(now - lastFrame, 50);
        rotation.current -= elapsed * 0.01;
        ringRef.current.style.setProperty("--ring-rotation", `${rotation.current}deg`);
      }
      lastFrame = now;
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragX.current === null || !ringRef.current) return;

    const delta = event.clientX - dragX.current;
    rotation.current -= delta * 0.24;
    dragX.current = event.clientX;
    ringRef.current.style.setProperty("--ring-rotation", `${rotation.current}deg`);

    ringRef.current.querySelectorAll<HTMLElement>(".hero-ring-card").forEach((card, index) => {
      const angle = ((rotation.current - 180 - index * step) % 360 + 360) % 360;
      card.style.setProperty("--card-parallax", `${(-angle / 360) * 400}px`);
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragX.current = null;
    isDragging.current = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="hero-ring-showcase" aria-label="Interactive 3D project showcase">
      <div
        className="hero-ring-drag-surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="hero-ring" ref={ringRef}>
          {Array.from({ length: cardCount }, (_, index) => {
            const project = projects[index % projects.length];
            return (
              <article
                aria-hidden="true"
                className={`hero-ring-card hero-ring-card-${index % 5}`}
                key={index}
                style={{ "--card-index": index } as React.CSSProperties}
              >
                <Image src={project.src} alt={project.alt} fill sizes="(max-width: 760px) 190px, (max-width: 1100px) 32vw, 33vw" />
              </article>
            );
          })}
        </div>
      </div>
      <span className="sr-only">Drag horizontally to rotate the project showcase cards.</span>
    </section>
  );
}
