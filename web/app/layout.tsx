import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { ShaderBackground } from "@/components/ui/shader-background";
import PageTransition from "@/components/PageTransition";
import CursorEmitter from "@/components/CursorEmitter";
import Preloader from "@/components/Preloader";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

/* the reference's small technical caps (eyebrow, card labels, corner notes)
   are a monospace; Geist Mono pairs with the Geist already in use */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const SITE_URL = "https://cyphernaut.ai";

/* Next shallow-merges metadata: a page that declares `openGraph` replaces the
   layout's wholesale rather than extending it. Every page does declare one, so
   these three fields were being dropped site-wide and no route shipped an
   og:image at all. Spread this into each page's openGraph. */
export const OG_BASE = {
  type: "website" as const,
  siteName: "Cyphernaut",
  images: ["/assets/og.png"],
};

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23070908'/%3E%3Ccircle cx='16' cy='16' r='9' fill='none' stroke='%23BFFF00' stroke-width='2.5'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  /* The canonical origin. Every relative URL in this metadata — the OG image
     included — is resolved against it, so it must match the host the site is
     actually served from or crawlers and link unfurlers fetch the wrong one. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cyphernaut | AI and Web3 launch marketing",
    template: "%s",
  },
  description:
    "Cyphernaut builds, launches and grows AI and Web3 projects: production software, strategy, marketing and community, from first commit to sustained growth.",
  openGraph: {
    type: "website",
    siteName: "Cyphernaut",
    images: [{ url: "/assets/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og.png"],
  },
  icons: { icon: FAVICON },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-cn="1"
      data-intro="wait"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <Preloader />
        {/* the scroll-in entrances start hidden; without JS they must not stay that way */}
        <noscript>
          <style>{`[data-rise],[data-wipe],[data-iris]{opacity:1!important;transform:none!important;clip-path:none!important}#pre{display:none!important}html[data-intro] .hero-3d,html[data-intro] .hero-cards,html[data-intro] .hero-eyebrow,html[data-intro] [data-hfade],html[data-intro] .hero-note-tr,html[data-intro] .hero-foot,html[data-intro] #nav .mark{opacity:1!important;transform:none!important}html[data-intro=\"wait\"] .hero-h1 .hline>span{animation-play-state:running}`}</style>
        </noscript>
        {/* Ambient field behind the page. z-index 1 puts it above #ground
            (0, opaque, colour-animated on scroll) and below .sect (2). */}
        <ShaderBackground className="shaderbg" />
        <SmoothScroll />
        <PageTransition />
        <CursorEmitter />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
