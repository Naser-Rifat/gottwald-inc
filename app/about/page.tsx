import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import JsonLd from "@/components/system/JsonLd";
import {
  breadcrumbJsonLd,
  aboutPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { aboutFaqs } from "@/lib/faqs";

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
