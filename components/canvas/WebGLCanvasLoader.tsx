"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getDeviceTier } from "@/lib/deviceTier";

// Home-scene WebGL (Three.js + HomeScene + ProjectTiles + VideoPanel) is a
// ~600 KB bundle that also spends 3–6 s on the mobile main thread booting
// the animation loop. That was the single largest contributor to mobile
// LCP (6.1 s → target < 2.5 s) and TBT (630 ms → target < 200 ms) in the
// Lighthouse mobile audit.
//
// Two-tier strategy:
//   • mobile — do not download or mount the scene at all. The design still
//     reads correctly against the CSS gradient set on <body>.
//   • desktop — mount on the next idle tick so the browser can paint the
//     hero H1 + copy first and pin LCP against that instead of racing the
//     canvas init.
const WebGLCanvas = dynamic(() => import("./WebGLCanvas"), {
  ssr: false,
});

export default function WebGLCanvasLoader() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (getDeviceTier() === "mobile") return;

    // requestIdleCallback isn't in Safari, hence the setTimeout fallback.
    const raf =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(cb as unknown as () => void, 200) as unknown as number);
    const cancel =
      window.cancelIdleCallback ??
      ((id: number) => window.clearTimeout(id));

    const id = raf(() => setShouldMount(true));
    return () => cancel(id as number);
  }, []);

  if (!shouldMount) return null;
  return <WebGLCanvas />;
}
