import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  Inter_Tight,
  Playfair_Display,
} from "next/font/google";

import "@/app/globals.css";
import { SITE } from "@/lib/site";

// Display/body fonts mirror the Figma design: Inter for the large headline,
// Inter Tight for supporting copy and UI, Bricolage Grotesque for the brand
// wordmark and homepage buttons, Playfair Display (medium italic) for the
// italic accents inside the homepage hero headline.
const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-tight",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-bricolage",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — Join our website launch waitlist`,
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Join our website launch waitlist`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${bricolage.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
