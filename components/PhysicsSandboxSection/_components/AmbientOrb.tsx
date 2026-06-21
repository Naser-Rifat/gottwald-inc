"use client";

import type { Ref } from "react";

interface AmbientOrbProps {
  /** Ref consumed by useHeroEntrance: scale-in entrance + ring loops. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Decorative orb — petrol/silver concentric rings with a turquoise
 * core glow and a gold center dot. Inner ring/glow classnames
 * (`.orb-ring-1`, `.orb-ring-2`, `.orb-glow`) are queried by
 * useHeroEntrance for infinite tweens.
 */
export default function AmbientOrb({ ref }: AmbientOrbProps) {
  return (
    <div
      ref={ref}
      className="hidden lg:flex w-32 h-32 relative items-center justify-center mix-blend-screen pointer-events-none mb-4 scale-0 opacity-0"
    >
      <div className="orb-ring-1 absolute inset-0 rounded-full border border-petrol/60" />
      <div className="orb-ring-2 absolute inset-3 rounded-full border border-silver/35" />
      <div className="orb-glow absolute inset-6 blur-xl rounded-full bg-turquoise/15" />
      <div
        className="w-1.5 h-1.5 rounded-full bg-gold"
        style={{
          boxShadow:
            "0 0 12px rgba(212,175,55,0.9), 0 0 30px rgba(18,168,172,0.4)",
        }}
      />
    </div>
  );
}
