"use client";

import Image from "next/image";

import { CASES } from "../_data/cases";

const ROMANS = ["i", "ii", "iii", "iv", "v"] as const;

interface CasesSectionProps {
  /** Currently visible case index (0..4). */
  activeCaseIndex: number;
  /** Setter for next/prev cycling — used by both desktop and mobile
   *  navigation buttons. */
  setActiveCaseIndex: (updater: (prev: number) => number) => void;
}

/**
 * MINI CASES — editorial proof sequence.
 *
 * Magazine-style spread: section header on top, then a glass-card
 * carousel with a meta-rail (mark image + audience tag) on the left
 * and a pull-quote story on the right.
 *
 * The historical alternating L/R block list was removed in favour of
 * the carousel; the section signature is the ghost-italic "mirrors."
 * watermark floating off-grid in the background.
 */
export default function CasesSection({
  activeCaseIndex,
  setActiveCaseIndex,
}: CasesSectionProps) {
  const total = CASES.length;
  const current = CASES[activeCaseIndex];

  return (
    <section
      data-journey="cases"
      className="about-atmosphere bg-[#070c14] relative pt-[14vh] lg:pt-[18vh] pb-[8vh] lg:pb-[10vh] px-gutter overflow-hidden"
    >
      {/* Architectural anchor — colossal italic "mirrors." floats
          behind the header at <4% opacity. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] right-[-7vw] z-0 select-none"
      >
        <span
          className="block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(11rem, 22vw, 26rem)",
          }}
        >
          mirrors.
        </span>
      </div>

      <div className="reveal-text max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-12 h-px bg-gold/40" />
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-bold">
            Mini Case Stories{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <h3
              className="text-white font-light leading-[0.98] tracking-[-0.032em]"
              style={{
                fontSize:
                  "calc(clamp(2.4rem, 4.6vw, 4.8rem) * var(--heading-scale))",
              }}
            >
              You will know
              <span className="block italic text-white/55 font-light lg:pl-[10%]">
                one of them.
              </span>
            </h3>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pl-10 lg:border-l border-silver/15">
            <p
              className="italic font-light text-silver/65 leading-[1.55]"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1rem, 1.2vw, 1.2rem)",
              }}
            >
              Five short readings — not case studies dressed up as proof. Each
              is a mirror.
            </p>
          </div>
        </div>

        {/* True Awwwards-Winning Editorial Carousel */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8 mt-8 md:mt-16 mb-12 h-full">
          {/* Left Navigation Pill (Desktop) */}
          <button
            onClick={() =>
              setActiveCaseIndex((prev) => (prev === 0 ? total - 1 : prev - 1))
            }
            className="group hidden md:flex w-12 md:w-16 h-auto min-h-[300px] border border-white/10 rounded-full flex-col items-center justify-center hover:bg-white/[0.03] hover:border-white/30 transition-all duration-500 focus-visible:outline-1 focus-visible:outline-turquoise"
            aria-label="Previous Case"
          >
            <span className="text-white/40 text-2xl font-light group-hover:text-white group-hover:-translate-x-1 transition-all duration-500">
              ←
            </span>
          </button>

          {/* Main Content Glass Card */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 min-h-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/10 relative bg-white/[0.02] backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-turquoise/5 via-transparent to-transparent pointer-events-none" />

            {/* Left Column — Image & Meta */}
            <div className="md:col-span-5 lg:col-span-4 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10">
              <div className="flex-1 flex items-center justify-center md:justify-start mb-8 md:mb-0">
                {current.mark ? (
                  <div className="relative w-full max-w-[220px] aspect-square opacity-90 drop-shadow-lg mix-blend-screen transition-all duration-700">
                    <Image
                      src={current.mark}
                      alt={current.title}
                      fill
                      sizes="220px"
                      quality={70}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                    <span className="text-white/20 font-playfair italic text-2xl">
                      {ROMANS[activeCaseIndex]}.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <p className="text-white font-sans text-xl font-light tracking-wide">
                  {current.title.split(" — ")[1]}
                </p>
                <p className="text-turquoise/80 text-xs font-mono uppercase tracking-[0.2em]">
                  {current.tag}
                </p>
              </div>
            </div>

            {/* Right Column — Story / Pull Quote */}
            <div className="md:col-span-7 lg:col-span-8 p-8 md:p-16 lg:p-20 flex items-center relative z-10">
              <div className="relative">
                <span className="absolute -top-12 -left-8 text-white/10 font-playfair text-[8rem] leading-none select-none pointer-events-none">
                  &quot;
                </span>

                <p className="font-playfair text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.7] text-white/60 relative z-10">
                  <span className="text-white/90">
                    &quot;{current.before}{" "}
                  </span>
                  <span className="text-turquoise italic">
                    {current.intervention}{" "}
                  </span>
                  <span className="text-white/90">{current.after}&quot;</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Navigation Pill (Desktop) */}
          <button
            onClick={() =>
              setActiveCaseIndex((prev) => (prev === total - 1 ? 0 : prev + 1))
            }
            className="group hidden md:flex w-12 md:w-16 h-auto min-h-[300px] border border-white/10 rounded-full flex-col items-center justify-center hover:bg-white/[0.03] hover:border-white/30 transition-all duration-500 focus-visible:outline-1 focus-visible:outline-turquoise"
            aria-label="Next Case"
          >
            <span className="text-white/40 text-2xl font-light group-hover:text-white group-hover:translate-x-1 transition-all duration-500">
              →
            </span>
          </button>

          {/* Mobile Navigation Row */}
          <div className="flex md:hidden items-center justify-center gap-4 w-full">
            <button
              onClick={() =>
                setActiveCaseIndex((prev) =>
                  prev === 0 ? total - 1 : prev - 1,
                )
              }
              className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              aria-label="Previous Case"
            >
              <span className="text-white/60 text-xl font-light">←</span>
            </button>
            <button
              onClick={() =>
                setActiveCaseIndex((prev) =>
                  prev === total - 1 ? 0 : prev + 1,
                )
              }
              className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              aria-label="Next Case"
            >
              <span className="text-white/60 text-xl font-light">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
