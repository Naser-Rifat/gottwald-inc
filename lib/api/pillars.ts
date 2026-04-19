import { Offer } from "../projectData";
import type { ContentBlock, Pillar, PillarTheme } from "../types/pillars";



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
  offers?: Offer[];
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ORIGIN = BASE_URL.replace(/\/$/, "");

// ─── Cache tag used for on-demand revalidation ──────────────────────────────
export const PILLARS_CACHE_TAG = "pillars";

function toAbsoluteImageUrl(url: string | undefined): string {
  if (!url || !url.trim()) return "";
  const s = url.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${API_ORIGIN}${s.startsWith("/") ? "" : "/"}${s}`;
}



function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [String(val)];
  const result: string[] = [];
  for (const item of arr) {
    const s = String(item).trim();
    if (!s || s.toLowerCase() === "string") continue;
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        result.push(...toArray(parsed));
      } else if (typeof parsed === "string") {
        if (parsed.toLowerCase() !== "string") result.push(parsed.trim());
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

  for (let len = 5; len <= trimmed.length / 2; len++) {
    const candidate = trimmed.slice(0, len);
    const repeated = candidate
      .repeat(Math.ceil(trimmed.length / len))
      .slice(0, trimmed.length);
    if (repeated === trimmed) return candidate;
  }

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
  const title = sanitizeTitle(api.title);
  const finalTitle = title.toLowerCase() === "string" ? "Pillar Details" : title;

  return {
    slug: api.slug,
    title: finalTitle,
    description: api.description ?? "",
    details: api.details ?? "",
    image: toAbsoluteImageUrl(api.image),
    launchUrl: api.launch_url ?? "",
    tags: toArray(api.tags).filter(t => !t.startsWith("http://") && !t.startsWith("https://")),
    services: toArray(api.services),
    theme: toTheme(api.theme),
    contentBlocks: blocks,
    offers: Array.isArray(api.offers) ? api.offers : undefined,
  };
}

// ─── Resilient fetch with AbortController timeout ─────────────────────────────
// AWS EC2 / Render cold starts can stall for 30+ seconds.
// We abort after 12s so Next.js always responds — even if the API is sleeping.
const FETCH_TIMEOUT_MS = 12_000;

// ─── ISR Revalidation interval (seconds) ────────────────────────────────────
// How long Next.js serves a cached page before checking for fresh data.
// 30s = new pillars appear within 30 seconds on list pages.
const REVALIDATE_SECONDS = 30;

async function apiFetch<T>(
  endpoint: string,
  opts?: { tags?: string[] },
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const apiKey = process.env.API_READ_KEY;
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const res = await fetch(`${API_ORIGIN}${endpoint}`, {
      headers,
      signal: controller.signal,
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: opts?.tags ?? [PILLARS_CACHE_TAG],
      },
    });

    if (!res.ok) throw new Error(`API ${res.status}: ${endpoint}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Pillar fetching ─────────────────────────────────────────────────────────
// Next.js automatically deduplicates fetch() calls with the same URL within a
// single server render pass, so no manual dedup cache is needed.
//
// IMPORTANT: We intentionally let errors PROPAGATE instead of returning [].
// When we return [] on failure, Next.js ISR treats it as a "successful" render
// with 0 pillars and may replace the cached page. By letting the error throw,
// ISR keeps the last valid cached page and retries on the next request.
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAllPillars(): Promise<Pillar[]> {
  const res = await apiFetch<PillarsApiResponse>("/api/v1/pillars/", {
    tags: [PILLARS_CACHE_TAG],
  });
  const items = (res.data ?? res.results ?? []).reverse();
  const pillars = items.map(mapApiToPillar);
  console.log(`[pillars] Fetched ${pillars.length} pillars from API`);
  return pillars;
}

// ─── Public exports ───────────────────────────────────────────────────────────

export async function getPillars(): Promise<Pillar[]> {
  return fetchAllPillars();
}

export async function getPillar(slug: string): Promise<Pillar | undefined> {
  // 1. Try the individual endpoint (fastest — avoids downloading all pillars)
  try {
    const res = await apiFetch<{ data?: ApiPillar } | ApiPillar>(
      `/api/v1/pillars/${slug}/`,
      { tags: [PILLARS_CACHE_TAG, `pillar-${slug}`] },
    );
    const api =
      res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : (res as ApiPillar);
    return mapApiToPillar(api);
  } catch (err: unknown) {
    // 2. Fall back to the shared cached list — NOT a second TCP call
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pillars] getPillar("${slug}") failed, using list:`, msg);
  }

  const pillars = await fetchAllPillars();
  return pillars.find((p) => p.slug === slug);
}

export async function getNextPillar(slug: string): Promise<Pillar> {
  const pillars = await fetchAllPillars();
  const index = pillars.findIndex((p) => p.slug === slug);
  const nextIndex = index < 0 ? 0 : (index + 1) % Math.max(pillars.length, 1);
  return (
    pillars[nextIndex] ?? {
      slug,
      title: "",
      description: "",
      details: "",
      image: "",
      launchUrl: "",
      tags: [],
      services: [],
      theme: DEFAULT_THEME,
      contentBlocks: [],
    }
  );
}

export async function getAllPillarSlugs(): Promise<string[]> {
  const pillars = await fetchAllPillars();
  return pillars.map((p) => p.slug);
}
