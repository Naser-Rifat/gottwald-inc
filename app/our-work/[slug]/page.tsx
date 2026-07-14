import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillar,
  getNextPillar,
  getAllPillarSlugs,
} from "@/lib/api/pillars";
import PillarsDetailClient from "./PillarDetailClient";
import JsonLd from "@/components/system/JsonLd";
import {
  breadcrumbJsonLd,
  pillarServiceJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { hreflangAlternates } from "@/lib/i18n";
import { getPillarFaqs } from "@/lib/pillarFaqs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar) return { title: "GOTT WALD — Pillar" };

  // Truncate at 155 chars to keep the SERP snippet from being cut off.
  const rawDescription = pillar.description?.trim()
    ? pillar.description.trim()
    : `${pillar.title} — GOTT WALD Holding.`;
  const metaDescription =
    rawDescription.length > 155
      ? rawDescription.slice(0, 152).trimEnd() + "…"
      : rawDescription;
  const canonicalPath = `/our-work/${slug}`;
  return {
    title: pillar.title,
    description: metaDescription,
    alternates: {
      canonical: canonicalPath,
      languages: hreflangAlternates(canonicalPath),
    },
    openGraph: {
      title: `${pillar.title} — GOTT WALD`,
      description: metaDescription,
      // og:image resolved from app/our-work/[slug]/opengraph-image.tsx convention file
    },
    twitter: {
      card: "summary_large_image",
      title: `${pillar.title} — GOTT WALD`,
      description: metaDescription,
    },
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPillarSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // Backend unreachable at build time — dynamic rendering will handle it
    return [];
  }
}

export default async function PillarPage({ params }: Props) {
  const { slug } = await params;

  // Both calls share the same cached promise — only one HTTP request
  const [pillar, nextPillar] = await Promise.all([
    getPillar(slug),
    getNextPillar(slug),
  ]);

  // Only hard 404 if the pillar truly doesn't exist (slug not in API list)
  // A timeout returns undefined too — but we show notFound rather than a blank page
  if (!pillar) {
    notFound();
  }

  const faqs = getPillarFaqs(slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "All Pillars", url: "/our-work" },
            { name: pillar.title, url: `/our-work/${slug}` },
          ]),
          pillarServiceJsonLd(pillar),
          ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <PillarsDetailClient project={pillar} nextProject={nextPillar} />
    </>
  );
}
