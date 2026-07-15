import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { breadcrumbJsonLd } from "@/lib/seo";
import { isMobileFromHeaders } from "@/lib/isMobile";

// Shared chrome / utilities
import JsonLd from "@/components/system/JsonLd";
import CustomScrollbar from "@/components/layout/CustomScrollbar";
import PagingScript from "@/components/system/PagingScript";

// Home-only sections (private to this route)
import HomeIntroSection from "./_home/HomeIntroSection";
import MobileHero from "./_home/MobileHero";

// Desktop-only WebGL stack: dynamic imports so their code does NOT ship
// in the initial mobile bundle. Mobile visitors never reference these,
// so Next.js code-splits them out entirely — saving ~600KB of Three.js
// + physics + shader JS on mobile. Kept SSR-on so desktop still gets
// server-rendered HTML for SEO. WebGLCanvasLoader's inner canvas is
// already ssr:false (needs window/WebGL) — the wrapper stays SSR-safe.
const IntroPortal = dynamic(() => import("./_home/IntroPortal"));
const PhysicsSandboxSection = dynamic(
  () => import("./_home/PhysicsSandboxSection"),
);
const VideoPanelSection = dynamic(() => import("./_home/VideoPanelSection"));
const WebGLCanvasLoader = dynamic(
  () => import("@/components/canvas/WebGLCanvasLoader"),
);

// PillarTilesAsync is a server component that calls getPillars() inside
// itself, so its data fetch streams in parallel with the rest of the
// page instead of blocking the initial HTML response. See the file for
// the full rationale.
import PillarTilesAsync from "./_home/PillarTilesAsync";
import { hreflangAlternates } from "@/lib/i18n";

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

// Trimmed to <=155 chars so SERPs render the full snippet without truncation.
const HOME_DESCRIPTION =
  "GOTT WALD Holding LLC — standards-led holding in Tbilisi, Georgia. Operating-grade systems turning complexity into clarity and decisions into impact.";

const HOME_TITLE = "GOTT WALD Holding — Standards-Led Holding & Operations";

export const metadata: Metadata = {
  // Absolute title bypasses the root layout's "%s | GOTT WALD Holding"
  // template — the homepage leads with the full brand title rather than
  // a generic "Home" in the browser tab and search results.
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/", languages: hreflangAlternates("/") },
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
  const [tNav, isMobile] = await Promise.all([
    getTranslations("nav"),
    isMobileFromHeaders(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }])} />

      {/* Desktop: ships the full WebGL experience (WebGLCanvas + IntroPortal
          + PhysicsSandbox + VideoPanel). Mobile: serves a static poster hero
          instead — no Three.js parse, no shader compile, no fullscreen
          loading gate. Mobile still gets every below-the-fold section, just
          without the ~600KB WebGL boot cost above the fold. */}
      {isMobile ? (
        <MobileHero />
      ) : (
        <>
          <WebGLCanvasLoader />
          <IntroPortal />
        </>
      )}

      {/* Home-content ships with `.fade-out` (opacity 0) in the SSR HTML on
          DESKTOP. IntroPortal is client-only (`useSyncExternalStore` returns
          false on the first client render for hydration parity) — so if we
          shipped the home-content visible, users would see the hero briefly,
          then the portal would suddenly cover it. `.fade-out` hides it until
          the portal explicitly reveals it (see IntroPortal.dismissPortal +
          its safety useEffect). LoadingGroup on desktop also removes the
          class when the WebGL scene finishes booting.
          On MOBILE the portal is skipped entirely, so no fade-out is needed
          — home-content flows directly after the static MobileHero above. */}
      <div id="home-content" className={isMobile ? "" : "fade-out"}>
        {/* Skip WebGL-heavy above-the-fold sections on mobile.
            PhysicsSandboxSection = 3D physics WebGL, VideoPanelSection =
            video shader — both cost ~200-300ms of main thread on mobile.
            Their content isn't essential for the mobile narrative. */}
        {!isMobile && <PhysicsSandboxSection />}
        {!isMobile && <VideoPanelSection />}
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
