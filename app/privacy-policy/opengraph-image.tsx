import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Privacy Policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "PRIVACY · GOTT WALD",
    title: "Privacy by design.",
    subtitle:
      "How GOTT WALD Holding handles data — cookieless by default, GDPR-clean, transparent on consent.",
  });
}
