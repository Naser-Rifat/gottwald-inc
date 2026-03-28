// import { MOCK_PROJECTS } from './../mock/projects.mock';
import type { ContentBlock, Pillar, PillarTheme } from "../types/pillars";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ORIGIN = BASE_URL.replace(/\/$/, "");


function toAbsoluteImageUrl(url: string | undefined): string {
  if (!url || !url.trim()) return "";
  const s = url.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${API_ORIGIN}${s.startsWith("/") ? "" : "/"}${s}`;
}

interface ApiBlock {
  id?: string;
  type: string;
  theme?: string;
  heading?: string;
  body?: string;
  image?: string;
  video_url?: string;
  order?: number;
}

interface ApiPillar {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  details?: string;
  image?: string;
  launch_url?: string;
  tags?: string | string[];
  services?: string | string[];
  theme?: string | PillarTheme;
  content_blocks?: ApiBlock[];
  content_blocks_data?: ApiBlock[];
}

interface PillarsApiResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: ApiPillar[];
  results?: ApiPillar[];
  pagination?: {
    total_items?: number;
    total_pages?: number;
    current_page?: number;
    page_size?: number;
    has_next?: boolean;
    has_previous?: boolean;
    next?: string | null;
    previous?: string | null;
  };
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [String(val)];
  const result: string[] = [];
  for (const item of arr) {
    const s = String(item).trim();
    if (!s) continue;
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        result.push(...toArray(parsed));
      } else if (typeof parsed === "string") {
        result.push(parsed.trim());
      } else {
        result.push(s);
      }
    } catch {
      if (!s.startsWith("[")) result.push(s);
    }
  }
  return result.filter(Boolean);
}

const DEFAULT_THEME: PillarTheme = {
  background: "#0a0a0a",
  text: "#f5f5f5",
  accent: "#c9a84c",
};

function toTheme(val: string | PillarTheme | undefined): PillarTheme {
  if (!val) return DEFAULT_THEME;
  if (typeof val === "object" && "background" in val) return val;
  try {
    const p = JSON.parse(String(val));
    return p?.background ? p : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

const VALID_BLOCK_TYPES = [
  "rich-text",
  "image",
  "video",
  "showcase",
  "case-study",
  "feature",
  "stats",
  "fullbleed",
];

/** Deduplicate and truncate malformed titles from the backend */
function sanitizeTitle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length <= 80) return trimmed;

  // Detect repeated substrings: try lengths from 5..half the string
  for (let len = 5; len <= trimmed.length / 2; len++) {
    const candidate = trimmed.slice(0, len);
    const repeated = candidate.repeat(Math.ceil(trimmed.length / len)).slice(0, trimmed.length);
    if (repeated === trimmed) return candidate;
  }

  // Fallback: just truncate
  return trimmed.slice(0, 80);
}

function mapApiToPillar(api: ApiPillar): Pillar {
  const raw = api.content_blocks_data ?? api.content_blocks ?? [];
  const blocks: ContentBlock[] = raw
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((b) => ({
      id: b.id,
      type: VALID_BLOCK_TYPES.includes(b.type)
        ? (b.type as ContentBlock["type"])
        : "rich-text",
      theme: (b.theme === "dark" ? "dark" : "light") as ContentBlock["theme"],
      heading: b.heading,
      body: b.body,
      image: toAbsoluteImageUrl(b.image),
      videoUrl: b.video_url,
    }));
  return {
    slug: api.slug,
    title: sanitizeTitle(api.title),
    description: api.description ?? "",
    details: api.details ?? api.description ?? "",
    image: toAbsoluteImageUrl(api.image),
    launchUrl: api.launch_url ?? "",
    tags: toArray(api.tags),
    services: toArray(api.services),
    theme: toTheme(api.theme),
    contentBlocks: blocks,
  };
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const apiKey = process.env.API_READ_KEY;
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(`${API_ORIGIN}${endpoint}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${endpoint}`);
  return res.json();
}

export async function getPillars(): Promise<Pillar[]> {
  // const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || "mock";
  // if (dataSource === "mock") {
  //   return MOCK_PROJECTS;
  // }

  const res = await apiFetch<PillarsApiResponse>("/api/v1/pillars/");
  const items = res.data ?? res.results ?? [];
  return items.map(mapApiToPillar);
}

export async function getPillar(slug: string): Promise<Pillar | undefined> {
  // const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || "mock";
  // if (dataSource === "mock") {
  //   return MOCK_PROJECTS.find((p) => p.slug === slug);
  // }

  try {
    const res = await apiFetch<{ data?: ApiPillar } | ApiPillar>(
      `/api/v1/pillars/${slug}/`,
    );
    const api =
      res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : (res as ApiPillar);
    return mapApiToPillar(api);
  } catch {
    const pillars = await getPillars();
    const found = pillars.find((p) => p.slug === slug);
    return found ?? undefined;
  }
}

export async function getNextPillar(slug: string): Promise<Pillar> {
  const pillars = await getPillars();
  const index = pillars.findIndex((p) => p.slug === slug);
  const nextIndex = index < 0 ? 0 : (index + 1) % pillars.length;
  return pillars[nextIndex];
}

export async function getAllPillarSlugs(): Promise<string[]> {
  // const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || "mock";
  // if (dataSource === "mock") {
  //   return MOCK_PROJECTS.map((p) => p.slug);
  // }

  const res = await apiFetch<PillarsApiResponse>("/api/v1/pillars/");
  const items = res.data ?? res.results ?? [];
  return items.map((p) => p.slug);
}
