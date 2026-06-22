"use client";

import { ENTITIES } from "../_data/entities";

const HERO_STATS = [
  { label: "Active Entities", val: "07" },
  { label: "Strategic Axes", val: "3" },
  { label: "Status", val: "Live" },
] as const;

/**
 * Entity Grid hero.
 *
 * Editorial title block on the left, description + 3-stat bar on the
 * right. Animation hooks (`.hero-reveal`) are picked up by the parent
 * GSAP timeline; this component is pure presentation.
 */
export default function HeroSection() {
  return (
    <section className="relative px-gutter pt-[18vh] pb-14 border-b border-white/10">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-[20%] w-[60vw] h-[50vh] bg-gold/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          {/* Left: Title block */}
          <div>
            <div className="hero-reveal flex items-center gap-4 mb-8">
              <span className="text-gold text-xs font-bold tracking-[0.5em] uppercase">
                Directory
              </span>
              <span className="w-12 h-px bg-white/40" />
              <span className="text-white/80 text-xs font-bold tracking-[0.4em] uppercase">
                {ENTITIES.length} Entities
              </span>
            </div>

            <h1 className="hero-reveal text-[clamp(3.5rem,8vw,9rem)] font-black uppercase tracking-tighter leading-[0.82] text-white drop-shadow-lg">
              ENTITY
              <br />
              <span className="text-white/60">GRID</span>
            </h1>

            <div className="hero-reveal w-20 h-1.5 bg-gold mt-8 shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
          </div>

          {/* Right: Description + stats */}
          <div className="hero-reveal lg:max-w-sm pb-2">
            <p className="text-white/90 text-lg lg:text-xl leading-relaxed font-normal mb-8">
              A structured overview of the holding&apos;s operational entities,
              platforms, and strategic ventures.
            </p>
            <div className="flex gap-8 border-t border-white/20 pt-6">
              {HERO_STATS.map(({ label, val }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{val}</p>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mt-1 font-bold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
