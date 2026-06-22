"use client";

import dynamic from "next/dynamic";

// Lazy-load the home WebGL scene (HomeScene + ProjectTiles + VideoPanel) so
// the ~600KB Three.js bundle isn't in the initial JS chunk for the home page.
// The LoadingOverlay covers the screen until HomeScene's LoadingGroup is ready,
// so deferring the canvas mount is visually identical to the user.
const WebGLCanvas = dynamic(() => import("./WebGLCanvas"), {
  ssr: false,
});

export default function WebGLCanvasLoader() {
  return <WebGLCanvas />;
}
