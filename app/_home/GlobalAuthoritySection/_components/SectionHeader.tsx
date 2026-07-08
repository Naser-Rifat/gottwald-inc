"use client";

import type { Ref } from "react";

interface SectionHeaderProps {
  /** Wrapper ref consumed by useEntranceReveal for child stagger. */
  ref?: Ref<HTMLDivElement>;
}

export default function SectionHeader({ ref }: SectionHeaderProps) {
  return (
    <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-16 lg:mt-24">
      <div
        ref={ref}
        className="w-full xl:w-[50%] pr-4 md:pr-12 lg:pr-24 flex flex-col gap-8 pointer-events-auto drop-shadow-lg relative z-30"
      >
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse shadow-[0_0_10px_rgba(18,168,172,0.7)]" />
            <span className="text-[9px] sm:text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-turquoise uppercase font-bold">
              Node 001. Worldwide Execution.
            </span>
          </div>
          <h2 className="text-[clamp(2rem,7.5vw,10rem)] font-bold text-white tracking-[-0.04em] leading-[0.85] uppercase">
            GLOBAL
            <br />
            <span className="text-silver bg-clip-text">AUTHORITY.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-2 pl-6 ml-2 max-w-[80vw] border-l-2 border-petrol/60 mt-8">
          <p className="text-[clamp(1.2rem,2.2vw,3rem)] text-white leading-tight font-light tracking-tight">
            One system. One standard.
          </p>
          <p className="text-[clamp(0.9rem,1.2vw,1.35rem)] font-mono uppercase tracking-[0.18em] opacity-90 text-turquoise/85">
            Outcomes that hold.
          </p>
        </div>
      </div>
    </div>
  );
}
