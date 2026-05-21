import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import CustomScrollbar from "@/components/CustomScrollbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import VideoPanelSection from "@/components/VideoPanelSection";
import WebGLCanvas from "@/components/WebGLCanvas";
import { getPillars } from "@/lib/api/pillars";
import { breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const HOME_DESCRIPTION =
  "GOTT WALD Holding LLC — Standards-led holding company headquartered in Tbilisi, Georgia. We build operating-grade systems for people and strategic assets, turning complexity into clarity and decisions into measurable impact.";

export const metadata: Metadata = {
  title: "Home",
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "GOTT WALD Holding — Standards-Led Holding & Operations",
    description: HOME_DESCRIPTION,
    // og:image resolved from app/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "GOTT WALD Holding — Standards-Led Holding & Operations",
    description: HOME_DESCRIPTION,
  },
};

const PillarsTilesSection = dynamic(
  () => import("@/components/PillarTilesSection"),
  { ssr: true },
);
const GlobalAuthoritySection = dynamic(
  () => import("@/components/GlobalAuthoritySection"),
  { ssr: true },
);
const StrategicInquirySection = dynamic(
  () => import("@/components/StrategicInquirySection"),
  { ssr: true },
);
const FooterSection = dynamic(() => import("@/components/FooterSection"), {
  ssr: true,
});
const NextChapterTransition = dynamic(
  () => import("@/components/NextChapterTransition"),
  { ssr: true },
);

export default async function Home() {
  const pillars = await getPillars();
  const tNav = await getTranslations("nav");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", url: "/" }])}
      />
      <WebGLCanvas />
      <LoadingOverlay />

      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <PillarsTilesSection pillars={pillars} />
        <GlobalAuthoritySection />
        <StrategicInquirySection />
        <FooterSection />
        <NextChapterTransition nextTitle={tNav("about")} nextHref="/about" />
      </div>

      <CustomScrollbar />
      <PagingScript />
    </>
  );
}
