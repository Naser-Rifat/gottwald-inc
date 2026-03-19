import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPillar,
  getNextPillar,
  getAllPillarSlugs,
} from "@/lib/api/pillars";
import PillarsDetailClient from "./PillarDetailClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pillarServiceJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar) return { title: "Pillar Not Found" };
  return {
    title: pillar.title,
    description: `${pillar.description} ${pillar.details}`.slice(0, 160),
    alternates: { canonical: `/pillars/${slug}` },
    openGraph: {
      title: `${pillar.title} — GOTT WALD`,
      description: pillar.description,
      images: [{ url: pillar.image, alt: pillar.title }],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPillarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PillarPage({ params }: Props) {
  const { slug } = await params;
  const pillar = await getPillar(slug);

  if (!pillar) {
    notFound();
  }

  const nextPillar = await getNextPillar(slug);

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
