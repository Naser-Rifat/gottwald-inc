import { Project } from "../types/project";
import { MOCK_PROJECTS } from "../mock/projects.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_DATA_SOURCE === "mock";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 }, // Next.js ISR — revalidate every 60 seconds
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${endpoint}`);
  return res.json();
}

// GET all projects — used in the Projects section of the homepage
export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK) return MOCK_PROJECTS;
  return apiFetch<Project[]>("/api/projects");
}

// GET single project by slug — used in project detail pages
export async function getProject(slug: string): Promise<Project | undefined> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug);
  return apiFetch<Project>(`/api/projects/${slug}`);
}

// GET all slugs — used for generateStaticParams in Next.js dynamic routes
export async function getAllProjectSlugs(): Promise<string[]> {
  if (USE_MOCK) return MOCK_PROJECTS.map((p) => p.slug);
  const projects = await apiFetch<Project[]>("/api/projects");
  return projects.map((p) => p.slug);
}
