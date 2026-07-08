"use client";

import { useState } from "react";

import { PARTNERSHIP_ARCHETYPES } from "@/lib/partnershipData";

import ArchetypeCard from "./ArchetypeCard";

/**
 * Two-row bento layout for the 5 partnership archetypes:
 *   - Top row: cards 1-2 (the first card has a slightly larger default
 *     flex weight so it visually anchors the grid).
 *   - Bottom row: cards 3-5 (equal weights).
 *
 * `hoveredIndex` drives a focus/blur effect: the hovered card scales
 * up via `flexValue` while siblings shrink. Spring physics on
 * `ArchetypeCard.layout` makes the rebalancing fluid.
 */
export default function ArchetypeBentoGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isAnyHovered = hoveredIndex !== null;

  return (
    <div className="flex flex-col gap-4 mt-12 w-full group/bento">
      <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[380px] lg:h-[440px]">
        {PARTNERSHIP_ARCHETYPES.slice(0, 2).map((arch, localIndex) => {
          const i = localIndex;
          const isHovered = hoveredIndex === i;
          const defaultFlex = i === 0 ? 1.4 : 1;
          const flexValue = isHovered
            ? defaultFlex * 1.5
            : isAnyHovered
              ? defaultFlex * 0.8
              : defaultFlex;
          return (
            <ArchetypeCard
              key={i}
              arch={arch}
              index={i}
              flexValue={flexValue}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[320px] lg:h-[360px]">
        {PARTNERSHIP_ARCHETYPES.slice(2, 5).map((arch, localIndex) => {
          const i = localIndex + 2;
          const isHovered = hoveredIndex === i;
          const flexValue = isHovered ? 1.5 : isAnyHovered ? 0.8 : 1;
          return (
            <ArchetypeCard
              key={i}
              arch={arch}
              index={i}
              flexValue={flexValue}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
