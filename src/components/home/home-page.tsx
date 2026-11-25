"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HomeNavbar } from "@/components/home/home-navbar";
import { AnimatedStroke } from "@/components/home/animated-stroke";
import { ProjectGallery } from "@/components/home/project-gallery";
import { IntroSection } from "@/components/home/intro-section";
import { PortfolioOrbit } from "@/components/home/portfolio-orbit";
import { ImmersiveMotionCTA } from "@/components/home/immersive-motion-cta";

const services = [
  { title: "UI/UX & Product Design", description: "We transform complex ideas into intuitive, user centered digital experiences. From product strategy and UX research to interface design and design systems, we create products that users love and businesses grow with.", bullets: ["Research and discovery", "Interface design", "UX flows and prototypes", "Design systems"] },
  { title: "Web & App Development", description: "We design and engineer high performance websites and scalable web applications tailored to your business needs. From modern marketing websites to sophisticated SaaS platforms, we build digital experiences ready for growth.", bullets: ["SaaS Development", "Mobile App Development", "Web Application Development", "Full-Stack Development"] },
  { title: "Branding & Identity", description: "We create distinctive brand identities that communicate your vision, connect with your audience, and set your business apart. From brand strategy and logo design to complete visual systems, we build brands with purpose.", bullets: ["Logo Design", "Creative Direction", "Brand Guidelines", "Visual Identity"] },
  { title: "Webflow & Framer", description: "Custom Webflow Websites, Webflow Plugin, Framer Prototypes, Framer Material, Framer App, CMS Integration, Rapid Development.", bullets: ["Webflow Development", "CMS & Scalability", "Framer Development", "Customization & Code"] },
];

const why = [
  ["We Understand Before We Build.", "Great products begin with the right questions. We take time to understand your business, users, and challenges before shaping solutions that deliver meaningful value."],
  ["Strategy Comes Before Execution.", "We don't jump straight into design or development. We help clarify your product direction, identify opportunities, and establish a clear path from idea to execution."],
  ["Built Around Your Business Goals.", "Every business has different needs. Whether you're launching a startup, scaling a SaaS product, or transforming an existing platform, we adapt our approach to your goals and stage of growth."],
  ["Every Detail Has a Purpose.", "We combine user centered design with thoughtful engineering. Every feature, interaction, and technical decision is guided by usability, performance, scalability, and business value."],
  ["One Team. From Idea to Launch.", "No disconnected designers, developers, or fragmented workflows. We bring UI/UX design, branding, software development, and AI engineering together under one collaborative team."],
  ["We Build for What's Next.", "Launching is just the beginning. We prioritize maintainable architecture, scalable solutions, and continuous improvement to help your digital products evolve as your business grows."],
];

const questions = ["What does Codesign Forge do?", "What services can I hire Codesign Forge for?", "Can you handle both UI/UX design and web development?", "Do you work on existing websites and digital products, or only new ones?", "Which platforms and technologies do you work with?", "How does your UI/UX design and web development process work?", "How long does a website or UI/UX design project take?", "What do I need to provide before starting a project with Codesign Forge?", "Can you work with our existing in-house team?", "Do you offer ongoing website maintenance and product support?", "How do you approach project pricing?", "How do we get started with Codesign Forge?"];
const firstAnswer = ["Codesign Forge is a digital product design and development agency helping startups, SaaS companies, and growing businesses create meaningful digital experiences. We bring strategy, design, branding, and engineering together to transform ideas into functional, scalable, and user-friendly digital products.", "Our services cover the entire digital product lifecycle, from initial research and product strategy to UI/UX design, branding, website development, and custom software engineering.", "For businesses looking to establish or improve their online presence, we design and develop high-performing websites using modern technologies, Webflow, and Framer. For product teams, we work on SaaS platforms, dashboards, web applications, and mobile app experiences.", "Whether you need a new digital product, a complete website redesign, or a development partner to bring your designs to life, we help you move from concept to launch with a connected and collaborative approach."];

function ArrowButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <a className={`forge-button${light ? " forge-button-light" : ""}`} href="#contact"><span>{children}</span><span className="button-arrow" aria-hidden="true">↗</span><span className="button-arrow button-arrow-copy" aria-hidden="true">↗</span></a>;
}

function AboutAction() {
  return <a className="forge-button about-action" href="#contact"><span>Know more about us</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="currentColor" /></svg></a>;
}

function HeroAction() {
  return <a className="forge-button hero-action" href="#contact"><span className="hero-action-label">Book a free strategy call</span><svg className="hero-action-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="white" /></svg><AnimatedStroke className="hero-action-stroke" /></a>;
}

const caseStudyHeadline = "Explore how we combine strategic thinking, thoughtful design, and intelligent engineering to turn ambitious ideas into impactful digital products.";
const caseStudyHeadlineCharacters = Array.from(caseStudyHeadline);

function caseStudyRevealColor(progress: number) {
  const from = progress < 0.45 ? [212, 212, 216] : [255, 75, 0];
  const to = progress < 0.45 ? [255, 75, 0] : [11, 11, 11];
  const amount = progress < 0.45 ? progress / 0.45 : (progress - 0.45) / 0.55;
  const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  return `rgb(${channels.join(" ")})`;
}

function CaseStudyHeading() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = textRef.current;
    const textCharacters = heading?.querySelectorAll<HTMLElement>("[data-case-character]");
    if (!heading || !textCharacters?.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastFrame = 0;
    let currentProgress = reducedMotion.matches ? 1 : 0;
    let targetProgress = currentProgress;

    const renderProgress = (sectionProgress: number) => {
      textCharacters.forEach((character, index) => {
        const progress = Math.max(0, Math.min(1, sectionProgress * textCharacters.length - index));
        character.style.color = caseStudyRevealColor(progress);
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

    const updateProgress = () => {
      const viewportHeight = window.innerHeight;
      const sectionTop = heading.getBoundingClientRect().top;
      const revealStart = viewportHeight * 0.85;
      const revealRange = viewportHeight * 0.35;
      const rawProgress = reducedMotion.matches
        ? 1
        : Math.max(0, Math.min(1, (revealStart - sectionTop) / revealRange));
      targetProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      if (!frame) frame = window.requestAnimationFrame(animateReveal);
    };

    renderProgress(currentProgress);
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    reducedMotion.addEventListener("change", updateProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      reducedMotion.removeEventListener("change", updateProgress);
    };
  }, []);

  return (
    <h2 ref={textRef} aria-label={caseStudyHeadline}>
      {caseStudyHeadlineCharacters.map((character, index) => (
        <span aria-hidden="true" data-case-character key={`${character}-${index}`}>
          {character}
        </span>
      ))}
    </h2>
  );
}

const caseStudies = [
  {
    category: "Product Design",
    title: "SiteAssist - AI Powered Agents for Smarter Business Automation.",
    tags: ["SiteAssist", "AI / SAAS"],
    results: ["Intelligent AI-powered assistance", "Streamlined business workflows", "Enhanced customer support", "Secure, scalable AI integration"],
    image: "fae0a.png",
  },
  {
    category: "SaaS Platform",
    title: "Taskflow - Smarter Task & Workflow Management.",
    tags: ["Taskflow", "Productivity"],
    results: ["Intuitive and user-friendly interface", "Streamlined task and project management", "Smarter task prioritization and organization", "Improved workflow visibility and productivity"],
    image: "d0e6c.png",
  },
  {
    category: "AI and Robotics",
    title: "Matrix-3 - Next Generation Humanoid Robotics & AI.",
    tags: ["Matrix 3", "Landing Page"],
    results: ["Biomimetic Skin & Tactile Perception", "Vision Language Model Integration", "Natural Human Robot Overview", "Autonomous Physical Intelligence"],
    image: "37090.png",
  },
];

function CaseStudiesSection() {
  return (
    <section className="case-studies section-wrap" id="case-studies">
      <div className="case-head">
        <div className="case-intro">
          <div className="case-eyebrow"><span aria-hidden="true" />Featured Case studies</div>
          <CaseStudyHeading />
        </div>
        <ArrowButton>Show More</ArrowButton>
      </div>
      <div className="case-project-list">
        {caseStudies.map((project) => (
          <article className="case-card" key={project.title}>
            <div className="case-visual">
              <Image src={`/assets/case-studies/${project.image}`} alt={`${project.category} case study`} width={584} height={384} />
            </div>
            <div className="case-copy">
              <div className="case-copy-top">
                <div className="case-category"><span aria-hidden="true" />{project.category}</div>
                <h3>{project.title}</h3>
                <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div className="case-results">
                <p className="results-label">Results</p>
                <ul>{project.results.map((result) => <li key={result}>{result}</li>)}</ul>
              </div>
              <a className="case-explore" href="#contact">
                <span>Explore Now</span><Image src="/assets/case-studies/1e04d.svg" alt="" width={24} height={24} />
                <AnimatedStroke className="nav-button-stroke" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const whyCardColors = ["#BAE5FF", "#E1FFB9", "#FFCD51", "#FFB4B3", "#BEB3FF", "#FFE4B3"];

function WhyIcon({ index, color }: { index: number; color: string }) {
  const common = { fill: "none", stroke: color, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.5 };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {index === 0 && <><path d="M9 18h6m-5 3h4m-5.5-6.2A7 7 0 1 1 15.5 15c-.7.6-1.2 1.4-1.4 2.2H9.9c-.2-.8-.7-1.6-1.4-2.4Z"/><path d="M10 8a2.5 2.5 0 0 1 3.5-1.2"/></>}
      {index === 1 && <><path d="M12 3v18M3 12h18"/><circle cx="6" cy="17" r="2"/><path d="m17 4 3 3m0-3-3 3"/></>}
      {index === 2 && <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12 19 5m-4 0h4v4"/></>}
      {index === 3 && <><path d="M5 4v6h6M19 20v-6h-6M5 10l5-5m9 9-5 5"/><path d="M14 4h5v5M5 15v5h5"/></>}
      {index === 4 && <><path d="M12 3v5m0 8v5M3 12h5m8 0h5M6 6l3 3m6 6 3 3M18 6l-3 3m-6 6-3 3"/><circle cx="12" cy="12" r="3"/></>}
      {index === 5 && <><path d="M4 17 10 11l4 3 6-7"/><path d="M14 7h6v6"/></>}
    </svg>
  );
}

function WhyChooseUsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsViewportRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cardsViewport = cardsViewportRef.current;
    const cardsTrack = cardsTrackRef.current;
    if (!stage || !cardsViewport || !cardsTrack) return;

    const mobile = window.matchMedia("(max-width: 760px)");
    let frame = 0;

    const updateTrackPosition = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (mobile.matches) {
          cardsTrack.style.transform = "";
          return;
        }

        const maxDistance = Math.max(0, cardsTrack.scrollHeight - cardsViewport.clientHeight);
        const stageScrollDistance = Math.max(1, stage.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -stage.getBoundingClientRect().top / stageScrollDistance));
        cardsTrack.style.transform = `translate3d(0, ${-maxDistance * progress}px, 0)`;
      });
    };

    updateTrackPosition();
    window.addEventListener("scroll", updateTrackPosition, { passive: true });
    window.addEventListener("resize", updateTrackPosition);
    mobile.addEventListener("change", updateTrackPosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateTrackPosition);
      window.removeEventListener("resize", updateTrackPosition);
      mobile.removeEventListener("change", updateTrackPosition);
    };
  }, []);

  return (
    <div className="why-scroll-stage" ref={stageRef}>
      <section className="why-section" id="why-choose-us">
        <div className="why-layout">
          <div className="why-content">
            <div className="why-copy">
              <div className="why-label"><span aria-hidden="true" />Why Choose Us</div>
              <h2>More Than a Service Provider. A Partner in Your Product&apos;s Success.</h2>
              <p>Strategy, creativity, and engineering working together to build products that matter.</p>
            </div>
            <a className="why-action" href="#contact">
              <span>Start a Project</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="currentColor" /></svg>
            </a>
          </div>
          <div className="why-cards" ref={cardsViewportRef} role="region" aria-label="Why choose Codesign Forge" tabIndex={0}>
            <div className="why-cards-track" ref={cardsTrackRef}>
              {why.map(([title, description], index) => (
                <article className="why-feature" style={{ backgroundColor: whyCardColors[index] }} key={title}>
                  <div className="why-feature-content">
                    <div className="why-feature-icon"><WhyIcon index={index} color={whyCardColors[index]} /></div>
                    <div className="why-feature-text">
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const testimonials = [
  {
    quote: <><span>"Working with Codesign Forge</span><em> was smooth and efficient. </em><span>They understood our vision</span><em> and </em><span>delivered exactly</span><em> what we needed."</em></>,
    name: "Rohidul Islam",
    role: "Software Engineer",
    company: "siteassist",
    companyClass: "siteassist",
    image: "c39de.png",
  },
  {
    quote: <><em>"They </em><span>quickly understood our requirements</span><em> and turned our ideas into a practical solution. </em><span>Highly recommended!</span><em>"</em></>,
    name: "Arbaz Khan",
    role: "Founder",
    company: "Khantrast",
    companyClass: "khantrast",
    image: "50690.png",
  },
  {
    quote: <><em>"</em><span>Codesign Forge</span><em> delivered an excellent experience with </em><span>seamless communication</span><em>, thoughtful collaboration, and </em><span>outstanding attention to detail."</span></>,
    name: "RaShaun Brown",
    role: "Co-Founder",
    company: "Screen Skinz",
    companyClass: "screenskinz",
    image: "510e2.png",
  },
  {
    quote: <><em>"From the initial discussion to final delivery, </em><span>everything was handled professionally. </span><em>Looking forward to </em><span>working together again."</span></>,
    name: "Piotr Czernik",
    role: "Founder",
    company: "spawndrop",
    companyClass: "spawndrop",
    image: "46a9a.png",
  },
];

function TestimonialsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!stage || !viewport || !track) return;

    let frame = 0;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
        const pinDistance = Math.max(1, stage.offsetHeight - viewport.offsetHeight);
        const progress = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / pinDistance));
        track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
        stage.style.height = `${viewport.offsetHeight + distance}px`;
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const scrollCards = (direction: -1 | 1) => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    if (!stage || !viewport) return;
    const distance = Math.max(0, (trackRef.current?.scrollWidth ?? 0) - viewport.clientWidth);
    const pinDistance = Math.max(1, stage.offsetHeight - viewport.offsetHeight);
    const progress = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / pinDistance));
    const cardStep = viewport.clientWidth < 760 ? viewport.clientWidth * 0.82 : 416;
    const nextProgress = Math.min(1, Math.max(0, (progress * distance + cardStep * direction) / Math.max(distance, 1)));
    window.scrollTo({ top: window.scrollY + (nextProgress - progress) * pinDistance, behavior: "smooth" });
  };

  return (
    <div className="testimonials-scroll-stage" ref={stageRef}>
      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="testimonials-content" ref={viewportRef}>
          <header className="testimonial-header">
            <h2 id="testimonials-heading">Building Trust Through Every Partnership</h2>
            <div className="testimonial-controls">
              <button type="button" aria-label="Previous testimonial" onClick={() => scrollCards(-1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 5s-5 3.68-5 5 5 5 5 5" /></svg></button>
              <button type="button" aria-label="Next testimonial" onClick={() => scrollCards(1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 5s5 3.68 5 5-5 5-5 5" /></svg></button>
            </div>
          </header>
          <div className="testimonial-viewport" aria-label="Client testimonials">
            <div className="testimonial-track" ref={trackRef}>
              <article className="rating-card">
                <div className="rating-details">
                  <div className="rating-value"><strong>4.8</strong><span className="rating-stars" aria-label="Rated 4.8 out of 5">★★★★★</span></div>
                  <p>Over 10+ Reviews</p>
                </div>
                <div className="rating-platforms" aria-label="Fiverr, Upwork, 99designs, and Freelancer">
                  <Image src="/assets/testimonials/49b7a.svg" alt="Fiverr" width={67} height={20} />
                  <Image src="/assets/testimonials/71050.svg" alt="Upwork" width={66} height={20} />
                  <Image src="/assets/testimonials/30f84.svg" alt="99designs" width={84} height={20} />
                  <Image src="/assets/testimonials/316ac.svg" alt="Freelancer" width={82} height={20} />
                </div>
              </article>
              {testimonials.map((testimonial) => (
                <article className="quote-card" key={testimonial.name}>
                  <div className="testimonial-content">
                    <div className={`testimonial-company testimonial-company-${testimonial.companyClass}`} aria-label={testimonial.company}>
                      {testimonial.companyClass === "siteassist" ? <><Image src="/assets/testimonials/babbb.svg" alt="" width={21} height={21} /><span>siteassist</span></> : null}
                      {testimonial.companyClass === "khantrast" ? <span>Khantrast</span> : null}
                      {testimonial.companyClass === "screenskinz" ? <Image src="/assets/trusted/a1a6d.png" alt="Screen Skinz" width={96} height={22} /> : null}
                      {testimonial.companyClass === "spawndrop" ? <><Image src="/assets/testimonials/7355a.svg" alt="" width={15} height={16} /><span>spawndrop</span></> : null}
                    </div>
                    <div className="testimonial-body">
                      <div className="testimonial-rating"><span aria-label="5 out of 5 stars">★★★★★</span><b>5.0 <sup>/ 5</sup></b></div>
                      <blockquote>{testimonial.quote}</blockquote>
                    </div>
                  </div>
                  <footer>
                    <Image src={`/assets/testimonials/${testimonial.image}`} alt="" width={48} height={48} />
                    <span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Accordion({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  return <div className="faq-list">{items.map((title, i) => {
    const open = i === active;
    return <div className={`accordion-row ${open ? "is-open" : ""}`} key={title}>
      <button aria-expanded={open} aria-controls={`panel-faq-${i}`} onClick={() => setActive(open ? -1 : i)}>
        <span>{title}</span><span className="accordion-symbol">{open ? "−" : "+"}</span>
      </button>
      <div className="accordion-panel" id={`panel-faq-${i}`} hidden={!open}>
        {i === 0 ? firstAnswer.map((p) => <p key={p}>{p}</p>) : null}
      </div>
    </div>;
  })}</div>;
}

function ServiceAccordion() {
  const [active, setActive] = useState(0);
  return <div className="service-accordion" aria-label="Our services">
    {services.map((service, index) => {
      const open = active === index;
      return <article className={`service-accordion-item${open ? " is-expanded" : ""}`} key={service.title}>
        <div className="service-accordion-row">
          <span className="service-accordion-index">0{index + 1}</span>
          <div className="service-accordion-content">
            <button className="service-accordion-toggle" type="button" aria-expanded={open} aria-controls={`service-details-${index}`} onClick={() => setActive(open ? -1 : index)}>
              <span>{service.title}</span>
              <svg className="service-accordion-icon" viewBox="0 0 32 32" aria-hidden="true">
                <rect x=".67" y=".67" width="30.66" height="30.66" rx="15.33" />
                {open ? <path d="m10.34 10.34 11.32 11.32M21.66 10.34 10.34 21.66" /> : <path d="M16 8v16M24 16H8" />}
              </svg>
            </button>
            <div className="service-accordion-details" id={`service-details-${index}`} aria-hidden={!open} inert={!open}>
              <p>{service.description}</p>
              <ul>{service.bullets.map((bullet) => <li key={bullet}><span aria-hidden="true" />{bullet}</li>)}</ul>
              <a href="#contact">See the service <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </article>;
    })}
  </div>;
}

const projectSteps = [
  ["Weeks 1 - 2", "Discover", "Workshops, interviews and a teardown of what you have. You get a written plan and a fixed quote."],
  ["Weeks 3 - 6", "Design", "Flows first, then the interface, in weekly reviews. Every screen comes from one shared design system."],
  ["Weeks 6-12", "Build", "Production code from week six, on a staging link you can open every Friday."],
  ["Weeks 12 and on", "Launch and stay", "We launch with you, watch the numbers and stay on a monthly retainer if you want us to."],
];

function ServicesOverview() {
  return <section className="services-section" id="services">
    <div className="services-inner">
      <div className="services-feature">
        <div className="services-feature-intro">
          <div className="services-feature-copy">
            <h2>What we do</h2>
            <p>A glimpse into our creative journey projects that make us proud</p>
          </div>
          <div className="service-image"><Image src="/assets/services/36f20.png" alt="Screen Skinz design project" width={960} height={1110} /></div>
        </div>
        <ServiceAccordion />
      </div>
      <div className="project-process">
        <div className="project-process-header">
          <h2>How a project runs</h2>
          <p>Twelve weeks from kickoff to launch for most products, with a fixed quote after week two.</p>
        </div>
        <div className="project-process-timeline">
          {projectSteps.map(([timeframe, title, description]) => <article className="project-process-step" key={title}>
            <div><span>{timeframe}</span><h3>{title}</h3></div>
            <p>{description}</p>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function ContactForm() {
  const [ref, setRef] = useState(""), [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);
  const choices = (values: string[], active: string, set: (v: string) => void) => <div className="pills">{values.map((x) => <button type="button" className={active === x ? "selected" : ""} onClick={() => set(x)} key={x}>{x}</button>)}</div>;
  return <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
    <div className="form-pair"><label>Full Name *<input required placeholder="Your name" /></label><label>Enter Email *<input required type="email" placeholder="email@company.com" /></label></div>
    <fieldset><legend>Where did you find us? (Optional)</legend>{choices(["Google", "AI Search", "Bedance", "Dribbble", "Social Media", "Others"], ref, setRef)}</fieldset>
    <label>Brief project description*<textarea required placeholder="Tell us about your project" /></label>
    <fieldset><legend>Budget (Optional)</legend>{choices(["Not Sure", "$2K - $5K", "$5K - $10K", "$10K - $20K", "$20K - $50K", "$50K - $100K", "100K+"], budget, setBudget)}</fieldset>
    <div className="form-bottom"><button className="forge-button" type="submit">{sent ? "Message received ✓" : "Send Message"}<span>↗</span></button><span>hello@codesignforge.com<br /><a href="mailto:hello@codesignforge.com">Book a free 30-min call</a></span></div>
  </form>;
}

export function HomePage() {
  const [copyStatus, setCopyStatus] = useState("");

  const copyContact = async (value: string) => {
    await navigator.clipboard?.writeText(value);
    setCopyStatus(value);
    window.setTimeout(() => setCopyStatus(""), 1800);
  };
  return <>
    <HomeNavbar />
    <main className="home-page">
    <section className="home-hero" id="home">
      <div className="hero-glow" aria-hidden="true" /><div className="reeded-glass" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <div className="reeded-glass-pane" key={index} />)}</div>
      <div className="hero-copy">
        <div className="hero-heading-group">
          <div className="hero-pill"><Image src="/assets/hero/e4bce.svg" alt="" width={8} height={8} />Crafted by Humans. Accelerated by AI</div>
          <h1>We <em>Design, Engineer</em> &amp; Scale Digital Products That Drive <em>Business Growth.</em></h1>
        </div>
        <div className="hero-details">
          <p>We partner with ambitious startups, B2B SaaS companies, and enterprise teams to transform ideas into exceptional digital experiences through strategic product design, modern engineering, and AI powered solutions.</p>
          <HeroAction />
        </div>
      </div>
      <ProjectGallery />
      <div className="role-badge role-left"><Image className="role-pointer" src="/assets/hero/role-developer-pointer.svg" alt="" width={39} height={42}/><div className="role-label"><b>Lead Developer</b></div></div><div className="role-badge role-right"><Image className="role-pointer" src="/assets/hero/0acf6.svg" alt="" width={30} height={32}/><b>Lead designer</b></div>
    </section>

    <section className="trusted">
      <div className="trusted-container">
        <p>These companies trust us</p>
        <div className="trusted-logos">
          <Image src="/assets/trusted/a1a6d.png" alt="Screen Skinz" width={176} height={40} />
          <div className="partner-logo"><Image src="/assets/trusted/07dbc.svg" alt="" width={40} height={40} /><b>siteassist</b></div>
          <div className="partner-logo partner-logo-aarsis">
            <span className="aarsis-symbol" aria-hidden="true">
              <Image src="/assets/trusted/729dd.svg" alt="" width={37.362} height={39.98} />
              <svg width="26" height="25" viewBox="0 0 26 25" fill="none"><path d="M25.166 24.556H18.68V10.612C18.68 6.666 15.305 3.455 11.156 3.455C7.00701 3.455 3.632 6.666 3.632 10.612H0C0 4.76 5.00501 0 11.157 0C17.309 0 22.313 4.761 22.313 10.612V21.101H25.167V24.556ZM14.269 13.943C14.269 15.579 12.875 16.904 11.156 16.904C9.43701 16.904 8.04301 15.578 8.04301 13.943C8.04301 12.308 9.43701 10.982 11.156 10.982C12.875 10.982 14.269 12.308 14.269 13.943Z" fill="#0B0B0B" /></svg>
            </span>
            <b>aarsis</b>
          </div>
          <b className="partner-name">Khantrast</b>
          <Image src="/assets/trusted/ba915.png" alt="Elutropia" width={176} height={40} />
          <div className="partner-logo partner-logo-spawndrop"><Image src="/assets/trusted/dd033.svg" alt="" width={35.4317} height={38.3502} /><Image src="/assets/trusted/4c096.svg" alt="spawndrop" width={186.608} height={32.6186} /></div>
        </div>
      </div>
    </section>

    <IntroSection />

    <PortfolioOrbit />

    <ServicesOverview />

    <ImmersiveMotionCTA />

    <section className="video-section"><h2>Intro Video</h2><button aria-label="Play introduction video" className="play-button">▶</button></section>

    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="section-wrap about-grid">
        <header className="about-heading">
          <span className="about-category"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect width="12" height="12" fill="#DC532C" /></svg><span>About Us</span></span>
          <h2 id="about-heading">We don&apos;t just build digital products. We build what moves businesses forward.</h2>
        </header>
        <div className="about-small"><Image src="/assets/about/7989a.png" alt="Designer at a computer" width={480} height={440} /></div>
        <div className="about-body">
          <p>Great digital products go beyond beautiful interfaces. They solve real problems, create meaningful experiences, and help businesses grow.</p>
          <p>At Codesign Forge, we bring strategy, creative design, and modern engineering together to turn ambitious ideas into exceptional digital products.</p>
          <p>From SaaS platforms and web applications to AI-powered solutions, we focus on building technology that is intuitive, scalable, and designed for real world impact.</p>
          <p>We believe great work comes from understanding the people behind every product, challenging conventional thinking, and paying attention to the details that make a difference.</p>
          <p>Thoughtful by design. Intelligent by engineering. Built for what&apos;s next.</p>
          <AboutAction />
        </div>
        <div className="about-large"><Image src="/assets/about/66694.png" alt="Codesign Forge team at work" width={760} height={800} /></div>
      </div>
    </section>

    <CaseStudiesSection />

    <WhyChooseUsSection />

    <TestimonialsSection />

    <section className="faq-section"><div className="section-wrap faq-wrap"><h2>Frequently asked questions</h2><Accordion items={questions} /></div></section>

    <section className="contact-section" id="contact"><div className="section-wrap contact-grid"><div className="contact-copy"><h2>Unlock Your Brand&apos;s Potential at No Cost.</h2><p>Tell us what you are building and when it needs to ship. We reply within one working day.</p><button onClick={() => void copyContact("hello@codesignforge.com")}><Image src="/assets/contact/f0a1f.svg" alt="" width={20} height={20}/>hello@codesignforge.com <Image src="/assets/contact/11f23.svg" alt="Copy" width={18} height={18}/></button><button onClick={() => void copyContact("+880 1621 942031")}><Image src="/assets/contact/555d1.png" alt="" width={20} height={20}/>+880 1621 942031 <Image src="/assets/contact/11f23.svg" alt="Copy" width={18} height={18}/></button>{copyStatus && <span className="copy-toast" role="status">Copied</span>}</div><ContactForm /></div></section>

    <footer className="home-footer" id="more"><div className="section-wrap footer-grid"><div className="footer-brand"><a className="wordmark" href="#home"><Image src="/assets/footer/60ef7.svg" alt="" width={45} height={45} />CoDesign Forge</a><p>We partner with ambitious businesses to design, build, and scale exceptional digital products through strategy, creativity, and modern engineering.</p><span>Follow us on</span><div className="footer-social">{[["91a8d.svg","Facebook"],["7634c.svg","Instagram"],["4ed93.svg","X"],["2000e.svg","LinkedIn"],["8de61.svg","Behance"],["046f3.svg","Dribbble"]].map(([src,label])=><a href="#more" aria-label={label} key={label}><Image src={`/assets/footer/${src}`} alt="" width={24} height={24}/></a>)}</div></div><div><h3>Explore</h3><a href="#home">Home</a><a href="#about">About Us</a><a href="#projects">Projects</a><a href="#contact">Contact</a><a href="#pricing">Pricing</a></div><div><h3>Our Services</h3><a href="#services">Branding &amp; Identity</a><a href="#services">UI/UX &amp; Product Design</a><a href="#services">Web &amp; Software Development</a><a href="#services">Webflow &amp; Framer Development</a></div><div><h3>Contact</h3><span>Dhaka, Bangladesh</span><span>+880 1621 942031</span><span>hello@codesignforge.com</span></div></div><div className="footer-meta section-wrap"><span>Terms &amp; Conditions</span><span>© 2026 Codesign Forge. All rights reserved.</span><span>Privacy Policy</span></div><div className="giant-wordmark"><Image src="/assets/footer/30cdc.svg" alt="CoDesign Forge" width={1280} height={116}/></div></footer>
    </main>
  </>;
}
