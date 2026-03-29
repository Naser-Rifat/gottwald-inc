import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillar,
  getNextPillar,
  getAllPillarSlugs,
} from "@/lib/api/pillars";
import PillarsDetailClient from "./PillarDetailClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pillarServiceJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar) return { title: "GOTT WALD — Pillar" };

  const socialImage = pillar.image || DEFAULT_OG_IMAGE;
  return {
    title: pillar.title,
    description: `${pillar.description} ${pillar.details}`.slice(0, 160),
    alternates: { canonical: `/pillars/${slug}` },
    openGraph: {
      title: `${pillar.title} — GOTT WALD`,
      description: pillar.description,
      images: [{ url: socialImage, alt: pillar.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pillar.title} — GOTT WALD`,
      description: pillar.description,
      images: [socialImage],
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
        ]}
      />
      <PillarsDetailClient project={pillar} nextProject={nextPillar} />
    </>
  );
}
