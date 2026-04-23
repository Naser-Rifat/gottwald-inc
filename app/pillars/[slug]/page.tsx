import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillar,
  getNextPillar,
  getAllPillarSlugs,
} from "@/lib/api/pillars";
import PillarsDetailClient from "./PillarDetailClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  pillarServiceJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { getPillarFaqs } from "@/lib/pillarFaqs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar) return { title: "GOTT WALD — Pillar" };

  const metaDescription = pillar.description?.trim()
    ? pillar.description.trim()
    : `${pillar.title} — GOTT WALD Holding.`;
  return {
    title: pillar.title,
    description: metaDescription,
    alternates: { canonical: `/pillars/${slug}` },
    openGraph: {
      title: `${pillar.title} — GOTT WALD`,
      description: metaDescription,
      // og:image resolved from app/pillars/[slug]/opengraph-image.tsx convention file
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
            { name: pillar.title, url: `/pillars/${slug}` },
          ]),
          pillarServiceJsonLd(pillar),
          ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <PillarsDetailClient project={pillar} nextProject={nextPillar} />
    </>
  );
}
