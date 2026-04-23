import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD — All Pillars";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "PILLARS · GOTT WALD",
    title: "Nine structural pillars. One architecture.",
    subtitle:
      "IT Solutions 2030 · SolutionFinder · Consulting · Coaching · Marketing · Relocation · YIG.CARE · PLHH Coin.",
  });
}
