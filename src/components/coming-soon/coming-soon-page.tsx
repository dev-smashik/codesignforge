import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/coming-soon/countdown";
import { SignupForm } from "@/components/coming-soon/signup-form";

const assets = "/figma/";

function SocialLinks() {
  const links = [
    { name: "Facebook", file: "f6c31.svg", href: "https://www.facebook.com/" },
    { name: "Instagram", file: "6e2e3.svg", href: "https://www.instagram.com/" },
    { name: "X", file: "66205.svg", href: "https://x.com/" },
  ];

  return (
    <nav className="flex items-center gap-3 max-md:gap-2" aria-label="Social media">
      {links.map((link) => (
        <a
          className="grid size-12 place-items-center overflow-hidden rounded-lg border border-[rgb(53_61_65/50%)] bg-transparent transition-colors hover:border-[rgb(220_83_44/75%)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f28b6c] motion-reduce:transition-none max-md:size-9 max-md:rounded-md"
          href={link.href}
          key={link.name}
          aria-label={link.name}
          target="_blank"
          rel="noreferrer"
        >
          <Image className="size-6 max-md:size-5" src={`${assets}${link.file}`} width={24} height={24} alt="" />
        </a>
      ))}
    </nav>
  );
}

function Header() {
  return (
    <header className="relative z-10 mx-auto flex h-24 w-[min(calc(100%-48px),1320px)] items-center justify-between bg-transparent px-2.5 py-6 max-md:h-20 max-md:w-[calc(100vw-40px)] max-md:max-w-[calc(100vw-40px)] max-md:px-0 max-md:py-4">
      <Link className="inline-flex min-w-0 items-center gap-2 text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f28b6c]" href="/" aria-label="Codesign Forge home">
        <span className="grid size-12 flex-[0_0_48px] place-items-center overflow-hidden rounded-xl max-md:size-10 max-md:flex-[0_0_40px]">
          <Image src={`${assets}bb64d.svg`} width={32} height={32} alt="" />
        </span>
        <span className="whitespace-nowrap font-brand text-2xl font-normal tracking-[-0.288px] max-md:text-xl max-md:tracking-[-0.24px] max-[359px]:text-lg">
          CoDesign Forge
        </span>
      </Link>
      <SocialLinks />
    </header>
  );
}

function LaunchBadge() {
  return (
    <div className="relative inline-flex h-8 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-[rgb(53_61_65/50%)] px-4 text-sm leading-[1.8] shadow-[0_0_16px_1px_rgb(253_79_36/12%)] max-[359px]:px-3 max-[359px]:text-[13px]">
      <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(90deg,#070707,#252525_50%,#070707)]" aria-hidden="true" />
      <Image className="relative" src={`${assets}83e78.svg`} width={16} height={16} alt="" />
      <span className="relative">Coming Soon Codesign Forge</span>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-1px_4px_0.5px_rgb(19_19_19/50%),inset_0_1px_4px_0.5px_rgb(19_19_19/50%)]" aria-hidden="true" />
    </div>
  );
}

function SocialProof() {
  const portraits = ["c9d81.png", "9a931.png", "97947.png"];
  return (
    <div className="flex min-h-6 items-center justify-center gap-3 text-base leading-[1.48] max-md:gap-2.5">
      <div className="flex flex-none items-center pl-0" aria-hidden="true">
        {portraits.map((portrait) => (
          <Image
            className="-ml-2 size-6 rounded-full border-[0.6px] border-[#1d1f2c] object-cover first:ml-0 max-md:size-5"
            key={portrait}
            src={`${assets}${portrait}`}
            width={24}
            height={24}
            alt=""
          />
        ))}
      </div>
      <p className="m-0 max-md:hidden">Join 500+ people waiting for what&apos;s next.</p>
      <p className="m-0 hidden max-w-full text-xs max-md:block">Join 500+ people waiting for what&apos;s next.</p>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed top-[-30.25px] right-auto bottom-auto -left-78 z-[-1] aspect-2160/1144 h-auto w-[calc(120%+200px)] overflow-hidden max-md:left-1/2 max-md:-top-11.25 max-md:w-[clamp(1360px,420vw,2000px)] max-md:-translate-x-1/2" aria-hidden="true" data-node-id="31:136">
      <Image
        className="absolute inset-0 object-contain object-bottom"
        src={`${assets}background-effects.png`}
        alt=""
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}

export function ComingSoonPage() {
  return (
    <main className="relative isolate min-h-svh w-full max-w-full overflow-x-clip bg-background">
      <BackgroundEffects />
      <Header />
      <section
        className="relative z-10 mx-auto mt-[clamp(32px,calc(100svh-736px),153px)] flex min-h-[max(0px,calc(100svh-249px))] w-[min(calc(100%-48px),1440px)] flex-col items-center justify-between max-md:mt-4.5 max-md:min-h-[calc(100svh-98px)] max-md:w-[calc(100vw-40px)] max-md:max-w-[calc(100vw-40px)] max-md:gap-7 max-[359px]:w-[calc(100vw-32px)] max-[359px]:max-w-[calc(100vw-32px)]"
        aria-labelledby="coming-soon-title"
      >
        <div className="flex w-[min(100%,1300px)] min-w-0 flex-col items-center gap-10 text-center max-md:w-full max-md:gap-8">
          <div className="flex flex-col items-center gap-4 max-md:w-full">
            <LaunchBadge />
            <div className="flex w-full min-w-0 flex-col items-center gap-6 text-center">
              <h1 className="m-0 w-[min(100%,1002px)] font-brand text-[64px] leading-[1.1] font-normal tracking-[-1.28px] text-white max-md:w-full max-md:text-4xl max-md:leading-[1.3] max-md:font-medium max-md:tracking-[-0.72px] max-[359px]:text-[33px]" id="coming-soon-title">
                Great Ideas Deserve Exceptional Digital Experiences.
              </h1>
              <div className="w-full min-w-0 text-lg leading-[1.44] text-[#fafafa] max-md:text-sm max-md:leading-[1.8]">
                <p className="m-0">
                  We&apos;re launching a digital product design and engineering
                  partner for ambitious businesses.
                </p>
                <p className="m-0">
                  Product Design <span className="text-accent">·</span> Software Development <span className="text-accent">·</span> AI Solutions
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 max-md:gap-2.5">
            <SignupForm />
            <SocialProof />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-12 max-md:gap-8">
          <Countdown />
          <footer className="w-full px-20 py-4 text-center max-md:px-0 max-md:pt-0 max-md:pb-4">
            <p className="m-0 text-base leading-[1.48] font-medium text-[#919191] max-md:hidden">
              © 2026 Codesign Forge. All rights reserved.
            </p>
            <p className="m-0 hidden text-sm leading-[1.8] font-normal text-[#919191] max-md:block">
              © 2026 Codesign Forge. All rights reserved.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
