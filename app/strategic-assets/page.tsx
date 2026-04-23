import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import StrategicAssetsClient from "./StrategicAssetsClient";

export const metadata = {
  title: "Strategic Assets | GOTT WALD",
  description: "A curated portfolio of strategic structures, platforms, ventures, and real-world value frameworks.",
  alternates: { canonical: "/strategic-assets" },
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
