import { Pillar } from "../types/pillars";
import { MOCK_PROJECTS } from "../mock/projects.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_DATA_SOURCE === "mock";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${endpoint}`);
  return res.json();
}

export async function getPillars(): Promise<Pillar[]> {
  if (USE_MOCK) return MOCK_PROJECTS;
  return apiFetch<Pillar[]>("/api/pillars");
}

export async function getProject(slug: string): Promise<Pillar | undefined> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug);
  return apiFetch<Pillar>(`/api/pillars/${slug}`);
}

export async function getNextProject(slug: string): Promise<Pillar> {
  const pillars = await getPillars();
  const index = pillars.findIndex((p) => p.slug === slug);
  const nextIndex = (index + 1) % pillars.length;
  return pillars[nextIndex];
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (USE_MOCK) return MOCK_PROJECTS.map((p) => p.slug);
  const pillars = await apiFetch<Pillar[]>("/api/pillars");
  return pillars.map((p) => p.slug);
}
