import { getPillar } from "@/lib/api/pillars";
import { brandedOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/brandedOgImage";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = { params: Promise<{ slug: string }> };

export async function generateImageMetadata({ params }: Props) {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  const alt = pillar
    ? `${pillar.title} — GOTT WALD Pillar`
    : "GOTT WALD Pillar";
  return [{ id: "default", alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE }];
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const pillar = await getPillar(slug);

  const title = pillar?.title ?? "GOTT WALD Pillar";
  const subtitle =
    pillar?.description?.trim() ??
    "Structural pillar of the GOTT WALD operating architecture.";

  return brandedOgImage({
    eyebrow: "PILLAR · GOTT WALD",
    title,
    subtitle,
  });
}
