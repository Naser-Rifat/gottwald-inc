import type { Metadata } from "next";
import CareersClient from "./CareersClient";
import JsonLd from "@/components/system/JsonLd";
import { hreflangAlternates } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { careersFaqs } from "@/lib/faqs";

// <=155 chars so SERPs render the full snippet without truncation.
const CAREERS_DESCRIPTION =
  "Join GOTT WALD Holding — operators building resilient systems across 9 pillars: IT, Consulting, Coaching, Marketing, Relocation, and more. Tbilisi, GE.";

export const metadata: Metadata = {
  title: "Careers",
  description: CAREERS_DESCRIPTION,
  alternates: { canonical: "/careers", languages: hreflangAlternates("/careers") },
  openGraph: {
    title: "Careers",
    description: CAREERS_DESCRIPTION,
    // og:image resolved from app/careers/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers",
    description: CAREERS_DESCRIPTION,
  },
};

export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Careers", url: "/careers" },
          ]),
          faqJsonLd(careersFaqs),
        ]}
      />
      <CareersClient />
    </>
  );
}
