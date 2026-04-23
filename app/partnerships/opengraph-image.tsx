import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Partnerships";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "PARTNERSHIPS · GOTT WALD",
    title: "Aligned operators. Verified delivery.",
    subtitle:
      "Structured intake for partners, operators, advisors, and strategic collaborators. NDA-protected by default.",
  });
}
