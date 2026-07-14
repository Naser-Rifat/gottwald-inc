import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import JsonLd from "@/components/system/JsonLd";
import { hreflangAlternates } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  aboutPageJsonLd,
  faqJsonLd,
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
