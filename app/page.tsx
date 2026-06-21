import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPillars } from "@/lib/api/pillars";
import { breadcrumbJsonLd } from "@/lib/seo";

// Shared chrome / utilities
import JsonLd from "@/components/JsonLd";
import CustomScrollbar from "@/components/CustomScrollbar";
import PagingScript from "@/components/PagingScript";
import WebGLCanvasLoader from "@/components/WebGLCanvasLoader";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";

// Home-only sections (private to this route)
import IntroPortal from "./_home/IntroPortal";
import PhysicsSandboxSection from "./_home/PhysicsSandboxSection";
import VideoPanelSection from "./_home/VideoPanelSection";
import HomeIntroSection from "./_home/HomeIntroSection";
import PillarTilesSection from "./_home/PillarTilesSection";
import GlobalAuthoritySection from "./_home/GlobalAuthoritySection";
import StrategicInquirySection from "./_home/StrategicInquirySection";

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
  const [pillars, tNav] = await Promise.all([
    getPillars(),
    getTranslations("nav"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }])} />

      <WebGLCanvasLoader />
      <IntroPortal />

      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <HomeIntroSection />
        <PillarTilesSection pillars={pillars} />
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
