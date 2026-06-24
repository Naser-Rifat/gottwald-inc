"use client";

import { useRef } from "react";

import ShiftCanvas from "./ShiftCanvas";

import { PROOF_PHASES } from "../_data/proofPhases";
import { SHIFTS, SHIFT_ROMANS } from "../_data/shifts";
import { usePauseAnimationsOffscreen } from "@/lib/usePauseAnimationsOffscreen";

interface OutcomesSectionProps {
  /** Index of the currently active proof phase (0..2). */
  activeProofPhase: number;
  /** Setter passed down so the timeline buttons can drive the state
   *  that controls the description cross-fade. */
  setActiveProofPhase: (i: number) => void;
  /** Index of the currently active "shift" (0..4) driven by the parent
   *  ScrollTrigger observer reading `.shift-article` enter events. */
  activeShiftIndex: number;
}

/**
 * OUTCOMES & TIME TO VALUE — composite section.
 *
 * Two sub-blocks live here because they share the same editorial frame
 * ("Proof" header → diagnostic) and would feel disconnected if split:
 *
 *   1. **Days-to-feel-it timeline** — 3 phases as Playfair numerals
 *      connected by an animated turquoise line; clicking/hovering a
 *      station drives the cross-faded description. Local UI state.
 *   2. **"What shifts" sequence** — five sticky readings; the sticky
 *      ShiftCanvas on the left renders the active shift's image while
 *      the parent's ScrollTrigger walks the `.shift-article` list and
 *      updates `activeShiftIndex` accordingly.
 */
export default function OutcomesSection({
  activeProofPhase,
  setActiveProofPhase,
  activeShiftIndex,
}: OutcomesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Pause the spinning aurora blob behind this section when scrolled
  // off-screen — see the hook for the rationale (large blurred
  // composite layers are expensive even when not in view).
  usePauseAnimationsOffscreen(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-journey="proof"
      className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14] border-y border-white/[0.04]"
    >
      {/* Atmospheric depth — premium liquid aurora layer + grain + corner tick. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="about-liquid-aurora absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.28] blur-[120px] z-0 will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-copper to-petrol rounded-full animate-[spin_20s_linear_infinite_reverse] mix-blend-overlay" />
        </div>

        <div className="absolute inset-0 proof-grain opacity-[0.22]" />
        <div className="absolute top-8 right-[5vw] hidden md:flex items-center gap-3 text-[9px] font-mono tracking-[0.4em] uppercase text-white/25">
          <span>03 · Proof</span>
          <span className="w-8 h-px bg-white/15" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* PROOF header */}
        <div className="reveal-text mb-24 lg:mb-32">
          <div className="flex items-center gap-6 mb-10 md:mb-12">
            <span className="w-12 h-px bg-gold/40" />
            <p className="text-[10px] tracking-[0.32em] uppercase text-gold/80 font-bold">
              Proof
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <h3
                className="text-white font-light leading-[0.96] tracking-[-0.038em]"
                style={{
                  fontSize:
                    "calc(clamp(2.6rem, 5.2vw, 5.8rem) * var(--heading-scale))",
                }}
              >
                Quietly.
                <span className="block italic text-white/55 font-light">
                  Methodically.
                </span>
              </h3>
            </div>
            <div className="lg:col-span-4 lg:pl-10 lg:border-l border-white/[0.08] pb-2">
              <p className="text-[clamp(1rem,1.2vw,1.2rem)] font-light text-white/60 leading-[1.6] max-w-md">
                Outcomes — not loudness. Numbers when they measure something
                real.
              </p>
            </div>
          </div>
        </div>

        {/* OPERATING TIMELINE — horizontal scroll-driven journey */}
        <div className="reveal-text mb-[12vh] lg:mb-[14vh]">
          <div className="flex items-center gap-6 mb-16 md:mb-20">
            <span className="w-12 h-px bg-petrol/70" />
            <p className="text-[10px] tracking-[0.36em] uppercase text-petrol font-light">
              Days to feel it
            </p>
          </div>

          <div className="relative">
            {/* Resonance signature — drifting waveform above the numerals. */}
            <svg
              aria-hidden="true"
              className="absolute -top-14 md:-top-20 left-0 right-0 w-full h-12 md:h-16 pointer-events-none proof-signal-glow"
              viewBox="0 0 1400 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0,30 Q116,8 233,30 T466,30 T700,30 T933,30 T1166,30 T1400,30"
                stroke="rgba(18,168,172,0.7)"
                strokeWidth="0.9"
                fill="none"
                className="proof-signal"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0,30 Q116,8 233,30 T466,30 T700,30 T933,30 T1166,30 T1400,30"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Three stations — massive numerals as visual anchors */}
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {PROOF_PHASES.map((phase, idx) => {
                const isActive = activeProofPhase === idx;
                const isPast = activeProofPhase >= idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-pressed={isActive}

                    onClick={() => setActiveProofPhase(idx)}
                    onMouseEnter={() => setActiveProofPhase(idx)}
                    onFocus={() => setActiveProofPhase(idx)}
                    className="group flex flex-col items-start text-left pb-8 md:pb-12 outline-none focus-visible:outline-1 focus-visible:outline-turquoise/50 focus-visible:outline-offset-8 cursor-pointer"
                  >
                    <span
                      className={`block font-light leading-[0.78] tracking-[-0.05em] mb-5 md:mb-7 transition-colors duration-1000 whitespace-nowrap ${
                        isActive
                          ? "text-white"
                          : isPast
                            ? "text-white/45"
                            : "text-white/15"
                      }`}
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
                      }}
                    >
                      {phase.days}
                    </span>
                    <span
                      className={`text-[10px] font-mono tracking-[0.36em] uppercase transition-colors duration-700 ${
                        isActive ? "text-turquoise" : "text-white/30"
                      }`}
                    >
                      {phase.title}
                    </span>
                    <span
                      className={`mt-2 text-[11px] md:text-[12px] italic font-light leading-[1.3] transition-colors duration-700 ${
                        isActive ? "text-white/55" : "text-white/22"
                      }`}
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {phase.descriptor}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Connector line passing through node centers (16.67% / 50% / 83.33%). */}
            <div className="relative h-px">
              <div className="absolute top-0 left-[16.67%] right-[16.67%] h-px bg-white/[0.10]" />
              <div
                className="absolute top-0 left-[16.67%] h-px bg-turquoise origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: "66.67%",
                  transform: `scaleX(${activeProofPhase / 2})`,
                }}
              />
              {[16.67, 50, 83.33].map((pos, idx) => {
                const isActive = activeProofPhase === idx;
                const isPast = activeProofPhase >= idx;
                return (
                  <span
                    key={idx}
                    aria-hidden="true"
                    className={`absolute top-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border transition-all duration-700 ${
                      isPast
                        ? "bg-turquoise border-turquoise"
                        : "bg-[#070c14] border-white/25"
                    } ${
                      isActive
                        ? "scale-125 shadow-[0_0_22px_rgba(18,168,172,0.55)]"
                        : "scale-100"
                    }`}
                    style={{ left: `${pos}%` }}
                  />
                );
              })}
            </div>

            {/* Active phase description — cross-fades between phases. */}
            <div className="relative mt-14 md:mt-20 h-32 md:h-28">
              {PROOF_PHASES.map((phase, idx) => {
                const isActive = activeProofPhase === idx;
                return (
                  <p
                    key={idx}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 text-[clamp(1.1rem,1.4vw,1.4rem)] font-light leading-[1.55] max-w-2xl text-white/80 transition-all duration-700 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    {phase.desc}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Outcomes — performative editorial readings of the "shifts". */}
        <div className="reveal-text relative">
          <div className="flex items-center gap-6 mb-16 md:mb-24">
            <span className="w-12 h-px bg-gold/40" />
            <p className="text-xs tracking-[0.3em] uppercase text-gold/80 font-bold">
              What shifts
            </p>
          </div>

          {/* Architectural anchor — colossal italic "shifts." floats
              behind the column. <4% opacity reads as ghost material. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[14%] right-[-6vw] z-0 select-none about-shifts-watermark"
          >
            <span
              className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(11rem, 22vw, 26rem)",
              }}
            >
              shifts.
            </span>
          </div>

          <div className="relative z-10 max-w-[1400px] grid lg:grid-cols-12 gap-8 lg:gap-20">
            {/* Left Sticky Image Column */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="sticky top-[15vh] w-[80%] mx-auto aspect-square flex items-center justify-center pointer-events-none">
                <ShiftCanvas activeIndex={activeShiftIndex} />
              </div>
            </div>

            {/* Right Scrolling List */}
            <div className="lg:col-span-7 pb-[15vh]">
              {SHIFTS.map((item, idx) => {
                const isActive = activeShiftIndex === idx;
                return (
                  <article
                    key={idx}
                    data-shift-index={idx}
                    className={`shift-article group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start py-16 lg:py-24 border-t border-white/[0.08] transition-all duration-700 cursor-default ${
                      isActive ? "opacity-100" : "opacity-30 hover:opacity-50"
                    }`}
                  >
                    {/* Interactive sliding line indicator */}
                    <div
                      className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-turquoise/40 to-transparent transition-transform duration-1000 origin-left"
                      style={{
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />

                    {/* Marginalia */}
                    <div
                      className={`lg:col-span-1 pt-2 lg:pt-[0.6em] transition-transform duration-700 ${isActive ? "translate-x-2" : "translate-x-0"}`}
                    >
                      <span
                        className={`block italic text-lg transition-colors duration-500 leading-none ${isActive ? "text-turquoise" : "text-white/30"}`}
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {SHIFT_ROMANS[idx]}.
                      </span>
                    </div>

                    {/* Statement */}
                    <div
                      className={`lg:col-span-11 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "translate-x-4" : "translate-x-0"}`}
                    >
                      <h4 className="font-light text-white mb-6">
                        <span
                          className={`block text-3xl lg:text-[2.5rem] leading-[1.1] tracking-[-0.02em] transition-colors duration-500 ${isActive ? "text-white" : "text-white/60"}`}
                        >
                          {item.subject}
                        </span>
                        <span
                          className={`block italic text-5xl lg:text-[4.5rem] leading-[1.0] tracking-[-0.035em] mt-3 lg:mt-4 transition-colors duration-500 ${isActive ? "text-turquoise" : "text-white/40"}`}
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {item.verb}
                        </span>
                      </h4>

                      <div className="max-w-md pt-4">
                        <p className="text-lg lg:text-xl font-light leading-[1.6] text-white/50 transition-colors duration-500 group-hover:text-white/80">
                          {item.context}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
