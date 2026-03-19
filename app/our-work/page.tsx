import type { Metadata } from "next";
import { getPillars } from "@/lib/api/pillars";
import OurWorkClient from "./OurWorkClient";

export const metadata: Metadata = {
  title: "All Pillars",
  description:
    "Explore the full registry of GOTT WALD structural pillars — modular components designed to stand alone and engineered to connect into one integrated operating system.",
  alternates: { canonical: "/our-work" },
};

export default async function OurWorkPage() {
  const pillars = await getPillars();

  return <OurWorkClient pillars={pillars} />;
}
