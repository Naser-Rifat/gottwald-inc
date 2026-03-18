import dynamic from "next/dynamic";
import CustomScrollbar from "@/components/CustomScrollbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import PagingScript from "@/components/PagingScript";
import PhysicsSandboxSection from "@/components/PhysicsSandboxSection";
import VideoPanelSection from "@/components/VideoPanelSection";
import WebGLCanvas from "@/components/WebGLCanvas";
import { getProjects } from "@/lib/api/projects";

const ProjectTilesSection = dynamic(
  () => import("@/components/ProjectTilesSection"),
  { ssr: true }
);
const GlobalAuthoritySection = dynamic(
  () => import("@/components/GlobalAuthoritySection"),
  { ssr: true }
);
const StrategicInquirySection = dynamic(
  () => import("@/components/StrategicInquirySection"),
  { ssr: true }
);
const FooterSection = dynamic(
  () => import("@/components/FooterSection"),
  { ssr: true }
);
const NextChapterTransition = dynamic(
  () => import("@/components/NextChapterTransition"),
  { ssr: true }
);

export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <WebGLCanvas />
      <LoadingOverlay />

      <div id="home-content" className="fade-out">
        <PhysicsSandboxSection />
        <VideoPanelSection />
        <ProjectTilesSection projects={projects} />
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
