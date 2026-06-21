"use client";

import Image from "next/image";

const DECISION_CODE = [
  { core: "Love", meaning: "as the measure" },
  { core: "Peace", meaning: "as the direction" },
  { core: "Harmony", meaning: "as the outcome" },
  { core: "Compassion", meaning: "as the posture" },
  { core: "Empathy", meaning: "as the capability" },
  { core: "Service", meaning: "as lived responsibility" },
] as const;

const RARE_GIFT_EFFECTS = [
  "Conflict becomes clear.",
  "Disorder becomes direction.",
  "Pressure becomes purpose.",
] as const;

/**
 * THE PATRON OF GOTT WALD — two-column manifesto.
 *
 * Left: The Decision Code (6 timeless values).
 * Right: A Rare Gift (the PATRON's protective framework, ending in the
 *        three "X becomes Y" liturgical effects).
 *
 * The patron-craft image on the right edge is parallax-scrubbed by the
 * parent GSAP context via `.patron-craft-img` + `.patron-section`.
 */
export default function PatronSection() {
  return (
    <section
      data-journey="patron"
      className="patron-section about-atmosphere py-[16vh] lg:py-[20vh] px-gutter relative flex items-center justify-center bg-[#070c14] border-y border-white/[0.04] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="about-visual about-visual--portrait pointer-events-none hidden lg:block absolute right-0 top-0 bottom-0 w-[32vw] max-w-[520px] z-0 overflow-hidden"
      >
        <Image
          src="/about/patron-craft.webp"
          alt=""
          fill
          sizes="32vw"
          className="patron-craft-img about-visual-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#070c14]/40 to-[#070c14] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070c14]/45 via-transparent to-[#070c14]/65 z-10 pointer-events-none" />
      </div>

      <div className="max-w-[1400px] mx-auto text-center relative z-10 space-y-24">
        <div className="reveal-text space-y-8">
          <h2 className="text-[clamp(3rem,6vw,6rem)] font-light leading-[1.1] uppercase tracking-tighter">
            THE PATRON <br />
            <span className="font-mono text-turquoise/80 block text-[clamp(1.4rem,2.4vw,2.6rem)] uppercase tracking-[0.35em] mt-4">
              of gott wald
            </span>
          </h2>
          <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
            In the fabric of GOTT WALD, the PATRON is not the &quot;single
            maker&quot; — and not the lone specialist. The PATRON is the
            protective framework.
          </p>
        </div>

        <div className="reveal-text grid grid-cols-1 md:grid-cols-2 text-left border-y border-white/[0.09] py-12 md:py-16 mx-auto w-full relative">
          <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 w-px bg-white/10" />

          {/* LEFT COLUMN: THE DECISION CODE */}
          <div className="reveal-text md:pr-24 space-y-12 pb-16 md:pb-0">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-bold mb-6">
                The Decision Code
              </p>
              <p className="text-[clamp(1.2rem,1.5vw,1.5rem)] text-white/80 font-light leading-relaxed max-w-lg">
                GOTT WALD is not built on trends. It is built on principles.
                <br />
                <span className="text-white italic mt-2 block">
                  Timeless. Durable. Non-negotiable.
                </span>
              </p>
            </div>

            <ul className="flex flex-col border-t border-white/10">
              {DECISION_CODE.map((val) => (
                <li
                  key={val.core}
                  className="flex items-center justify-between border-b border-white/5 py-6 group cursor-default"
                >
                  <span className="font-semibold uppercase tracking-[0.04em] text-2xl md:text-3xl text-white group-hover:text-turquoise transition-colors duration-500">
                    {val.core}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] font-light text-white group-hover:text-white transition-colors duration-500">
                    {val.meaning}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-l border-turquoise/40 pl-6 py-2">
              <p className="text-lg font-light text-white/90">
                This is not a slogan.
                <strong className="block font-normal text-turquoise mt-1">
                  This is lived reality.
                </strong>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: A RARE GIFT */}
          <div className="reveal-text space-y-12 md:pl-24 pt-16 md:pt-0 border-t border-white/10 md:border-t-0 flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold/95 font-bold mb-6">
                A rare gift
              </p>
              <p className="text-[clamp(1.2rem,1.4vw,1.5rem)] text-white/95 font-light leading-relaxed max-w-lg">
                The PATRON carries a rare gift: a reader of people, a feeler, a
                gatherer. The PATRON sees you before you&apos;ve fully
                organized yourself.
              </p>
            </div>

            <div className="relative py-10 lg:py-14 border-y border-turquoise/25 overflow-hidden group">
              <div className="relative z-10">
                <p className="text-white/95 font-light leading-[1.25] text-2xl md:text-4xl tracking-tight mb-10">
                  &quot;Nothing here is performed,{" "}
                  <br className="hidden lg:block" />
                  <span className="text-turquoise/85">
                    everything here is held.&quot;
                  </span>
                </p>

                <ul className="space-y-4">
                  {RARE_GIFT_EFFECTS.map((effect) => (
                    <li key={effect} className="flex gap-4 items-center">
                      <div className="w-[1px] h-4 bg-turquoise/50" />
                      <p className="text-lg text-white/90 font-light tracking-wide">
                        {effect}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[clamp(1.2rem,1.4vw,1.5rem)] text-white/70 font-light leading-relaxed max-w-lg">
              So specialists can build without systems turning cold. So growth
              never consumes the soul. A framework that carries. A system that
              protects. A force that unites.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
