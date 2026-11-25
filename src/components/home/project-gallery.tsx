import Image from "next/image";

type CardKind = "wide" | "square" | "featured";
type ProjectCard = { src: string; alt: string; kind: CardKind };

const firstGallery: ProjectCard[] = [
  { src: "/assets/hero/f2d5e.png", alt: "Healthcare app design", kind: "wide" },
  { src: "/assets/hero/717a5.png", alt: "Online shopping product design", kind: "square" },
  { src: "/assets/hero/f8af1.png", alt: "Humanoid robotics website design", kind: "wide" },
  { src: "/assets/hero/6f7bf.png", alt: "Mobile finance app design", kind: "square" },
  { src: "/assets/hero/eae1d.png", alt: "Featured promotional website project", kind: "featured" },
  { src: "/assets/hero/11c8e.png", alt: "Wellness mobile app design", kind: "square" },
  { src: "/assets/hero/f2d5e.png", alt: "Healthcare app design", kind: "wide" },
];

const secondGallery: ProjectCard[] = [
  { src: "/assets/hero/f8af1.png", alt: "Humanoid robotics website design", kind: "wide" },
  { src: "/assets/hero/6f7bf.png", alt: "Mobile finance app design", kind: "square" },
  { src: "/assets/hero/eae1d.png", alt: "Featured promotional website project", kind: "featured" },
  { src: "/assets/hero/f2d5e.png", alt: "Healthcare app design", kind: "wide" },
  { src: "/assets/hero/717a5.png", alt: "Online shopping product design", kind: "square" },
  { src: "/assets/hero/11c8e.png", alt: "Wellness mobile app design", kind: "wide" },
  { src: "/assets/hero/6f7bf.png", alt: "Mobile finance app design", kind: "square" },
];

function FeaturedProject({ src }: { src: string }) {
  return (
    <div className="project-featured-art">
      <div className="project-featured-glow project-featured-glow-one" />
      <div className="project-featured-glow project-featured-glow-two" />
      <Image className="project-featured-image" src={src} alt="" fill sizes="320px" />
      <div className="project-featured-scrim" />
      <div className="project-featured-metadata"><span className="project-featured-brand"><i>✦</i> MEGABiT</span><span className="project-featured-screen-count">17 Screens</span></div>
      <div className="project-featured-tagline"><b>We Design</b><b>&amp; Build</b><strong>Digital Website!</strong><div><span>UI/UX Design</span><span>Web Design</span></div></div>
      <div className="project-featured-attributes"><span>✦&nbsp; Modern Design</span><span>✦&nbsp; Promotional Website</span></div>
    </div>
  );
}

function ProjectPreview({ card, duplicate }: { card: ProjectCard; duplicate: boolean }) {
  return (
    <article className={`project-preview project-preview-${card.kind}`}>
      {card.kind === "featured" ? <FeaturedProject src={card.src} /> : <Image src={card.src} alt={duplicate ? "" : card.alt} fill sizes={card.kind === "wide" ? "320px" : "224px"} />}
    </article>
  );
}

function GalleryTrack({ cards, direction, label }: { cards: ProjectCard[]; direction: "left" | "right"; label: string }) {
  return (
    <div className={`project-gallery-lane project-gallery-lane-${direction}`} role="group" aria-label={label}>
      <div className="project-gallery-track">
        {[0, 1].map((copy) => (
          <div className="project-gallery-set" key={copy} aria-hidden={copy === 1}>
            {cards.map((card, index) => <ProjectPreview key={`${card.kind}-${index}`} card={card} duplicate={copy === 1} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectGallery() {
  return (
    <section className="project-gallery" aria-label="Selected CoDesign Forge projects">
      <GalleryTrack cards={firstGallery} direction="left" label="Project gallery one, moving right to left" />
      <GalleryTrack cards={secondGallery} direction="right" label="Project gallery two, moving left to right" />
    </section>
  );
}
