"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

const entities = [
  {
    name: "GOTT WALD Holding",
    tagline: "Strategic holding structure and global operating framework.",
  },
  {
    name: "PLHH.world",
    tagline: "Peace, Love & Harmony — for more Humanity.",
  },
  {
    name: "YIG.CARE",
    tagline: "Human resonance, clarity, and inner strength.",
  },
  {
    name: "IT SOLUTIONS 2030",
    tagline: "Engineered digital systems for the next decade.",
  },
  {
    name: "Relocation — Georgia",
    tagline: "Executive relocation and structure deployment.",
  },
  {
    name: "Consulting",
    tagline: "Strategic business clarity, direction, and execution.",
  },
  {
    name: "Coaching & Mentoring",
    tagline: "Human development, transition, and aligned growth.",
  },
];

export default function EntityGridClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header text
      gsap.fromTo(
        ".reveal-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      // Reveal grid items
      gsap.fromTo(
        ".entity-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#060606] text-white flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[25vh] pb-32 px-gutter">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-24">
            <span className="reveal-text block text-[10px] uppercase tracking-[0.4em] text-gold/80 font-medium mb-6">
              Directory
            </span>
            <h1 className="reveal-text text-[clamp(2.5rem,6vw,5rem)] font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
              ENTITY GRID
            </h1>
            <div className="reveal-text w-16 h-px bg-gradient-to-r from-gold/60 to-transparent mb-10" />
            <p className="reveal-text text-white/55 text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
              A structured overview of the holding&apos;s operational entities, platforms, and strategic ventures.
            </p>
          </div>

          {/* Entity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entities.map((entity, i) => (
              <div
                key={i}
                className="entity-card group relative p-8 rounded-sm border border-white/[0.06] bg-white/[0.02] hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 min-h-[160px] flex flex-col justify-center"
              >
                {/* Top-left accent */}
                <div className="absolute top-0 left-0 w-6 h-px bg-gold/40 group-hover:w-12 transition-all duration-500" />
                <div className="absolute top-0 left-0 w-px h-6 bg-gold/40 group-hover:h-12 transition-all duration-500" />

                <h4 className="text-base font-bold uppercase tracking-[0.15em] text-white/90 group-hover:text-gold transition-colors duration-300 mb-3">
                  {entity.name}
                </h4>
                <p className="text-[14px] text-white/40 leading-relaxed font-light group-hover:text-white/70 transition-colors duration-300">
                  {entity.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
