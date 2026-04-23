import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import EntityGridClient from "./EntityGridClient";

export const metadata = {
  title: "Entity Grid | GOTT WALD",
  description: "A structured overview of the holding's operational entities, platforms, and strategic ventures.",
  alternates: { canonical: "/entity-grid" },
};

export default function EntityGridPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/entity-grid",
            name: "Entity Grid — GOTT WALD Holding",
            description:
              "Structured overview of GOTT WALD Holding's operational entities, platforms, and strategic ventures across the pillar architecture.",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Entity Grid", url: "/entity-grid" },
          ]),
        ]}
      />
      <EntityGridClient />
    </>
  );
}
