import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const alt = "GOTT WALD Holding — Protocols";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "PROTOCOLS · GOTT WALD",
    title: "Values first. Always.",
    subtitle:
      "Trust, information, and access — handled with discretion. The operating standards of GOTT WALD Holding LLC.",
  });
}
