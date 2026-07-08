"use client";

import type { MouseEvent } from "react";

import { ENTITIES } from "../_data/entities";

/**
 * Bento-style entity directory grid. Each card:
 *  - has a mouse-follow gold spotlight that tracks `--cx` / `--cy`
 *    custom properties set on mousemove,
 *  - reveals a corner-bracket animation + watermark-numeral on hover,
 *  - spans 2 columns when its `size` is `"lg"`, 1 otherwise.
 *
 * `.entity-card` is the class hook the parent GSAP timeline uses to
 * cascade the entrance animation.
 */
export default function EntityGridSection() {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--cy", `${e.clientY - rect.top}px`);
  };

  return (
    <section className="px-gutter py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Bento-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENTITIES.map((entity) => (
            <div
              key={entity.id}
              onMouseMove={handleMouseMove}
              className={`entity-card group relative bg-[#0a0a0a] border border-white/10 hover:border-gold/50 p-10 lg:p-12 overflow-hidden cursor-default flex flex-col justify-between min-h-[340px] transition-all duration-700 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:-translate-y-1 ${
                entity.size === "lg" ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              {/* Mouse-follow gold spotlight */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 mix-blend-screen"
                style={{
                  background: `radial-gradient(600px circle at var(--cx, 50%) var(--cy, 50%), rgba(212,175,55,0.12), transparent 40%)`,
                }}
              />

              {/* Corner brackets — animate on hover */}
              <div className="absolute top-0 left-0 w-8 h-px bg-gold/80 group-hover:w-24 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" />
              <div className="absolute top-0 left-0 w-px h-8 bg-gold/80 group-hover:h-24 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" />

              {/* Watermark number */}
              <div
                className="absolute -bottom-10 -right-6 text-[12rem] font-black leading-none text-transparent transition-all duration-1000 select-none pointer-events-none z-0 opacity-20 group-hover:opacity-100 group-hover:scale-110"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.15)" }}
              >
                {entity.id}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gold text-sm tracking-[0.4em] font-bold bg-gold/10 px-3 py-1 rounded-sm border border-gold/20">
                      {entity.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:border-gold/30 transition-colors duration-300">
                    <span className="w-2 h-2 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-300" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">
                      {entity.status}
                    </span>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="mt-auto pt-12 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="text-xs tracking-[0.4em] uppercase text-gold font-extrabold mb-3 block">
                    {entity.pillar}
                  </span>

                  <h3
                    className={`font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 leading-[0.95] mb-5 drop-shadow-md ${
                      entity.size === "lg"
                        ? "text-4xl lg:text-5xl"
                        : "text-3xl lg:text-4xl"
                    }`}
                  >
                    {entity.name}
                  </h3>

                  {/* Divider line — expands on hover */}
                  <div className="w-12 h-0.5 bg-white/30 group-hover:w-full group-hover:bg-gold transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] mb-5" />

                  <p className="text-white/90 group-hover:text-white font-medium leading-relaxed transition-colors duration-500 text-lg">
                    {entity.tagline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="flex items-center gap-6 mt-16 pt-8 border-t border-white/20">
          <span className="w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
          <p className="text-white/90 text-sm font-medium tracking-wide">
            All entities operate under the GOTT WALD standard.{" "}
            <span className="font-bold text-white">Confidential by default.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
