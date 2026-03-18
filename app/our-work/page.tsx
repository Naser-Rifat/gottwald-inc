import type { Metadata } from "next";
import { getProjects } from "@/lib/api/projects";
import OurWorkClient from "./OurWorkClient";

export const metadata: Metadata = {
  title: "All Pillars",
  description:
    "Explore the full registry of GOTT WALD structural pillars — modular components designed to stand alone and engineered to connect into one integrated operating system.",
  alternates: { canonical: "/our-work" },
};

export default async function OurWorkPage() {
  const projects = await getProjects();

  return <OurWorkClient projects={projects} />;
}
