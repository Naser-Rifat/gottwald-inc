import type { Metadata } from "next";
import CareersClient from "./CareersClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { careersFaqs } from "@/lib/faqs";

const CAREERS_DESCRIPTION =
  "Join GOTT WALD Holding LLC. We are selecting operators who build resilient systems across 9 pillars — discipline, trust, and delivery as non-negotiable. Roles in IT, Consulting, Coaching, Marketing, and more.";

export const metadata: Metadata = {
  title: "Careers",
  description: CAREERS_DESCRIPTION,
  alternates: { canonical: "/careers" },
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
