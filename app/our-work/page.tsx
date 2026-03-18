import { getProjects } from "@/lib/api/projects";
import OurWorkClient from "./OurWorkClient";

export default async function OurWorkPage() {
  const projects = await getProjects();

  return <OurWorkClient projects={projects} />;
}
