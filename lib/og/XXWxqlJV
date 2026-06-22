import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared branded OG/Twitter image template.
 *
 * Renders a 1200×630 PNG with the GOTT WALD visual system:
 * - Deep near-black background with subtle radial glow
 * - Gold eyebrow label ("GOTT WALD HOLDING")
 * - Large Satoshi-Bold headline
 * - Light supporting subtitle
 * - URL footer
 *
 * Used by every per-route opengraph-image.tsx file.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const GOLD = "#D4AF37";
const GOLD_SOFT = "#C9A84C";
const BG = "#050505";
const TEXT_LIGHT = "#F5F5F5";
const TEXT_MUTED = "rgba(245,245,245,0.55)";

type BrandedOgInput = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
};

async function loadFont(file: string): Promise<Buffer> {
  return readFile(join(process.cwd(), "public", "fonts", file));
}

export async function brandedOgImage({
  eyebrow = "GOTT WALD HOLDING",
  title,
  subtitle,
  footer = "gottwald.world",
}: BrandedOgInput) {
  const [bold, medium, light] = await Promise.all([
    loadFont("Satoshi-Bold.ttf"),
    loadFont("Satoshi-Medium.ttf"),
    loadFont("Satoshi-Light.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(circle at 25% 20%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0) 55%), radial-gradient(circle at 80% 85%, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0) 60%)`,
          padding: "72px 88px",
          fontFamily: "Satoshi",
          color: TEXT_LIGHT,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(212,175,55,0.18)",
            margin: "40px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: GOLD,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                width: 44,
                height: 1,
                backgroundColor: GOLD_SOFT,
                display: "flex",
              }}
            />
            {eyebrow}
          </span>
          <span style={{ color: TEXT_MUTED, fontSize: 18 }}>
            Tbilisi · Georgia
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: "92%",
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 72 : 96,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: TEXT_LIGHT,
            }}
          >
            {title}
          </div>

          {subtitle ? (
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                fontWeight: 300,
                color: "rgba(245,245,245,0.78)",
                maxWidth: "86%",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: TEXT_MUTED,
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ color: GOLD_SOFT, fontWeight: 500 }}>{footer}</span>
          <span style={{ fontWeight: 300 }}>
            Standards-led · Operating-grade
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Satoshi", data: bold, weight: 700, style: "normal" },
        { name: "Satoshi", data: medium, weight: 500, style: "normal" },
        { name: "Satoshi", data: light, weight: 300, style: "normal" },
      ],
    },
  );
}
