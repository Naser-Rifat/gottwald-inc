import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalCanvas from "@/components/GlobalCanvas";
import NoiseOverlay from "@/components/NoiseOverlay";
import RouteCleanup from "@/components/RouteCleanup";
import DomSafetyPatch from "@/components/DomSafetyPatch";
import PageLoader from "@/components/PageLoader";
import AudioProvider from "@/components/AudioProvider";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  organizationJsonLd,
  webSiteJsonLd,
  speakableJsonLd,
} from "@/lib/seo";

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

export const viewport: Viewport = {
  themeColor: "#000000",
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
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={satoshi.variable}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
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
        className="bg-black text-text-primary font-sans antialiased"
        suppressHydrationWarning
      >
        <DomSafetyPatch />
        <RouteCleanup />
        <PageLoader />
        <GlobalCanvas />
        <NoiseOverlay />
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
