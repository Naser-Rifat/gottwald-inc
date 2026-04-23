import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "Contact GOTT WALD Holding";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "CONTACT · GOTT WALD",
    title: "Strategic inquiries welcome.",
    subtitle:
      "Direct line for partnership requests, engagements, and serious conversations. Tbilisi, Georgia.",
  });
}
