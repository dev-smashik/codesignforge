import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
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


export const metadata: Metadata = {
  title: "Codesign Forge | Something Innovative Is Coming Soon",
  description:
    "Codesign Forge is building innovative digital experiences, modern web solutions, and technology-driven products. Stay tuned for what's coming next.",
  openGraph: {
    title: "Codesign Forge | Something Innovative Is Coming Soon",
    description:
      "A digital product design and engineering partner for ambitious businesses.",
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
      <body className={`${bricolage.variable} ${interTight.variable} bg-background font-body text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
