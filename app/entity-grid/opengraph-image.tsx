import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Entity Grid";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "STRUCTURE · GOTT WALD",
    title: "Built as a grid, not a tree.",
    subtitle:
      "A structured overview of the holding's operational entities, platforms, and strategic ventures.",
  });
}
