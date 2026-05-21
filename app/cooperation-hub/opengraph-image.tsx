import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Cooperation Hub";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "COOPERATION · GOTT WALD",
    title: "Aligned by intent.",
    subtitle:
      "A dedicated point of entry for partners, operators, advisors, investors, and strategic collaborators.",
  });
}
