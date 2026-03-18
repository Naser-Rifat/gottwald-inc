import { notFound } from "next/navigation";
import { getProject, getNextProject, getAllProjectSlugs } from "@/lib/api/projects";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = await getNextProject(slug);

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}
