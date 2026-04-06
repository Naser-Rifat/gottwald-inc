"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

const entities = [
  {
    id: "01",
    name: "GOTT WALD Holding",
    tagline: "Strategic holding structure and global operating framework.",
    pillar: "Foundation",
    status: "Active",
    size: "lg", // large card spanning 2 cols
  },
  {
    id: "02",
    name: "PLHH.world",
    tagline: "Peace, Love & Harmony — for more Humanity.",
    pillar: "Community",
    status: "Active",
    size: "sm",
  },
  {
    id: "03",
    name: "YIG.CARE",
    tagline: "Human resonance, clarity, and inner strength.",
    pillar: "Wellbeing",
    status: "Active",
    size: "sm",
  },
  {
    id: "04",
    name: "IT Solutions 2030",
    tagline: "Engineered digital systems for the next decade.",
    pillar: "Technology",
    status: "Active",
    size: "sm",
  },
  {
    id: "05",
    name: "Relocation — Georgia",
    tagline: "Executive relocation and structure deployment.",
    pillar: "Operations",
    status: "Active",
    size: "sm",
  },
  {
    id: "06",
    name: "Consulting",
    tagline: "Strategic business clarity, direction, and execution.",
    pillar: "Advisory",
    status: "Active",
    size: "sm",
  },
  {
    id: "07",
    name: "Coaching & Mentoring",
    tagline: "Human development, transition, and aligned growth.",
    pillar: "Development",
    status: "Active",
    size: "lg",
  },
];

export default function EntityGridClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text stagger
      gsap.fromTo(
        ".hero-reveal",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.1 }
      );

      // Cards cascade in
      const cards = gsap.utils.toArray(".entity-card", containerRef.current!) as HTMLElement[];
      cards.forEach((card, i) => {
        if (i < 4) {
          // Visible cards: staggered entrance, no scroll trigger
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              force3D: true,
              clearProps: "transform",
              delay: 0.3 + i * 0.1,
            }
          );
        } else {
          // Offscreen cards: scroll-triggered
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              force3D: true,
              clearProps: "transform",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-gold selection:text-black overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full">
        {/* ── HERO ── */}
        <section className="relative px-gutter pt-[18vh] pb-14 border-b border-white/10">
          {/* Ambient background glow - made slightly more prominent */}
          <div className="absolute top-0 left-[20%] w-[60vw] h-[50vh] bg-gold/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              {/* Left: Title block */}
              <div>
                <div className="hero-reveal flex items-center gap-4 mb-8">
                  <span className="text-gold text-xs font-bold tracking-[0.5em] uppercase">Directory</span>
                  <span className="w-12 h-px bg-white/40" />
                  <span className="text-white/80 text-xs font-bold tracking-[0.4em] uppercase">
                    {entities.length} Entities
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
                  A structured overview of the holding&apos;s operational entities, platforms, and strategic ventures.
                </p>
                <div className="flex gap-8 border-t border-white/20 pt-6">
                  {[
                    { label: "Active Entities", val: "07" },
                    { label: "Strategic Axes", val: "3" },
                    { label: "Status", val: "Live" },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-2xl font-black text-white">{val}</p>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mt-1 font-bold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ENTITY GRID ── */}
        <section className="px-gutter py-20 lg:py-28 relative z-10">
          <div className="max-w-7xl mx-auto">

            {/* Bento-style grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className={`entity-card group relative bg-[#0a0a0a] border border-white/10 hover:border-gold/50 p-10 lg:p-12 overflow-hidden cursor-default flex flex-col justify-between min-h-[340px] transition-all duration-700 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:-translate-y-1 ${entity.size === "lg" ? "md:col-span-2 lg:col-span-2" : ""}`}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
                    el.style.setProperty("--cy", `${e.clientY - rect.top}px`);
                  }}
                >
                  {/* Mouse-follow gold spotlight */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 mix-blend-screen"
                    style={{
                      background: `radial-gradient(600px circle at var(--cx, 50%) var(--cy, 50%), rgba(212,175,55,0.12), transparent 40%)`,
                    }}
                  />

                  {/* Corner bracket TL */}
                  <div className="absolute top-0 left-0 w-8 h-px bg-gold/80 group-hover:w-24 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" />
                  <div className="absolute top-0 left-0 w-px h-8 bg-gold/80 group-hover:h-24 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" />

                  {/* Watermark number - High contrast outline */}
                  <div className="absolute -bottom-10 -right-6 text-[12rem] font-black leading-none text-transparent transition-all duration-1000 select-none pointer-events-none z-0 opacity-20 group-hover:opacity-100 group-hover:scale-110" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.15)" }}>
                    {entity.id}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="font-mono text-gold text-sm tracking-[0.4em] font-bold bg-gold/10 px-3 py-1 rounded-sm border border-gold/20">{entity.id}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:border-gold/30 transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-300" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">{entity.status}</span>
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="mt-auto pt-12 transform transition-transform duration-500 group-hover:-translate-y-2">
                      {/* Pillar label */}
                      <span className="text-xs tracking-[0.4em] uppercase text-gold font-extrabold mb-3 block">
                        {entity.pillar}
                      </span>

                      <h3 className={`font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 leading-[0.95] mb-5 drop-shadow-md ${entity.size === "lg" ? "text-4xl lg:text-5xl" : "text-3xl lg:text-4xl"}`}>
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
                All entities operate under the GOTT WALD standard. <span className="font-bold text-white">Confidential by default.</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
