import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "About GOTT WALD Holding";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "ABOUT · GOTT WALD HOLDING",
    title: "One standard. One language of delivery.",
    subtitle:
      "A unified architecture — modular components designed to stand alone and engineered to connect.",
  });
}
