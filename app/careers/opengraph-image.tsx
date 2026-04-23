import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "Careers at GOTT WALD Holding";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "CAREERS · GOTT WALD",
    title: "For operators, not applicants.",
    subtitle:
      "Roles across nine structural pillars. Trust, discipline, and delivery — treated as non-negotiable.",
  });
}
