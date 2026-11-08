/**
 * Site-level configuration shared across the landing experience.
 *
 * Nothing here may fabricate endorsements, counts, or destinations.
 * Social links stay hidden until a real URL is configured (AGENTS.md §2).
 * Copy: the hero supporting copy is the design's supplied text; the trust
 * statement below deliberately avoids the design's unverified numeric claim.
 */
export const SITE = {
  name: "CoDesign Forge",
  /** Supporting copy from the design (flagged for owner review). */
  tagline:
    "Be part of something truly extraordinary. Join thousands of others already gaining early access to our revolutionary new products",
  /** Non-claiming description used for metadata. */
  description:
    "Join the CoDesign Forge website launch waitlist and get notified at launch. Opt in to early-access launch updates.",
  /** Non-claiming fallback shown while no verified subscriber count exists. */
  waitlistFallback: "Be among the first to get early access",
  /** Placeholder partner-row copy; replace with verified content at launch. */
  partnersPlaceholderNotice:
    "Partner marks shown are development placeholders",
} as const;

interface SocialEntry {
  platform: (typeof SOCIAL_ORDER)[number];
  /** Configured URL, or undefined → the link is hidden. */
  href: string | undefined;
}

const SOCIAL_ORDER = ["instagram", "x", "youtube"] as const;

function socialUrlFromEnv(platform: string): string | undefined {
  const raw = process.env[`SOCIAL_${platform.replace("-", "_").toUpperCase()}_URL`];
  const value = raw?.trim();
  return value ? value : undefined;
}

/** Social links resolved from configuration; unset platforms stay hidden. */
export function getSocialLinks(): SocialEntry[] {
  return SOCIAL_ORDER.map((platform) => ({
    platform,
    href: socialUrlFromEnv(platform),
  }));
}
