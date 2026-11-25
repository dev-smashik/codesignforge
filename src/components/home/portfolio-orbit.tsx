"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const projects = [
  { src: "/assets/portfolio/36f20.png", alt: "Screen Skinz product website" },
  { src: "/assets/portfolio/96212.png", alt: "OneBasket family safety product website" },
  { src: "/assets/portfolio/68cf5.png", alt: "Artificial intelligence sports betting product website" },
  { src: "/assets/portfolio/36f20.png", alt: "Screen Skinz product website" },
  { src: "/assets/portfolio/96212.png", alt: "OneBasket family safety product website" },
  { src: "/assets/portfolio/68cf5.png", alt: "Artificial intelligence sports betting product website" },
  { src: "/assets/portfolio/36f20.png", alt: "Screen Skinz product website" },
  { src: "/assets/portfolio/68cf5.png", alt: "Artificial intelligence sports betting product website" },
];

const orbitStep = (Math.PI * 2) / projects.length;
const cardTiltStep = Math.PI / 6;
const orbitRadiusX = 1_120;
const orbitRadiusY = 693;

function paintCards(stage: HTMLDivElement, position: number) {
  const cards = stage.querySelectorAll<HTMLElement>("[data-portfolio-card]");
  const stageWidth = stage.clientWidth;
  const mobile = stageWidth < 760;
  const scale = mobile ? Math.max(0.48, stageWidth / 1920) : Math.min(1, stageWidth / 1920);
  const guide = stage.querySelector<HTMLElement>(".portfolio-arc-guide");
  if (guide) {
    guide.style.width = `${2_976 * scale}px`;
    guide.style.height = `${2_976 * scale}px`;
    guide.style.top = `${112 * scale}px`;
  }

  const frontCards = new Set(
    Array.from(cards, (_, index) => {
      let distance = index - position;
      while (distance > projects.length / 2) distance -= projects.length;
      while (distance < -projects.length / 2) distance += projects.length;
      return { index, distance: Math.abs(distance) };
    })
      .sort((a, b) => a.distance - b.distance || a.index - b.index)
      .slice(0, 3)
      .map(({ index }) => index),
  );

  cards.forEach((card, index) => {
    let distance = index - position;
    while (distance > projects.length / 2) distance -= projects.length;
    while (distance < -projects.length / 2) distance += projects.length;

    const absoluteDistance = Math.abs(distance);
    const orbitAngle = distance * orbitStep;
    // Keep back-row cards upright and give the two visible rear cards the same
    // outward 30° lean as their matching cards on the front sides.
    const cardAngle = Math.abs(distance) === 3 ? Math.sign(distance) * cardTiltStep : distance * cardTiltStep;
    const cardScale = absoluteDistance <= 1 ? 1 : Math.max(0.58, 1 - (absoluteDistance - 1) * 0.1);
    const isFrontCard = frontCards.has(index);
    const width = 600 * scale;
    const height = 800 * scale;
    const centerX = stageWidth / 2 + orbitRadiusX * scale * Math.sin(orbitAngle);
    const centerY = (400 + orbitRadiusY * (1 - Math.cos(orbitAngle))) * scale;
    const cardCenterX = ((width / 2) * Math.cos(cardAngle) - (height / 2) * Math.sin(cardAngle)) * cardScale;
    const cardCenterY = ((width / 2) * Math.sin(cardAngle) + (height / 2) * Math.cos(cardAngle)) * cardScale;
    const left = centerX - cardCenterX;
    const top = centerY - cardCenterY;
    const depth = -Math.max(0, absoluteDistance - 1) * 130 * scale;
    card.style.width = `${width}px`;
    card.style.height = `${height}px`;
    card.style.transform = `translate3d(${left}px, ${top}px, ${depth}px) rotate(${cardAngle}rad) scale(${cardScale})`;
    card.style.left = "0px";
    card.style.top = "0px";
    card.style.visibility = isFrontCard ? "visible" : "hidden";
    card.style.zIndex = `${100 - Math.round(absoluteDistance * 10)}`;
    card.style.pointerEvents = isFrontCard ? "auto" : "none";
    card.setAttribute("aria-hidden", isFrontCard ? "false" : "true");
    card.inert = !isFrontCard;
  });
}

export function PortfolioOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const pointerStart = useRef<{ x: number; position: number; pointerId: number } | null>(null);
  const dragging = useRef(false);
  const suppressClick = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    paintCards(stage, position.current);
    const handleResize = () => paintCards(stage, position.current);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointerStart.current = { x: event.clientX, position: position.current, pointerId: event.pointerId };
    suppressClick.current = false;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    const start = pointerStart.current;
    if (!stage || !start) return;
    const delta = event.clientX - start.x;
    if (!dragging.current && Math.abs(delta) > 5) {
      dragging.current = true;
      suppressClick.current = true;
      event.currentTarget.classList.add("is-dragging");
      event.currentTarget.setPointerCapture(start.pointerId);
    }
    if (dragging.current) {
      position.current = start.position - delta / Math.max(360, stage.clientWidth * 0.62);
      paintCards(stage, position.current);
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current && stageRef.current) {
      position.current = ((Math.round(position.current) % projects.length) + projects.length) % projects.length;
      paintCards(stageRef.current, position.current);
      event.currentTarget.classList.remove("is-dragging");
    }
    dragging.current = false;
    pointerStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="portfolio" id="projects">
      <header className="section-heading">
        <h2>Turning Ambitious Ideas Into Digital Excellence.</h2>
        <p>Everything between an idea and a product people<br /> trust. Designed, built, launched and branded.</p>
      </header>
      <div
        className="portfolio-arc-stage"
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        aria-label="Project carousel. Hold and drag left or right to rotate."
      >
        <div className="portfolio-arc-guide" aria-hidden="true" />
        <div className="portfolio-arc-track">
          {projects.map((project, index) => (
            <article className="portfolio-arc-card" data-portfolio-card key={`${project.src}-${index}`}>
              <Image src={project.src} alt={project.alt} fill sizes="(max-width: 760px) 82vw, 600px" draggable={false} />
              <a className="portfolio-arc-link" href="#case-studies">
                <span>View Product</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.487 16.735 10.787 21.303 10.99L21.75 11V13C16.931 13 13.75 16.416 13.75 19.5H11.75C11.75 17 13.136 14.606 15.368 13H2.25V11H15.368C13.136 9.394 11.75 7.001 11.75 4.5h2Z" fill="currentColor" /></svg>
              </a>
            </article>
          ))}
        </div>
        <span className="sr-only">Hold and drag horizontally to move through the project cards.</span>
      </div>
    </section>
  );
}
