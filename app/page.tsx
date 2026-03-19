import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CustomScrollbar from "@/components/CustomScrollbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import VideoPanelSection from "@/components/VideoPanelSection";
import WebGLCanvas from "@/components/WebGLCanvas";
import { getPillars } from "@/lib/api/pillars";

export const metadata: Metadata = {
  title: "Home",
  description:
    "GOTT WALD Holding LLC — Standards-led holding company. We build operating-grade systems for people and strategic assets, turning complexity into clarity and decisions into measurable impact.",
  alternates: { canonical: "/" },
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
  return (
    <>
      <WebGLCanvas />
      <LoadingOverlay />

      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <PillarsTilesSection pillars={pillars} />
        <GlobalAuthoritySection />
        <StrategicInquirySection />
        <FooterSection />
        <NextChapterTransition nextTitle="ABOUT US" nextHref="/about" />
      </div>

      <CustomScrollbar />
      <PagingScript />
    </>
  );
}
