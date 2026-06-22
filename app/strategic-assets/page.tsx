import JsonLd from "@/components/system/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import StrategicAssetsClient from "./StrategicAssetsClient";

const STRATEGIC_ASSETS_DESCRIPTION =
  "A curated portfolio of strategic structures, platforms, ventures, and real-world value frameworks.";

export const metadata = {
  title: "Strategic Assets",
  description: STRATEGIC_ASSETS_DESCRIPTION,
  alternates: { canonical: "/strategic-assets" },
  openGraph: {
    title: "Strategic Assets",
    description: STRATEGIC_ASSETS_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Assets",
    description: STRATEGIC_ASSETS_DESCRIPTION,
  },
};

export default function StrategicAssetsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/strategic-assets",
            name: "Strategic Assets — GOTT WALD Holding",
            description:
              "Curated portfolio of GOTT WALD Holding's strategic structures, platforms, ventures, and real-world value frameworks.",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Strategic Assets", url: "/strategic-assets" },
          ]),
        ]}
      />
      <StrategicAssetsClient />
    </>
  );
}
