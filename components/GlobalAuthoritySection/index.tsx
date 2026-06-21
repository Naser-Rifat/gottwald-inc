"use client";

import { useRef } from "react";

import { useEntranceReveal } from "./_hooks/useEntranceReveal";
import { usePingPauseObserver } from "./_hooks/usePingPauseObserver";

import SectionHeader from "./_components/SectionHeader";
import WorldMapBase from "./_components/WorldMapBase";
import MapHud from "./_components/MapHud";
import MetricsGrid from "./_components/MetricsGrid";

/**
 * GlobalAuthoritySection — the "proof" beat of the home narrative.
 * Three-layer composition: editorial title block, a world-map HUD with
 * annotated nodes (Tbilisi head office + DACH hubs), and a bottom
 * metrics row (coverage / partners / network / language).
 */
export default function GlobalAuthoritySection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEntranceReveal({ containerRef, textRef, hudRef, metricsRef });
  usePingPauseObserver(containerRef);

  return (
    <section
      ref={containerRef}
      data-journey="proof"
      className="relative w-full bg-transparent overflow-hidden flex flex-col pt-[5vh] md:pt-[6vh] pb-8 lg:pb-12 px-gutter min-h-screen"
    >
      {/* Gradient overlay keeps map contrast while preserving the
          underlying liquid canvas. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020b14]/80 via-transparent to-[#020b14]/80 pointer-events-none z-0" />

      <SectionHeader ref={textRef} />

      <div className="relative w-full mt-24 md:mt-[-5%] mb-[-8%] md:mb-[-5%]">
        <WorldMapBase />
        <MapHud ref={hudRef} />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-[-8%] lg:mt-[-18%]">
        <div className="w-full flex flex-col lg:flex-row justify-between items-end gap-12 pointer-events-auto relative z-30">
          <div className="flex items-center gap-3 order-2 lg:order-1 lg:mb-[4vh] pt-8 lg:pt-0 w-full lg:w-max">
            <span className="w-10 h-[1px] bg-white/50 block" />
            <p className="text-white/70 text-[14px] lg:text-[18px] font-sans tracking-wide drop-shadow-md font-light">
              Data architecture actively plotting. Centralized in Tbilisi.
            </p>
          </div>

          <MetricsGrid ref={metricsRef} />
        </div>
      </div>
    </section>
  );
}
