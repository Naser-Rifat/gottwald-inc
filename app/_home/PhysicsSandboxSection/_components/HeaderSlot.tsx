"use client";

import type { Ref } from "react";
import Header from "@/components/Header";

interface HeaderSlotProps {
  /** Ref consumed by useHeroEntrance to fade the header in. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Renders the global Header inside a fixed wrapper that starts at
 * opacity:0. The wrapper lives outside the perspective hero section so
 * its `position: fixed` is honored (perspective creates a containing
 * block that would otherwise trap it).
 */
export default function HeaderSlot({ ref }: HeaderSlotProps) {
  return (
    <div
      ref={ref}
      className="pointer-events-auto z-[100] w-full fixed top-0 left-0 px-gutter opacity-0"
    >
      <Header />
    </div>
  );
}
