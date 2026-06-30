"use client";

import { type Ref } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { PARTNERSHIP_DOMAINS } from "@/lib/partnershipData";

import ScrambleText from "./ScrambleText";

interface DomainsAccordionSectionProps {
  /** Currently open domain id, or `null` if all collapsed. */
  activeAccordion: string | null;
  /** Setter — clicking the same domain closes it (the section passes
   *  `null` in that case). */
  setActiveAccordion: (id: string | null) => void;
  /** Wrapper ref the parent attaches for future scroll-trigger anchoring;
   *  not currently used directly but kept to preserve the original
   *  component's API. */
  wrapperRef?: Ref<HTMLDivElement>;
}

/**
 * "Partnership Domains" accordion — the architectural drill-down.
 *
 * Left rail: sticky title block with a rotating ring + a glyph that
 * cross-fades to the active domain's id when the accordion opens.
 * Right column: full accordion list. Each row uses `<ScrambleText/>`
 * for a cyberpunk-style title decode animation when the row opens.
 */
export default function DomainsAccordionSection({
  activeAccordion,
  setActiveAccordion,
  wrapperRef,
}: DomainsAccordionSectionProps) {
  return (
    <section className="px-gutter py-[20vh] bg-[#030406] relative z-10 border-t border-white/5 overflow-hidden">
      <div
        className="absolute left-[-15%] top-1/3 -translate-y-1/2 w-[70vw] max-w-[1200px] aspect-square pointer-events-none hidden lg:block opacity-[0.35] mix-blend-screen grayscale-[20%]"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 10%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 10%, transparent 65%)",
        }}
      >
        <Image
          src="/images/partnership_domains_bg.png"
          alt="Brutalist Gold Veins"
          fill
          sizes="(max-width: 1023px) 1px, 70vw"
          quality={50}
          loading="lazy"
          className="object-cover object-center"
        />
      </div>

      {/* Subtle cyber grid background */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">
        {/* Left: sticky data core */}
        <div className="lg:w-2/5 reveal-up relative">
          <div className="sticky top-[15vh]">
            <p className="text-sm tracking-[0.4em] uppercase text-gold/80 font-bold mb-6">
              Core Architecture
            </p>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-white">
              PARTNERSHIP
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-white/50">
                DOMAINS
              </span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed font-light mb-12 max-w-sm">
              Full transparency across all our operating pillars. We integrate
              partners natively into our architecture.
            </p>

            {/* Massive interactive indicator */}
            <div className="hidden lg:flex relative w-64 h-64 border border-white/10 rounded-full items-center justify-center bg-[#050505]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border border-dashed border-turquoise/30"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAccordion || "none"}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="text-[8rem] font-mono font-black text-white/5 tracking-tighter drop-shadow-[0_0_30px_rgba(18,168,172,0.4)]"
                >
                  {activeAccordion ? activeAccordion : "X"}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: accordion list */}
        <div className="lg:w-3/5 flex flex-col" ref={wrapperRef}>
          {PARTNERSHIP_DOMAINS.map((domain) => {
            const isActive = activeAccordion === domain.id;
            const isAnotherActive = activeAccordion && !isActive;

            return (
              <div
                key={domain.id}
                className={`accordion-item border-b border-white/10 group relative transition-opacity duration-700 ${isAnotherActive ? "opacity-30 hover:opacity-100" : "opacity-100"}`}
              >
                {/* Hover laser line */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-700 ease-out pointer-events-none" />

                <button
                  onClick={() =>
                    setActiveAccordion(isActive ? null : domain.id)
                  }
                  className="w-full py-10 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-6 lg:gap-8 relative overflow-hidden group/title">
                    <span
                      className={`text-lg font-mono transition-all duration-500 ${isActive ? "text-turquoise scale-125 drop-shadow-[0_0_15px_rgba(18,168,172,0.6)]" : "text-white/30 group-hover/title:text-gold"}`}
                    >
                      <ScrambleText text={domain.id} isActive={isActive} />
                    </span>
                    <h3
                      className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter transition-transform duration-500 ${isActive ? "translate-x-6 text-white" : "text-white/60 group-hover/title:translate-x-4 group-hover/title:text-white"}`}
                    >
                      <ScrambleText text={domain.title} isActive={isActive} />
                    </h3>
                  </div>
                  <div
                    className={`w-12 h-12 border flex items-center justify-center shrink-0 rounded-full transition-all duration-500 ${isActive ? "border-turquoise bg-turquoise text-black shadow-[0_0_20px_rgba(18,168,172,0.6)] -rotate-180 scale-110" : "border-white/10 text-white/50 group-hover:border-gold/60 group-hover:text-gold"}`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d={isActive ? "M1 7h12" : "M7 1v12M1 7h12"} />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden relative"
                    >
                      {/* Cyber scanner line */}
                      <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute left-0 w-full h-[1px] bg-turquoise shadow-[0_0_15px_3px_rgba(18,168,172,0.8)] z-20 pointer-events-none"
                      />

                      <div className="pb-12 pl-14 relative z-10 bg-[#050505]/50 border-l border-white/5 ml-4 mt-4">
                        <ul className="flex flex-col gap-6 pt-6 pr-6">
                          {domain.items.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -20, opacity: 0 }}
                              transition={{
                                delay: 0.1 + idx * 0.05,
                                duration: 0.5,
                                ease: "easeOut",
                              }}
                              className="text-lg lg:text-xl text-white/70 flex items-start gap-5"
                            >
                              <span className="text-turquoise mt-3 leading-none shrink-0 w-2 h-2 rounded-full bg-turquoise shadow-[0_0_10px_rgba(18,168,172,0.8)]" />
                              <span className="leading-relaxed tracking-wide font-light">
                                <ScrambleText text={item} isActive={isActive} />
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
