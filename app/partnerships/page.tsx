import type { Metadata } from "next";
import PartnershipsClient from "./PartnershipsClient";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Apply to become a values-aligned partner in the GOTT WALD 2030 infrastructure cycle. Confidential by default, standards-led by design.",
  alternates: { canonical: "/partnerships" },
};

export default function PartnershipsPage() {
  return <PartnershipsClient />;
}
