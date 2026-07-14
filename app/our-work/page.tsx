import type { Metadata } from "next";
import { getPillars } from "@/lib/api/pillars";
import OurWorkClient from "./OurWorkClient";
import JsonLd from "@/components/system/JsonLd";
import { hreflangAlternates } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";

// <=155 chars so SERPs render the full snippet without truncation.
const OUR_WORK_DESCRIPTION =
  "The full registry of GOTT WALD pillars — IT Solutions, Consulting, SolutionFinder, Coaching, Marketing, Relocation. Modular by design, unified by standard.";

export const metadata: Metadata = {
  title: "All Pillars",
  description: OUR_WORK_DESCRIPTION,
  alternates: { canonical: "/our-work", languages: hreflangAlternates("/our-work") },
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
