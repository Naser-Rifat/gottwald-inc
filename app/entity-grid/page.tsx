import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import EntityGridClient from "./EntityGridClient";

const ENTITY_GRID_DESCRIPTION =
  "A structured overview of the holding's operational entities, platforms, and strategic ventures.";

export const metadata = {
  title: "Entity Grid",
  description: ENTITY_GRID_DESCRIPTION,
  alternates: { canonical: "/entity-grid" },
  openGraph: {
    title: "Entity Grid",
    description: ENTITY_GRID_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Entity Grid",
    description: ENTITY_GRID_DESCRIPTION,
  },
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
