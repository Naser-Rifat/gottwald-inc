"use client";

import { memo } from "react";

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div
      suppressHydrationWarning
      className="pointer-events-none fixed inset-0 z-9999 opacity-[0.03] hidden md:block"
      style={{
        // Static SVG file — Chrome/WebKit mis-resolve `url(#filterId)`
        // references inside data-URI SVGs against the parent document,
        // spamming `GET /%23n 404` requests on every frame. A real file
        // path gives the SVG its own document URL so internal filter
        // references resolve correctly.
        backgroundImage: "url('/svg/noise-overlay.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
});

export default NoiseOverlay;

