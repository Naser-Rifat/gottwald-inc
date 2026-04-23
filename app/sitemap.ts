import type { MetadataRoute } from "next";
import { getAllPillarSlugs } from "@/lib/api/pillars";
import { SITE_URL } from "@/lib/seo";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type SitemapEntry = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

const staticEntries: SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/our-work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/partnerships", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.7 },
  { path: "/entity-grid", changeFrequency: "monthly", priority: 0.6 },
  { path: "/cooperation-hub", changeFrequency: "monthly", priority: 0.6 },
  { path: "/strategic-assets", changeFrequency: "monthly", priority: 0.6 },
  { path: "/press-media-kit", changeFrequency: "monthly", priority: 0.6 },
  { path: "/protocols", changeFrequency: "yearly", priority: 0.4 },
  { path: "/imprint", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-use", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Pillar slugs come from the backend. If the API is unreachable at build
  // time, ship the static entries rather than fail the whole sitemap.
  let pillarSlugs: string[] = [];
  try {
    pillarSlugs = await getAllPillarSlugs();
  } catch {
    pillarSlugs = [];
  }

  const staticUrls = staticEntries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const pillarUrls = pillarSlugs.map((slug) => ({
    url: `${SITE_URL}/pillars/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...pillarUrls];
}
