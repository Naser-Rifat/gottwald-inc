"use client";

import type { Ref } from "react";

interface LiquidAuroraProps {
  ref?: Ref<HTMLDivElement>;
}

/** Spinning gradient blob behind the editorial column. */
export default function LiquidAurora({ ref }: LiquidAuroraProps) {
  return (
    <div
      ref={ref}
      className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen pointer-events-none opacity-[0.15] blur-[100px] z-0 will-change-transform"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gold to-petrol rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
    </div>
  );
}
