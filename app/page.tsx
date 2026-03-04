import AboutSection from "@/components/AboutSection";
import CustomScrollbar from "@/components/CustomScrollbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import ProjectTileModal from "@/components/ProjectTileModal";
import ProjectTilesSection from "@/components/ProjectTilesSection";
import VideoPanelSection from "@/components/VideoPanelSection";
import WebGLCanvas from "@/components/WebGLCanvas";

export default function Home() {
  return (
    <>
      {/* Fixed WebGL canvas behind everything */}
      <WebGLCanvas />

      {/* Loading counter overlay */}
      <LoadingOverlay />

      {/* Main scrollable content */}
      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <ProjectTilesSection />
        <AboutSection />
      </div>

      {/* Project tile detail modal (fixed overlay) */}
      <ProjectTileModal />

      {/* Custom scrollbar */}
      <CustomScrollbar />

      {/* Paging / scroll animation logic */}
      <PagingScript />
    </>
  );
}
