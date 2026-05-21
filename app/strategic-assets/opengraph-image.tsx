import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Strategic Assets";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "ASSETS · GOTT WALD",
    title: "Structures of real value.",
    subtitle:
      "A curated portfolio of strategic structures, platforms, ventures, and real-world value frameworks.",
  });
}
