"use client";

import { memo } from "react";

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        width="100%"
        height="100%"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
});

export default NoiseOverlay;
