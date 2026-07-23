"use client";

import dynamic from "next/dynamic";

import type { Pillar } from "@/lib/types/pillars";

// Thin client wrapper whose only job is to `dynamic()`-import
// PillarTilesSection. PillarTilesSection statically imports gsap
// (~40 KB) plus a few custom scroll hooks; without this boundary the
// section's client JS is bundled into the initial route chunk even on
// mobile, where the section sits well below the fold.
//
// SSR is kept on (default) so the section's markup still streams in
// the initial HTML for SEO — only the hydration + gsap parse cost is
// deferred until the client actually reaches it.
const PillarTilesSection = dynamic(() => import("./PillarTilesSection"));

export default function PillarTilesSectionLazy({
  pillars,
}: {
  pillars: Pillar[];
}) {
  return <PillarTilesSection pillars={pillars} />;
}
