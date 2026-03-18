import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "GOTT WALD is a unified architecture — modular components, one standard, one language of delivery. Headquartered in Tbilisi, Georgia.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
