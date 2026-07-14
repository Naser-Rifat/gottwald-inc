"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getDeviceTier } from "@/lib/deviceTier";

// Lazy-load the Three.js/R3F fluid shader so it's not in the initial JS bundle.
// ssr:false skips server-side rendering (the canvas can't run on Node anyway).
//
// Perf-tiered mount:
//   • mobile   — skip the shader entirely. Even the "cheap" mobile shader in
//     GlobalCanvas.tsx (24fps + reduced DPR) costs ~200 ms of main-thread
//     time on a 4× CPU throttle, which was pushing mobile TBT past 600 ms.
//     The design still reads against the CSS gradient set on <body>.
//   • desktop  — mount on the next idle tick. Same visual result as before
//     (canvas fades in ~200 ms later), but the browser gets to paint hero
//     H1 + copy first so LCP pins against those instead of racing the WebGL
//     boot.
const GlobalCanvas = dynamic(() => import("./GlobalCanvas"), {
  ssr: false,
});

export default function GlobalCanvasLoader() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (getDeviceTier() === "mobile") return;

    const raf =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(cb as unknown as () => void, 200) as unknown as number);
    const cancel =
      window.cancelIdleCallback ??
      ((id: number) => window.clearTimeout(id));

    const id = raf(() => setShouldMount(true));
    return () => cancel(id as number);
  }, []);

  if (!shouldMount) return null;
  return <GlobalCanvas />;
}
