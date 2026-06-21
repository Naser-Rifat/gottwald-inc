"use client";

import type { Ref } from "react";

interface BackgroundWatermarkProps {
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Massive italic "alignment." floating behind the headline area —
 * the section's ghost echo. The ref is consumed by useMouseParallax.
 */
export default function BackgroundWatermark({ ref }: BackgroundWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[6%] -left-[6vw] z-0 select-none"
    >
      <span
        ref={ref}
        className="block italic font-light text-white/[0.03] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(11rem, 22vw, 26rem)",
        }}
      >
        alignment.
      </span>
    </div>
  );
}
