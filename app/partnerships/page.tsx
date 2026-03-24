import type { Metadata } from "next";
import PartnershipsClient from "./PartnershipsClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Apply to become a values-aligned partner in the GOTT WALD 2030 infrastructure cycle. Confidential by default, standards-led by design. Limited selection for principals and operators.",
  alternates: { canonical: "/partnerships" },
  openGraph: {
    title: "Partnerships",
    description:
      "Apply to become a values-aligned partner in the GOTT WALD 2030 infrastructure cycle. Confidential by default, standards-led by design. Limited selection for principals and operators.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Partnerships — GOTT WALD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partnerships",
    description:
      "Apply to become a values-aligned partner in the GOTT WALD 2030 infrastructure cycle. Confidential by default, standards-led by design. Limited selection for principals and operators.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const partnershipFaqs = [
  {
    question: "How do I become a partner with GOTT WALD?",
    answer:
      "GOTT WALD selects a limited number of values-aligned partners for its 2030 infrastructure cycles. Apply through the strategic inquiry form on the partnerships page. The process is confidential by default and standards-led by design.",
  },
  {
    question: "What are the partnership requirements?",
    answer:
      "GOTT WALD partners are principals and operators who build resilient systems and treat trust, discipline, and delivery as non-negotiable. The selection is values-first — character over credentials, alignment over volume.",
  },
  {
    question: "Is the partnership process confidential?",
    answer:
      "Yes. GOTT WALD operates discreet by default. Confidentiality is engineered into the framework — not a promise, but a structural guarantee. No public theatrics, clean interfaces, controlled access.",
  },
];

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
