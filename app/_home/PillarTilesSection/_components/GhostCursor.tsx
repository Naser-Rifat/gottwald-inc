"use client";

import type { Ref } from "react";

interface GhostCursorProps {
  /** Ref consumed by useFollowCursor for x/y tracking. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * "Learn More ↗" custom cursor bubble. Initial state is opacity:0 /
 * scale:0; PillarSlide animates it in via onMouseEnter on the link
 * overlay. Never receives pointer events — always layered above.
 */
export default function GhostCursor({ ref }: GhostCursorProps) {
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-white/10 backdrop-blur-md pointer-events-none z-[100] flex flex-col items-center justify-center opacity-0 scale-0"
    >
      <span className="text-xl leading-none font-light text-white mb-1">
        ↗
      </span>
      <span className="text-[9px] tracking-widest uppercase font-bold text-white">
        Learn More
      </span>
    </div>
  );
}
