import type { Metadata } from "next";
import CareersClient from "./CareersClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jobPostingJsonLd,
} from "@/lib/seo";

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

const careersFaqs = [
  {
    question: "What kind of roles does GOTT WALD hire for?",
    answer:
      "GOTT WALD recruits across 9 structural pillars: Corporate Services, SolutionFinder, Consulting, Coaching & Mentoring, Relocation, IT Solutions 2030, Marketing & Communication, YIG.CARE, and PLHH. Each pillar needs operators — people who build resilient systems and treat trust, discipline, and delivery as non-negotiable.",
  },
  {
    question: "Where are GOTT WALD jobs located?",
    answer:
      "GOTT WALD is headquartered in Tbilisi, Georgia. Roles may be based in Tbilisi or remote depending on the pillar and function.",
  },
  {
    question: "What is the hiring philosophy at GOTT WALD?",
    answer:
      "Skill matters. Character decides. GOTT WALD selects for alignment with its core values — Peace, Love, Harmony for more Humanity — and its non-negotiable execution standards. Money is not the driver; money is the result of alignment, responsibility, and clean execution.",
  },
];

const sampleJobs = [
  { title: "IT Solutions Specialist", description: "Build future-ready digital infrastructure for SMEs under the IT Solutions 2030 pillar.", pillar: "IT Solutions 2030" },
  { title: "Strategic Consultant", description: "Design strategy architecture and scalable systems for executive clients.", pillar: "Consulting" },
  { title: "Marketing & Communication Lead", description: "Engineer trust and build predictable demand infrastructure for premium positioning.", pillar: "Marketing & Communication" },
];

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
          ...jobPostingJsonLd(sampleJobs),
        ]}
      />
      <CareersClient />
    </>
  );
}
