"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { PILLARS } from "../_data/pillars";
import { usePauseAnimationsOffscreen } from "@/lib/usePauseAnimationsOffscreen";

interface RolesByPillarSectionProps {
  /** Index of the currently open pillar, or `null` if all collapsed. */
  openPillar: number | null;
  /** Setter — the section passes `null` when the same pillar is
   *  re-clicked (so a second click collapses it). */
  setOpenPillar: (i: number | null) => void;
}

/**
 * Sticky-title accordion of every pillar in the holding (A→I).
 *
 * Left rail holds an editorial title that sticks while the right column
 * scrolls; clicking a pillar row expands its glassmorphic body with the
 * full role list and the matching "Impact Profile" pull-quote.
 *
 * The open/close state is lifted into the parent so deep links could
 * target a specific pillar later without a structural change.
 */
export default function RolesByPillarSection({
  openPillar,
  setOpenPillar,
}: RolesByPillarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  usePauseAnimationsOffscreen(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="px-gutter py-[15vh] border-t border-white/5 bg-[#030508] relative overflow-hidden"
    >
      {/* Premium liquid aurora background (copper & silver) */}
      <div className="about-liquid-aurora absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[70vw] md:h-[70vw] max-w-[1200px] max-h-[1200px] rounded-full mix-blend-screen opacity-[0.05] blur-[120px] z-0 will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#c07840] via-[#b8c0cc] to-transparent rounded-full animate-[spin_18s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#b8c0cc] to-[#c07840] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-16 items-start">
        {/* Left Column: Title (sticky) */}
        <div className="reveal-text sticky top-[20vh]">
          <div className="inline-flex items-center gap-4 opacity-80 mb-8">
            <div className="w-8 h-[1px] bg-copper" />
            <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
              Architecture
            </span>
          </div>
          <h2
            className="font-black tracking-tighter uppercase flex flex-col relative isolate"
            style={{ fontSize: "clamp(4.5rem, 8vw, 8rem)" }}
          >
            <div className="relative z-[20] leading-[0.85] text-white opacity-95 drop-shadow-2xl">
              ROLES BY
            </div>
            <div
              className="relative z-[10] leading-[0.85] text-transparent -mt-2"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}
            >
              PILLAR
            </div>
          </h2>
          <p
            className="mt-8 text-white/60 font-light text-xl max-w-md"
            style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
          >
            We structure our ecosystem across five distinct pillars. Find where
            your expertise creates the most impact.
          </p>
        </div>

        {/* Right Column: Glassmorphic Accordion */}
        <div className="flex flex-col gap-4 stagger-group w-full max-w-[850px] ml-auto">
          {PILLARS.map((pillar, i) => {
            const isOpen = openPillar === i;
            return (
              <div
                key={pillar.letter}
                className={`stagger-item rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isOpen
                    ? "border-copper/40 bg-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    : "border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenPillar(isOpen ? null : i)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none group/btn relative"
                >
                  {/* Active left indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-copper transition-transform duration-500 origin-left ${
                      isOpen
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/btn:scale-x-100 group-hover/btn:bg-white/20"
                    }`}
                  />

                  <div className="flex items-center gap-6 md:gap-10 pr-4 flex-1">
                    <span
                      className={`text-2xl md:text-4xl font-light transition-colors duration-500 w-8 md:w-12 shrink-0 ${
                        isOpen
                          ? "text-copper"
                          : "text-white/20 group-hover/btn:text-white/60"
                      }`}
                    >
                      {pillar.letter}
                    </span>
                    <h3
                      className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 leading-tight ${
                        isOpen
                          ? "text-white"
                          : "text-white/70 group-hover/btn:text-white"
                      }`}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${
                      isOpen
                        ? "border-copper bg-copper text-black shadow-[0_0_15px_rgba(192,120,64,0.4)] -rotate-180"
                        : "border-white/10 text-white/50 group-hover/btn:border-white/30 group-hover/btn:text-white"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d={isOpen ? "M1 7h12" : "M7 1v12M1 7h12"} />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="p-6 pt-0 md:p-8 md:pt-0 flex flex-col md:flex-row gap-10 md:pl-[6.5rem]">
                        <div className="flex-1">
                          <h4 className="text-xs tracking-[0.2em] text-copper uppercase mb-5 font-bold">
                            Role Profiles
                          </h4>
                          <ul className="flex flex-col gap-4 font-light text-white/70">
                            {pillar.roles.map((role, idx) => (
                              <motion.li
                                key={role}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -10, opacity: 0 }}
                                transition={{
                                  delay: 0.05 + idx * 0.03,
                                  duration: 0.4,
                                }}
                                className="flex items-center gap-4"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-copper/50 shadow-[0_0_8px_rgba(192,120,64,0.6)] shrink-0" />
                                <span className="text-lg">{role}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="w-full md:w-[45%] p-6 md:p-8 bg-black/40 border border-white/5 rounded-xl h-fit relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 blur-[40px] rounded-full pointer-events-none" />
                          <h4 className="text-xs tracking-[0.2em] text-copper/80 uppercase mb-4 font-bold relative z-10">
                            Impact Profile
                          </h4>
                          <p
                            className="text-white/90 text-lg font-light leading-relaxed relative z-10"
                            style={{
                              fontFamily: "var(--font-playfair)",
                              fontStyle: "italic",
                            }}
                          >
                            &quot;{pillar.impact}&quot;
                          </p>
                        </motion.div>
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
