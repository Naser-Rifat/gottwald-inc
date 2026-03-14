import CustomScrollbar from "@/components/CustomScrollbar";
import GlobalAuthoritySection from "@/components/GlobalAuthoritySection";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import ProjectTilesSection from "@/components/ProjectTilesSection";
import StrategicInquirySection from "@/components/StrategicInquirySection";
import VideoPanelSection from "@/components/VideoPanelSection";
import FooterSection from "@/components/FooterSection";
import WebGLCanvas from "@/components/WebGLCanvas";
import NextChapterTransition from "@/components/NextChapterTransition";

export default function Home() {
  return (
    <>
      <WebGLCanvas />
      {/* Loading counter overlay */}
      <LoadingOverlay />

      {/* Main scrollable content */}
      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <ProjectTilesSection />
        <GlobalAuthoritySection />
        {/* <AboutSection /> */}
        <StrategicInquirySection />
        <FooterSection />
        <NextChapterTransition nextTitle="ABOUT US" nextHref="/about" />
      </div>

      {/* Custom scrollbar */}
      <CustomScrollbar />

      {/* Paging / scroll animation logic */}
      <PagingScript />
    </>
  );
}
