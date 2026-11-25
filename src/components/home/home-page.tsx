"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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

function HeroAction() {
  return <a className="forge-button hero-action" href="#contact"><span className="hero-action-label">Book a free strategy call</span><svg className="hero-action-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.75 4.5C13.75 7.48733 16.7351 10.7868 21.3027 10.9902L21.75 11V13C16.931 13 13.75 16.4162 13.75 19.5H11.75C11.75 16.9994 13.1355 14.6064 15.3682 13H2.25V11H15.3682C13.1355 9.39361 11.75 7.00061 11.75 4.5H13.75Z" fill="white" /></svg><AnimatedStroke className="hero-action-stroke" /></a>;
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
  const testimonialTrack = useRef<HTMLDivElement>(null);
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

    <section className="about-section" id="about"><div className="section-wrap about-grid"><div><span className="eyebrow">● About Us</span><h2>We don&apos;t just build digital products. We build what moves businesses forward.</h2><div className="about-small"><Image src="/assets/about/7989a.png" alt="Designer at a computer" width={480} height={440} /></div></div><div className="about-content"><div className="about-large"><Image src="/assets/about/66694.png" alt="Codesign Forge team at work" width={760} height={800} /></div><div className="about-body"><p>Great digital products go beyond beautiful interfaces. They solve real problems, create meaningful experiences, and help businesses grow.</p><p>At Codesign Forge, we bring strategy, creative design, and modern engineering together to turn ambitious ideas into exceptional digital products.</p><p>From SaaS platforms and web applications to AI-powered solutions, we focus on building technology that is intuitive, scalable, and designed for real world impact.</p><p>We believe great work comes from understanding the people behind every product, challenging conventional thinking, and paying attention to the details that make a difference.</p><p>Thoughtful by design. Intelligent by engineering. Built for what&apos;s next.</p><ArrowButton light>Know more about us</ArrowButton></div></div></div></section>

    <section className="case-studies section-wrap" id="case-studies"><div className="case-head"><div><span className="eyebrow">Featured Case studies</span><h2>Explore how we combine strategic thinking, thoughtful <span>design, and intelligent engineering to turn ambitious ideas into impactful digital products.</span></h2></div><ArrowButton>Show More</ArrowButton></div>{[["Product Design", "SiteAssist - AI Powered Agents for Smarter Business Automation.", "SiteAssist", "AI / SAAS", ["Intelligent AI-powered assistance", "Streamlined business workflows", "Enhanced customer support", "Secure, scalable AI integration"]], ["SaaS Platform", "Taskflow - Smarter Task & Workflow Management.", "Taskflow", "Productivity", ["Intuitive and user-friendly interface", "Streamlined task and project management", "Smarter task prioritization and organization", "Improved workflow visibility and productivity"]], ["AI and Robotics", "Matrix-3 - Next Generation Humanoid Robotics & AI.", "Matrix 3", "Landing Page", ["Biomimetic Skin & Tactile Perception", "Vision Language Model Integration", "Natural Human Robot Overview", "Autonomous Physical Intelligence"]]].map((c, i) => <article className="case-card" key={c[1] as string}><div className={`case-visual case-${i + 1}`}><Image src={`/assets/case-studies/${["fae0a.png","d0e6c.png","37090.png"][i]}`} alt={`${c[0]} case study`} width={584} height={450} /></div><div className="case-copy"><span className="eyebrow">{c[0] as string}</span><h3>{c[1] as string}</h3><div className="tags"><span>{c[2] as string}</span><span>{c[3] as string}</span></div><p className="results-label">Results</p><ul>{(c[4] as string[]).map((x) => <li key={x}>{x}</li>)}</ul><a href="#contact">Explore Now ↗</a></div></article>)}</section>

    <section className="why-section"><div className="section-wrap why-grid"><div className="why-sticky"><span className="eyebrow">Why Choose Us</span><h2>Thoughtful partners for ambitious ideas.</h2><p>We bring strategy, design, and engineering together to move your business forward.</p></div><div className="why-list">{why.map(([h, p], i) => <article key={h}><span>0{i + 1}</span><h3>{h}</h3><p>{p}</p></article>)}</div></div></section>

    <section className="testimonials"><div className="section-wrap"><div className="testimonial-header"><h2>Building Trust Through Every Partnership</h2><div><button aria-label="Previous testimonial" onClick={()=>testimonialTrack.current?.scrollBy({left:-416,behavior:"smooth"})}>←</button><button aria-label="Next testimonial" onClick={()=>testimonialTrack.current?.scrollBy({left:416,behavior:"smooth"})}>→</button></div></div><div className="testimonial-track" ref={testimonialTrack}><article className="rating-card"><strong>4.8</strong><span>★★★★★</span><p>Over 10+ Reviews</p><small>fiverr　upwork　99designs　freelancer</small></article>{[["Working with Codesign Forge was smooth and efficient. They understood our vision and delivered exactly what we needed.", "Rohidul Islam", "Software Engineer", "siteassist", "c39de.png"], ["Codesign Forge delivered an excellent experience with seamless communication, thoughtful collaboration, and outstanding attention to detail.", "RaShaunBrown", "Co-Founder", "codesign", "510e2.png"], ["They quickly understood our requirements and turned our ideas into a practical solution. Highly recommended!", "Arbaz Khan", "Founder", "Khantrast", "50690.png"], ["From the initial discussion to final delivery, everything was handled professionally. Looking forward to working together again.", "Piotr Czernik", "Founder", "spawndrop", "46a9a.png"]].map((t) => <article className="quote-card" key={t[1]}><b>{t[3]}</b><p>“{t[0]}”</p><footer><Image src={`/assets/testimonials/${t[4]}`} alt="" width={48} height={48}/><span><strong>{t[1]}</strong><small>{t[2]}</small></span></footer></article>)}</div></div></section>

    <section className="faq-section"><div className="section-wrap faq-wrap"><h2>Frequently asked questions</h2><Accordion items={questions} /></div></section>

    <section className="contact-section" id="contact"><div className="section-wrap contact-grid"><div className="contact-copy"><h2>Unlock Your Brand&apos;s Potential at No Cost.</h2><p>Tell us what you are building and when it needs to ship. We reply within one working day.</p><button onClick={() => void copyContact("hello@codesignforge.com")}><Image src="/assets/contact/f0a1f.svg" alt="" width={20} height={20}/>hello@codesignforge.com <Image src="/assets/contact/11f23.svg" alt="Copy" width={18} height={18}/></button><button onClick={() => void copyContact("+880 1621 942031")}><Image src="/assets/contact/555d1.png" alt="" width={20} height={20}/>+880 1621 942031 <Image src="/assets/contact/11f23.svg" alt="Copy" width={18} height={18}/></button>{copyStatus && <span className="copy-toast" role="status">Copied</span>}</div><ContactForm /></div></section>

    <footer className="home-footer" id="more"><div className="section-wrap footer-grid"><div className="footer-brand"><a className="wordmark" href="#home"><Image src="/assets/footer/60ef7.svg" alt="" width={45} height={45} />CoDesign Forge</a><p>We partner with ambitious businesses to design, build, and scale exceptional digital products through strategy, creativity, and modern engineering.</p><span>Follow us on</span><div className="footer-social">{[["91a8d.svg","Facebook"],["7634c.svg","Instagram"],["4ed93.svg","X"],["2000e.svg","LinkedIn"],["8de61.svg","Behance"],["046f3.svg","Dribbble"]].map(([src,label])=><a href="#more" aria-label={label} key={label}><Image src={`/assets/footer/${src}`} alt="" width={24} height={24}/></a>)}</div></div><div><h3>Explore</h3><a href="#home">Home</a><a href="#about">About Us</a><a href="#projects">Projects</a><a href="#contact">Contact</a><a href="#pricing">Pricing</a></div><div><h3>Our Services</h3><a href="#services">Branding &amp; Identity</a><a href="#services">UI/UX &amp; Product Design</a><a href="#services">Web &amp; Software Development</a><a href="#services">Webflow &amp; Framer Development</a></div><div><h3>Contact</h3><span>Dhaka, Bangladesh</span><span>+880 1621 942031</span><span>hello@codesignforge.com</span></div></div><div className="footer-meta section-wrap"><span>Terms &amp; Conditions</span><span>© 2026 Codesign Forge. All rights reserved.</span><span>Privacy Policy</span></div><div className="giant-wordmark"><Image src="/assets/footer/30cdc.svg" alt="CoDesign Forge" width={1280} height={116}/></div></footer>
    </main>
  </>;
}
