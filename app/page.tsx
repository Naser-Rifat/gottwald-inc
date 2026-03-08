import AboutSection from "@/components/AboutSection";
import CustomScrollbar from "@/components/CustomScrollbar";
import GlobalAuthoritySection from "@/components/GlobalAuthoritySection";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import ProjectTilesSection from "@/components/ProjectTilesSection";
import VideoPanelSection from "@/components/VideoPanelSection";
import FooterSection from "@/components/FooterSection";
import NextPageTransition from "@/components/NextPageTransition";
import WebGLCanvas from "@/components/WebGLCanvas";

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
        <AboutSection />
        <FooterSection />
        {/* Scroll-to-navigate transition — fills progress bar and goes to /about */}
        <NextPageTransition />
      </div>

      {/* Custom scrollbar */}
      <CustomScrollbar />

      {/* Paging / scroll animation logic */}
      <PagingScript />
    </>
  );
}
