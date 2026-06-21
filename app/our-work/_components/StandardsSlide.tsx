"use client";

import { useState } from "react";
import { coreStandards } from "../_data/coreStandards";

interface StandardsSlideProps {
  onMouseEnter: () => void;
}

export default function StandardsSlide({ onMouseEnter }: StandardsSlideProps) {
  const [activeStandard, setActiveStandard] = useState(0);

  return (
    <section
      id="slide-1"
      data-index="1"
      className="snap-section snap-always snap-center min-h-screen w-full relative flex flex-col justify-center px-6 md:px-[8vw] lg:px-[10vw] py-24 z-20 overflow-hidden"
      onMouseEnter={onMouseEnter}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto items-center justify-between gap-12 lg:gap-20">

        <div className="w-full lg:w-[55%] flex flex-col z-10">
          <div className="flex items-center gap-4 mb-10 md:mb-16">
            <div className="w-10 h-[1px] bg-[#d4af37]" />
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] font-semibold text-[#d4af37] font-mono drop-shadow-sm">04 PILLARS OF EXECUTION</p>
          </div>

          <div className="flex flex-col w-full" onMouseLeave={() => setActiveStandard(0)}>
            {coreStandards.map((std, idx) => (
              <div
                key={idx}
                className="flex flex-col border-b border-white/10 last:border-b-0 cursor-pointer group"
                onMouseEnter={() => setActiveStandard(idx)}
                onClick={() => setActiveStandard(idx)}
              >
                <div className="flex items-center gap-6 md:gap-10 py-6 md:py-8">
                  <span className={`font-mono text-[13px] md:text-[15px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 w-8 drop-shadow-sm ${activeStandard === idx ? "text-[#d4af37]" : "text-white/30 group-hover:text-[#d4af37]/70"}`}>
                    0{idx + 1}
                  </span>
                  <h3 className={`font-sans text-[clamp(1.8rem,4.5vw,5.5rem)] leading-none font-bold tracking-tight uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left drop-shadow-lg ${activeStandard === idx ? "text-white scale-100 opacity-100" : "text-white/20 scale-[0.98] opacity-60 group-hover:text-white/60"}`}>
                    {std.title}
                  </h3>
                </div>

                {/* Mobile/Tablet Inline Content (Accordion) */}
                <div 
                  className={`lg:hidden overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeStandard === idx ? "max-h-[800px] opacity-100 pb-8" : "max-h-0 opacity-0 pb-0"
                  }`}
                >
                  <div className="pl-[56px] md:pl-[72px] border-l-2 border-[#d4af37]/40 ml-4 md:ml-5">
                    <h4 className="text-white/95 text-[1.4rem] md:text-[1.8rem] font-playfair font-normal leading-[1.2] mb-4 drop-shadow-md">
                      {std.subtitle}
                    </h4>
                    <p className="text-white/85 text-[1rem] md:text-[1.1rem] leading-[1.7] font-sans font-normal max-w-lg whitespace-pre-line drop-shadow-sm">
                      {std.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-[45%] flex-col justify-center min-h-[400px] z-10 relative">
          {coreStandards.map((std, idx) => (
            <div
              key={idx}
              className={`absolute top-1/2 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeStandard === idx ? "opacity-100 -translate-y-1/2 translate-x-0 blur-none" : "opacity-0 -translate-y-[40%] -translate-x-8 blur-md pointer-events-none"}`}
            >
              <div className="pl-0 lg:pl-16 lg:border-l-2 border-[#d4af37]/40 relative">
                <span className="text-[#d4af37] font-playfair text-[150px] lg:text-[250px] leading-none absolute -top-16 lg:-top-24 -left-8 lg:-left-20 opacity-[0.03] select-none font-black italic transition-opacity duration-1000 delay-300">
                  0{idx + 1}
                </span>

                <h4 className="text-white/95 text-[clamp(1.8rem,2.5vw,3.5rem)] font-playfair font-normal leading-[1.1] mb-8 lg:mb-12 relative z-10 drop-shadow-md">
                  {std.subtitle}
                </h4>

                <p className="text-white/85 text-[clamp(1.1rem,1.3vw,1.5rem)] leading-[1.8] font-sans font-normal max-w-lg whitespace-pre-line relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {std.text}
                </p>

                {idx === 3 && (
                  <div className="mt-8 pt-8 border-t border-white/10 w-24 relative z-10" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
