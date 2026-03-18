import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join GOTT WALD Holding LLC. We are selecting operators who build resilient systems — discipline, trust, and delivery as non-negotiable.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return <CareersClient />;
}
