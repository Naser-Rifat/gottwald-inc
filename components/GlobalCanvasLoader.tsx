"use client";

import dynamic from "next/dynamic";

// Lazy-load the Three.js/R3F fluid shader so it's not in the initial JS bundle.
// ssr:false skips server-side rendering (the canvas can't run on Node anyway).
// Visual behavior is unchanged — the canvas mounts ~200ms later than before,
// imperceptible to the user but lifts LCP/TBT significantly.
const GlobalCanvas = dynamic(() => import("./GlobalCanvas"), {
  ssr: false,
});

export default function GlobalCanvasLoader() {
  return <GlobalCanvas />;
}
