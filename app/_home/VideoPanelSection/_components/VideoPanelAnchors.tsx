"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getDeviceTier } from "@/lib/deviceTier";
import { VIDEO_PANEL_POSTER, VIDEO_PANEL_SOURCES } from "@/lib/videoPanelShader";

/**
 * Two anchor `<div>`s that `lib/videoPanelShader.ts` queries by ID to
 * tween the WebGL video panel between its start ("pill") and end
 * ("full aspect-video") positions as the page scrolls.
 *
 * IDs MUST stay as `video-panel-start` / `video-panel-end-parent` /
 * `video-panel-end` — the WebGL code queries them directly.
 *
 * Progressive enhancement (3-tier fallback):
 *
 *   webgl       — Capable desktop device with WebGL. The empty `<div>`
 *                 is kept; the WebGL canvas mounted at the layout root
 *                 paints over it via the same anchor positioning math.
 *
 *   html-video  — Touchscreen laptop, iPad, or any non-mobile device
 *                 lacking WebGL. Native `<video muted autoplay loop
 *                 playsInline>` with the Cloudinary mp4 — universally
 *                 supported, no shader cost.
 *
 *   poster      — Save-Data flag, 2G connection, or sub-2GB RAM. A
 *                 single ~30KB JPEG of the video's first frame keeps
 *                 the brand identity intact without an 8MB download.
 *
 * SSR-safe: initial state is `webgl`, which renders nothing inside
 * the end anchor — matches the server-rendered output exactly. The
 * effect runs only after hydration, so the cascade of state updates
 * is invisible to the user (no flash, no layout shift, no mismatch).
 */
type Fallback = "webgl" | "html-video" | "poster";

interface ConnectionInfo {
  saveData?: boolean;
  effectiveType?: string;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function VideoPanelAnchors() {
  const [fallback, setFallback] = useState<Fallback>("webgl");

  useEffect(() => {
    const tier = getDeviceTier();
    if (tier === "desktop" && hasWebGL()) {
      setFallback("webgl");
      return;
    }

    // Mobile phones always get the poster. The Cloudinary mp4 is 3.6 MB
    // — Lighthouse mobile flagged it as the single largest network
    // request, and downloading it on 4G-throttled connections pushed
    // mobile LCP past 6 s. The poster is a ~85 KB JPEG that reads the
    // same visually. Non-mobile devices without WebGL (iPad, touch
    // laptops) keep the html-video path since they've got bandwidth
    // and CPU headroom to actually enjoy the reel.
    if (tier === "mobile") {
      setFallback("poster");
      return;
    }

    const conn = (navigator as Navigator & { connection?: ConnectionInfo })
      .connection;
    const mem = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;

    const tooConstrained =
      conn?.saveData === true ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "slow-2g" ||
      (typeof mem === "number" && mem < 2);

    setFallback(tooConstrained ? "poster" : "html-video");
  }, []);

  return (
    <>
      <div
        id="video-panel-start"
        className="w-full sm:w-3/4 md:w-1/2 aspect-video mt-[3vh] md:mt-[5vh]"
      />

      <div
        id="video-panel-end-parent"
        className="relative w-full mt-[8vh] md:mt-[10vh] mb-[3vh] md:mb-[5vh] aspect-video"
      >
        <div
          id="video-panel-end"
          className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl"
        >
          {fallback === "html-video" && (
            <video
              src={VIDEO_PANEL_SOURCES[1].src}
              poster={VIDEO_PANEL_POSTER}
              muted
              autoPlay
              playsInline
              loop
              preload="metadata"
              className="w-full h-full object-cover"
              aria-label="Gottwald brand reel"
            />
          )}
          {fallback === "poster" && (
            <Image
              src={VIDEO_PANEL_POSTER}
              alt="Gottwald brand reel"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
              className="object-cover"
            />
          )}
        </div>
      </div>
    </>
  );
}
