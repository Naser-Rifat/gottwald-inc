import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getNextProject } from "@/lib/projectData";
import ProjectDetailClient from "./ProjectDetailClient";

// Generate static paths for all projects
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(slug);

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}
