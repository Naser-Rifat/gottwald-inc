import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { breadcrumbJsonLd } from "@/lib/seo";

// Shared chrome / utilities
import JsonLd from "@/components/system/JsonLd";
import CustomScrollbar from "@/components/layout/CustomScrollbar";
import PagingScript from "@/components/system/PagingScript";
import WebGLCanvasLoader from "@/components/canvas/WebGLCanvasLoader";

// Home-only sections (private to this route)
// Above-the-fold sections stay statically imported so they render
// immediately on first paint with no extra round-trip.
import IntroPortal from "./_home/IntroPortal";
import PhysicsSandboxSection from "./_home/PhysicsSandboxSection";
import VideoPanelSection from "./_home/VideoPanelSection";
import HomeIntroSection from "./_home/HomeIntroSection";

// PillarTilesAsync is a server component that calls getPillars() inside
// itself, so its data fetch streams in parallel with the rest of the
// page instead of blocking the initial HTML response. See the file for
// the full rationale.
import PillarTilesAsync from "./_home/PillarTilesAsync";

// Below-the-fold: dynamic-import to split each section's client JS into
// its own chunk. Next.js still SSRs the markup (ssr defaults to true) so
// SEO and the initial HTML are unchanged — only the hydration JS is
// deferred until the section actually mounts on the client.
const GlobalAuthoritySection = dynamic(
  () => import("./_home/GlobalAuthoritySection"),
);
const StrategicInquirySection = dynamic(
  () => import("./_home/StrategicInquirySection"),
);
const FooterSection = dynamic(() => import("@/components/layout/FooterSection"));
const NextChapterTransition = dynamic(
  () => import("@/components/layout/NextChapterTransition"),
);

const HOME_DESCRIPTION =
  "GOTT WALD Holding LLC — Standards-led holding company headquartered in Tbilisi, Georgia. We build operating-grade systems for people and strategic assets, turning complexity into clarity and decisions into measurable impact.";

const HOME_TITLE = "GOTT WALD Holding — Standards-Led Holding & Operations";

export const metadata: Metadata = {
  // Absolute title bypasses the root layout's "%s | GOTT WALD Holding"
  // template — the homepage leads with the full brand title rather than
  // a generic "Home" in the browser tab and search results.
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    // og:image resolved from app/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default async function Home() {
  // Only translations are awaited at the page level. They're a local JSON
  // lookup (no network), so cost is sub-millisecond. The pillars data
  // (which takes ~800ms over the wire) is fetched inside PillarTilesAsync
  // behind a <Suspense>, so the rest of the page streams instantly.
  const tNav = await getTranslations("nav");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }])} />

      <WebGLCanvasLoader />
      <IntroPortal />

      {/* LCP fix: no initial `.fade-out` class — home-content is visible in
          SSR HTML so Lighthouse can measure LCP. Portal (position:fixed,
          z-index:9999) covers it visually until WebGL is ready. Fade-in on
          portal exit still works via loadingGroup's classList.add + remove
          cycle if a slow-load path needs the transition. */}
      <div id="home-content">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <HomeIntroSection />

        {/* PillarTilesSection waits on a ~800ms API round-trip; wrapping
            it in <Suspense> lets every section before AND after it stream
            without blocking. The fallback reserves the full screen height
            so the page doesn't reflow when the pillar tiles arrive. */}
        <Suspense
          fallback={
            <div
              aria-hidden
              className="w-full h-screen bg-transparent"
            />
          }
        >
          <PillarTilesAsync />
        </Suspense>

        <GlobalAuthoritySection />
        <StrategicInquirySection />
        <FooterSection />
        <NextChapterTransition
          nextTitle={tNav("about")}
          nextHref="/about"
          narrativeLine="The foundation is set. Now, the philosophy."
          accentColor="#b8c0cc"
        />
      </div>

      <CustomScrollbar />
      <PagingScript />
    </>
  );
}
