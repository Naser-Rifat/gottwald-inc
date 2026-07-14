import JsonLd from "@/components/system/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import CooperationHubClient from "./CooperationHubClient";
import { hreflangAlternates } from "@/lib/i18n";

const COOPERATION_HUB_DESCRIPTION =
  "A dedicated point of entry for aligned partners, operators, advisors, investors, and strategic collaborators.";

export const metadata = {
  title: "Cooperation Hub",
  description: COOPERATION_HUB_DESCRIPTION,
  alternates: { canonical: "/cooperation-hub", languages: hreflangAlternates("/cooperation-hub") },
  openGraph: {
    title: "Cooperation Hub",
    description: COOPERATION_HUB_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cooperation Hub",
    description: COOPERATION_HUB_DESCRIPTION,
  },
};

export default function CooperationHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/cooperation-hub",
            name: "Cooperation Hub — GOTT WALD Holding",
            description:
              "Dedicated entry point for aligned partners, operators, advisors, investors, and strategic collaborators engaging with GOTT WALD Holding.",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Cooperation Hub", url: "/cooperation-hub" },
          ]),
        ]}
      />
      <CooperationHubClient />
    </>
  );
}
