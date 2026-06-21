"use client";

import type { Ref } from "react";

interface MapHudProps {
  /** Wrapper ref consumed by useEntranceReveal for child stagger. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * HUD overlay that sits on top of the world map: two annotated nodes
 * (Tbilisi head office + DACH strategic hubs), two micro-node dots
 * (Vienna / Zurich), and six ambient footprint dots.
 */
export default function MapHud({ ref }: MapHudProps) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full z-10 pointer-events-auto flex items-center justify-center"
    >
      <div className="relative w-full sm:w-[130%] md:w-[120%] lg:w-[90%] max-w-[1600px] h-full">
        {/* 1. Tbilisi Control Node */}
        <div className="absolute top-[29.3%] left-[58.8%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20">
          <div className="w-2 h-2 rounded-full bg-[#cda434] shadow-[0_0_15px_rgba(205,164,52,1)] z-10 relative">
            <div
              className="absolute inset-0 rounded-full bg-[#cda434] animate-ping opacity-40"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <div className="absolute top-1/2 left-full items-center -translate-y-1/2 flex items-center pointer-events-none z-10 w-max">
            <div className="w-6 md:w-12 lg:w-20 h-[1px] bg-gradient-to-r from-[#cda434]/60 to-transparent" />

            <div className="flex flex-col items-start relative -ml-2">
              <div className="absolute inset-0 bg-[#020b14]/90 blur-2xl rounded-[100px] -z-10 scale-[1.3]" />
              <p className="text-[#cda434] tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-bold whitespace-nowrap mb-1">
                01 — HEAD OFFICE
              </p>
              <p className="text-white font-sans text-xl md:text-2xl lg:text-3xl tracking-wide whitespace-nowrap font-light drop-shadow-md">
                Tbilisi, Georgia
              </p>
            </div>
          </div>
        </div>

        {/* 2. DACH Strategic Hubs (Munich-anchored) */}
        <div className="absolute top-[25.5%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20">
          <div className="absolute bottom-full mb-2 w-[1px] h-6 md:h-12 lg:h-16 bg-gradient-to-t from-turquoise/60 via-turquoise/20 to-transparent" />

          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-10 relative">
            <div
              className="absolute inset-0 rounded-full bg-white animate-ping opacity-40"
              style={{ animationDuration: "4s" }}
            />
          </div>

          <div className="absolute bottom-full mb-8 md:mb-12 lg:mb-16 flex flex-col items-center pointer-events-none z-10 w-max">
            <div className="flex flex-col items-center relative">
              <div className="absolute inset-0 bg-[#020b14]/90 blur-2xl rounded-[100px] -z-10 scale-[1.3]" />
              <p className="text-white/80 tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-bold whitespace-nowrap mb-1">
                02 — STRATEGIC HUBS
              </p>
              <p className="text-turquoise font-sans font-medium text-2xl md:text-3xl lg:text-4xl tracking-wide whitespace-nowrap mb-1 md:mb-2 drop-shadow-md">
                DACH Region
              </p>
              <p className="text-white/90 tracking-[0.3em] uppercase text-[7px] md:text-[10px] font-bold whitespace-nowrap flex items-center gap-3">
                GERMANY / AUSTRIA / SWITZERLAND
              </p>
            </div>
          </div>
        </div>

        {/* Vienna & Zurich micro-nodes */}
        <div className="absolute top-[26.3%] left-[51.1%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/80 z-10 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-[26.8%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/80 z-10 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />

        {/* Ambient footprints */}
        <div className="absolute top-[38%] left-[23%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
        <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
        <div className="absolute top-[45%] left-[65%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
        <div className="absolute top-[30%] left-[75%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
        <div className="absolute top-[65%] left-[30%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
        <div className="absolute top-[75%] left-[80%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
      </div>
    </div>
  );
}
