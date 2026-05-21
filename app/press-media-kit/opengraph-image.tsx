import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Press & Media Kit";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "PRESS · GOTT WALD",
    title: "On record. On brand.",
    subtitle:
      "A structured point of access for media inquiries, official materials, and selected brand information.",
  });
}
