import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Imprint";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "IMPRINT · GOTT WALD",
    title: "Legal disclosure.",
    subtitle:
      "Statutory imprint for GOTT WALD Holding LLC — registered entity, contact, and editorial responsibility.",
  });
}
