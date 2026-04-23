import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Standards-led holding & operations";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    title: "Turning complexity into clarity.",
    subtitle:
      "A standards-led holding company. Operating-grade systems for people and strategic assets.",
  });
}
