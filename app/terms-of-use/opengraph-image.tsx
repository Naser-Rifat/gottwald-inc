import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Terms of Use";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "TERMS · GOTT WALD",
    title: "Terms of use.",
    subtitle:
      "The rules of engagement for visitors, prospective partners, and users of GOTT WALD Holding services.",
  });
}
