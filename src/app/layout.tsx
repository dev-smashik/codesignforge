import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight, Playfair_Display } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});


export const metadata: Metadata = {
  title: "CoDesign Forge | Digital Product Design & Engineering",
  description:
    "CoDesign Forge partners with ambitious businesses to design, engineer, and scale digital products that drive business growth.",
  openGraph: {
    title: "CoDesign Forge | Digital Product Design & Engineering",
    description:
      "Strategic product design, modern engineering, and AI powered solutions for ambitious businesses.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${interTight.variable} ${playfair.variable} bg-background font-body text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
