import type { Metadata } from "next";
import { getPillars } from "@/lib/api/pillars";
import OurWorkClient from "./OurWorkClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";

const OUR_WORK_DESCRIPTION =
  "Explore the full registry of GOTT WALD structural pillars — 9 modular components including IT Solutions, Consulting, SolutionFinder, Coaching, Marketing, and Relocation. Designed to stand alone, engineered to connect.";

export const metadata: Metadata = {
  title: "All Pillars",
  description: OUR_WORK_DESCRIPTION,
  alternates: { canonical: "/our-work" },
  openGraph: {
    title: "All Pillars",
    description: OUR_WORK_DESCRIPTION,
    // og:image resolved from app/our-work/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "All Pillars",
    description: OUR_WORK_DESCRIPTION,
  },
};

export default async function OurWorkPage() {
  const pillars = await getPillars();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "All Pillars", url: "/our-work" },
          ]),
          collectionPageJsonLd(
            pillars.map((p) => ({
              title: p.title,
              slug: p.slug,
              description: p.description,
            })),
          ),
        ]}
      />
      <OurWorkClient pillars={pillars} />
    </>
  );
}
