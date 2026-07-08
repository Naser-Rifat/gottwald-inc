"use client";

import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface CursorGlowProps {
  expanded: boolean;
}

const CursorGlow = forwardRef<HTMLDivElement, CursorGlowProps>(function CursorGlow(
  { expanded },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 pointer-events-none z-[100] flex flex-col items-center justify-center transition-[width,height,background-color,border-color,border-radius,opacity] duration-300 ease-out backdrop-blur-md overflow-hidden ${
        expanded
          ? "w-[130px] h-[130px] rounded-full border border-white/30 bg-black/50 mix-blend-normal shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          : "w-3 h-3 rounded-full bg-white/60 mix-blend-screen border border-white/30"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ArrowUpRight className="w-8 h-8 mb-2 opacity-90" />
        <span className="text-[11px] uppercase tracking-[0.15em] font-medium font-sans whitespace-nowrap">Learn More</span>
      </div>
    </div>
  );
});

export default CursorGlow;
