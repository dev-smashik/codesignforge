import Link from "next/link";

import { getSocialLinks } from "@/lib/site";

const SOCIAL_ICONS: Record<string, { src: string }> = {
  instagram: { src: "/landing/icon-instagram.svg" },
  x: { src: "/landing/icon-x.svg" },
  youtube: { src: "/landing/icon-youtube.svg" },
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "CoDesign Forge on Instagram",
  x: "CoDesign Forge on X (formerly Twitter)",
  youtube: "CoDesign Forge on YouTube",
};

/** Outlined square social icon link. Sized 48px desktop / 32px mobile. */
function SocialLink({ platform, href }: { platform: string; href: string }) {
  const icon = SOCIAL_ICONS[platform];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={SOCIAL_LABELS[platform]}
      className="flex size-8 items-center justify-center rounded-social border border-hairline bg-background p-1.5 transition-opacity hover:opacity-80 focus-visible:opacity-80 lg:size-12 lg:p-2.5"
    >
      <img
        src={icon?.src}
        alt=""
        aria-hidden="true"
        className="size-5 lg:size-6"
        width={24}
        height={24}
      />
    </a>
  );
}

export function SiteHeader() {
  const socials = getSocialLinks();

  return (
    <header className="relative z-10">
      <div className="px-4 py-6 sm:px-10 lg:py-6">
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-325 items-center justify-between backdrop-blur-xs"
        >
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-offset-4"
          >
            <span className="sr-only">CoDesign Forge — home</span>
            <img
              src="/landing/brand-mark.svg"
              alt=""
              aria-hidden="true"
              className="size-6 shrink-0 min-[400px]:size-8"
              width={32}
              height={32}
            />
            <span className="whitespace-nowrap font-brand text-xl font-semibold leading-[1.4] tracking-[-0.24px] text-white min-[400px]:text-2xl min-[400px]:tracking-[-0.012em]">
              CoDesign Forge
            </span>
          </Link>

          {/* Social links (hidden until configured) */}
          {socials.some((social) => social.href) && (
            <ul className="flex items-center gap-3" role="list">
              {socials.map(
                ({ platform, href }) =>
                  href && (
                    <li key={platform}>
                      <SocialLink platform={platform} href={href} />
                    </li>
                  ),
              )}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
