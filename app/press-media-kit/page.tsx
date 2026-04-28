import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PressMediaKitClient from "./PressMediaKitClient";

const PRESS_MEDIA_KIT_DESCRIPTION =
  "A structured point of access for media inquiries, official materials, and selected brand information.";

export const metadata = {
  title: "Press & Media Kit | GOTT WALD Holding LLC",
  description: PRESS_MEDIA_KIT_DESCRIPTION,
  alternates: { canonical: "/press-media-kit" },
  openGraph: {
    title: "Press & Media Kit",
    description: PRESS_MEDIA_KIT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media Kit",
    description: PRESS_MEDIA_KIT_DESCRIPTION,
  },
};

export default function PressMediaKitPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/press-media-kit",
            name: "Press & Media Kit — GOTT WALD Holding",
            description:
              "Structured entry point for media inquiries, official press materials, brand assets, and selected public information on GOTT WALD Holding LLC.",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Press & Media Kit", url: "/press-media-kit" },
          ]),
        ]}
      />
      <PressMediaKitClient />
    </>
  );
}
