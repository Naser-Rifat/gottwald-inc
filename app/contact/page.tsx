import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, contactPageJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GOTT WALD Holding LLC for strategic inquiries, partnership requests, and general communication. Head office in Tbilisi, Georgia.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description:
      "Contact GOTT WALD Holding LLC for strategic inquiries, partnership requests, and general communication. Head office in Tbilisi, Georgia.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Contact — GOTT WALD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Contact GOTT WALD Holding LLC for strategic inquiries, partnership requests, and general communication. Head office in Tbilisi, Georgia.",
    images: [DEFAULT_OG_IMAGE],
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
