import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import CooperationHubClient from "./CooperationHubClient";

export const metadata = {
  title: "Cooperation Hub | GOTT WALD",
  description: "A dedicated point of entry for aligned partners, operators, advisors, investors, and strategic collaborators.",
  alternates: { canonical: "/cooperation-hub" },
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
