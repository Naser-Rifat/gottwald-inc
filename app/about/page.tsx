import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import JsonLd from "@/components/system/JsonLd";
import { hreflangAlternates } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  aboutPageJsonLd,
  faqJsonLd,
  founderJsonLd,
  SITE_URL,
} from "@/lib/seo";
import { aboutFaqs } from "@/lib/faqs";

// <=155 chars so SERPs render the full snippet without truncation.
const ABOUT_DESCRIPTION =
  "GOTT WALD is a unified execution standard — strategy, structure, technology, and human performance as one integrated system. Based in Tbilisi, Georgia.";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about", languages: hreflangAlternates("/about") },
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

// Enriched Person node for the founder — binds Mathias to the Organization
// via `worksFor`. AI engines (Perplexity, ChatGPT, Claude, Gemini) resolve
// "who runs GOTT WALD" with high confidence when the same person appears as
// `founder` on the Organization AND has their own `Person` schema on /about.
//
// LinkedIn / X / Wikidata URLs come from env vars (Vercel dashboard) so the
// content team can add profiles without a code deploy. Bio + jobTitle stay
// authoritative in code — they encode public positioning, not private info.
const founderProfiles: string[] = [
  process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN,
  process.env.NEXT_PUBLIC_FOUNDER_X,
  process.env.NEXT_PUBLIC_FOUNDER_WIKIDATA,
].filter((url): url is string => Boolean(url?.trim()));

const mathiasFounderNode = founderJsonLd({
  name: "Mathias Gottwald",
  jobTitle: "Founder & Patron, GOTT WALD Holding LLC",
  description:
    "Founder and patron of GOTT WALD Holding LLC — a standards-led holding company headquartered in Tbilisi, Georgia. Builds operating-grade systems for people and strategic assets across IT, consulting, coaching, marketing, and relocation.",
  image: `${SITE_URL}/logo.png`,
  url: `${SITE_URL}/about`,
  sameAs: founderProfiles.length > 0 ? founderProfiles : undefined,
});

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
          mathiasFounderNode,
          faqJsonLd(aboutFaqs),
        ]}
      />
      <AboutClient />
    </>
  );
}
