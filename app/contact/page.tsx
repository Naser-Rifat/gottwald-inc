import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, contactPageJsonLd } from "@/lib/seo";

const CONTACT_DESCRIPTION =
  "Contact GOTT WALD Holding LLC for strategic inquiries, partnership requests, and general communication. Head office in Tbilisi, Georgia.";

export const metadata: Metadata = {
  title: "Contact",
  description: CONTACT_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description: CONTACT_DESCRIPTION,
    // og:image resolved from app/contact/opengraph-image.tsx convention file
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description: CONTACT_DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
          contactPageJsonLd(),
        ]}
      />
      <ContactClient />
    </>
  );
}
