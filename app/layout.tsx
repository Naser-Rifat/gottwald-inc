import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import GlobalCanvasLoader from "@/components/GlobalCanvasLoader";
import NoiseOverlay from "@/components/NoiseOverlay";
import RouteCleanup from "@/components/RouteCleanup";
import DomSafetyPatch from "@/components/DomSafetyPatch";
import PageLoader from "@/components/PageLoader";
import AudioProvider from "@/components/AudioProvider";
import CookieManager from "@/components/CookieManager";
import GoogleTranslateRoot from "@/components/GoogleTranslateRoot";
import ResonanceCursor from "@/components/ResonanceCursor";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  organizationJsonLd,
  webSiteJsonLd,
  speakableJsonLd,
} from "@/lib/seo";
import { hreflangAlternates } from "@/lib/i18n";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070c14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Standards-Led Holding & Operations`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "GOTT WALD Holding",
    "Gott Wald Holding LLC",
    "holding company Georgia",
    "Tbilisi holding company",
    "standards-led governance",
    "strategic consulting Georgia",
    "IT solutions SME",
    "business relocation Georgia",
    "executive coaching Tbilisi",
    "digital infrastructure transformation",
    "SolutionFinder structured analysis",
    "marketing demand infrastructure",
    "operating-grade systems",
    "complexity to clarity",
  ],
  category: "Business Services",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  other: {
    "entity:type": "HoldingCompany",
    "entity:name": SITE_NAME,
    "entity:location": "Tbilisi, Georgia",
    "entity:industry": "Business Operations, Strategic Consulting, IT Solutions, Executive Coaching",
    "entity:founded": "2024",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Standards-Led Holding & Operations`,
    description: DEFAULT_DESCRIPTION,
    // Branded dynamic OG (Edge-rendered by app/opengraph-image.tsx) — stronger
    // signal for AI knowledge panels than a static photo. Per-route convention
    // files (e.g. app/about/opengraph-image.tsx) override this automatically.
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Turning complexity into clarity`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Standards-Led Holding & Operations`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Turning complexity into clarity`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    // Single-locale site today. `hreflangAlternates("/")` emits x-default +
    // en self-reference; when /de/ ships, the helper automatically adds it.
    languages: hreflangAlternates("/"),
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolve locale + messages server-side from the googtrans cookie
  // (see i18n/request.ts). Setting <html lang> from the resolved locale
  // keeps screen readers, Chrome's translate-banner heuristic, and
  // next-intl's provider all aligned without needing the inline cookie-
  // reading script we used for GT alone.
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${satoshi.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sync <html lang> with the `googtrans` cookie BEFORE first paint.
            Chrome evaluates <html lang> once on page load to decide whether
            to offer translation; if we waited for React hydration to set
            it, Chrome would already have shown its "Translated to: German"
            banner for returning DE visitors. Running this inline in <head>
            wins that race. Safe no-op for first-time visitors (no cookie =
            lang stays "en"). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=document.cookie.match(/googtrans=\\/[^\\/]+\\/([^;]+)/);if(m&&m[1]){document.documentElement.lang=m[1];}}catch(e){}})();",
          }}
        />
        {/* Image CDN — most page images are Cloudinary-served. */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        {/* Backend API — pillar/content fetches. DNS prefetch is enough; */}
        {/* opening a real TCP connection on every page load is wasteful. */}
        <link
          rel="dns-prefetch"
          href="https://gottwald-admin.vercel.app"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              speakableJsonLd("/", ["h1", "h2", ".hero-desc", ".body-line"]),
            ),
          }}
        />
      </head>
      <body
        className="bg-base text-text-primary font-sans antialiased"
        suppressHydrationWarning
      >
        {/* Skip-link: first focusable element on every page. Hidden by
            default, becomes visible on keyboard focus. Lets keyboard and
            screen-reader users jump past the loader, canvas, cookie banner,
            and Google Translate widget directly to the page content. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10000 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:outline-2 focus:outline-gold focus:font-medium focus:text-sm focus:tracking-wider focus:uppercase"
        >
          Skip to main content
        </a>
        <DomSafetyPatch />
        <RouteCleanup />
        <PageLoader />
        <GlobalCanvasLoader />
        <NoiseOverlay />
        <CookieManager />
        <GoogleTranslateRoot />
        <ResonanceCursor />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AudioProvider>
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </AudioProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
