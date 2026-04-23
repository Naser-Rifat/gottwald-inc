import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  aboutPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";

const ABOUT_DESCRIPTION =
  "GOTT WALD is not a traditional service provider. It is a unified execution standard — strategy, structure, technology, communication, and human performance built as one integrated system. Headquartered in Tbilisi, Georgia.";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description: ABOUT_DESCRIPTION,
    // og:image resolved from app/about/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: ABOUT_DESCRIPTION,
  },
};

const aboutFaqs = [
  {
    question: "What is GOTT WALD Holding?",
    answer:
      "GOTT WALD Holding LLC is a standards-led holding company headquartered in Tbilisi, Georgia. It operates as a unified architecture of modular service pillars — including IT Solutions, Consulting, SolutionFinder, Coaching, Marketing, and Relocation — designed to turn complexity into clarity and decisions into measurable impact.",
  },
  {
    question: "Where is GOTT WALD headquartered?",
    answer:
      "GOTT WALD Holding LLC is headquartered in Tbilisi, Georgia — a strategic midpoint between East and West, offering international accessibility with pragmatic speed.",
  },
  {
    question: "What services does GOTT WALD provide?",
    answer:
      "GOTT WALD offers nine structural pillars: IT Solutions 2030 (digital infrastructure), SolutionFinder (structured analysis), Consulting (strategy & scale), Coaching & Mentoring (executive performance), Marketing & Communication (visibility & demand), Relocation (Georgia deployment), Digital IT Architect (AI consultation), YIG.CARE (frequency wellness), and PLHH Coin (RWA governance).",
  },
  {
    question: "What does 'standards-led' mean at GOTT WALD?",
    answer:
      "Standards-led means every service pillar follows a single governance framework — one standard, one language of delivery. Components evolve and markets shift, but the execution standard remains. This ensures repeatability, defensibility, and compounding performance.",
  },
  {
    question: "What is the GOTT WALD approach to solving business complexity?",
    answer:
      "GOTT WALD removes noise until only truth remains, then sequences decisions so they become self-evident. The approach: reveal root cause, define leverage, establish sequence. Solved means solved — felt in real life, not just in a pitch deck.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
          aboutPageJsonLd(),
          faqJsonLd(aboutFaqs),
        ]}
      />
      <AboutClient />
    </>
  );
}
