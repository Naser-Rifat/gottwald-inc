import type { Metadata } from "next";
import PartnershipsClient from "./PartnershipsClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
} from "@/lib/seo";
import { partnershipFaqs } from "@/lib/faqs";

const PARTNERSHIPS_DESCRIPTION =
  "Apply to become a values-aligned partner in the GOTT WALD 2030 infrastructure cycle. Confidential by default, standards-led by design. Limited selection for principals and operators.";

export const metadata: Metadata = {
  title: "Partnerships",
  description: PARTNERSHIPS_DESCRIPTION,
  alternates: { canonical: "/partnerships" },
  openGraph: {
    title: "Partnerships",
    description: PARTNERSHIPS_DESCRIPTION,
    // og:image resolved from app/partnerships/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "Partnerships",
    description: PARTNERSHIPS_DESCRIPTION,
  },
};

const partnershipHowTo = {
  name: "How to apply for a GOTT WALD Partnership",
  description: "Step-by-step process for values-aligned partnership applications.",
  steps: [
    { name: "Submit Strategic Inquiry", text: "Complete the partnership application form with your area of interest, background, and alignment statement." },
    { name: "Values Screening", text: "Our team reviews for alignment with GOTT WALD non-negotiables: trust, discipline, delivery, and long-horizon thinking." },
    { name: "Strategic Conversation", text: "Selected applicants receive a confidential strategic call to explore mutual fit and define collaboration scope." },
    { name: "Partnership Activation", text: "Upon alignment confirmation, the partnership enters the 2030 infrastructure cycle with defined deliverables and governance." },
  ],
};

export default function PartnershipsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Partnerships", url: "/partnerships" },
          ]),
          faqJsonLd(partnershipFaqs),
          howToJsonLd(partnershipHowTo),
        ]}
      />
      <PartnershipsClient />
    </>
  );
}
