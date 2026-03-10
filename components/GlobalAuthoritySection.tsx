"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function GlobalAuthoritySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the section on scroll
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        },
      );

      // Stagger text elements (Left Column)
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
            },
          },
        );
      }

      // Stagger HUD elements (Right Column)
      if (hudRef.current) {
        gsap.fromTo(
          hudRef.current.children,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2, // slightly slower stagger for the HUD to sequence after the left text
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current, // trigger based on left column so they start together
              start: "top 80%",
            },
          },
        );
      }

      // Stagger bottom metrics
      if (metricsRef.current) {
        gsap.fromTo(
          metricsRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] lg:min-h-[110vh] bg-transparent overflow-hidden flex flex-col justify-between py-[12vh] px-gutter"
    >
      {/* Background Map Container */}
      <div
        className="absolute inset-x-0 w-full h-[120%] top-[10%] lg:top-[15%] z-0 pointer-events-none flex items-center justify-center opacity-90"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <div className="relative w-[150%] md:w-[120%] lg:w-[90%] max-w-[1600px] aspect-[1.47]">
          <Image
            src="/assets/world-map-dark.svg"
            alt="Global Network Map"
            fill
            className="object-contain opacity-20"
            priority
          />

          {/* Radar Scanning Line */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-full opacity-30 mix-blend-screen hidden md:block">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-[scan_6s_linear_infinite] absolute" />
          </div>

          {/* Connected Map Nodes (Animated) */}
          <div
            ref={hudRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
          >
            {/* 1. Tbilisi Control Node */}
            <div className="absolute top-[32%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20">
              {/* Precision Dot */}
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10" />
              {/* Radar Rings */}
              <div
                className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#d4af37]/40 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#d4af37]/10 animate-ping hidden md:block"
                style={{ animationDuration: "3s", animationDelay: "1s" }}
              />

              {/* Tech Line Connector & HUD */}
              <div className="hidden md:flex absolute top-1/2 left-4 items-center -translate-y-1/2">
                <div className="w-16 lg:w-24 h-px bg-gradient-to-r from-[#d4af37]/60 to-[#d4af37]/10" />
                <div className="flex flex-col gap-1 ml-4 py-2 border-l border-[#d4af37]/30 pl-4 w-max backdrop-blur-sm bg-base/30 rounded-r-lg pr-4">
                  <h4 className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-[10px]">
                    01 — HEAD OFFICE
                  </h4>
                  <p className="text-white font-serif italic text-2xl lg:text-3xl my-1">
                    Tbilisi, Georgia
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] uppercase tracking-widest text-white/50">
                    <span className="text-white/80">Governance</span>
                    <span>/</span>
                    <span className="text-white/80">Engineering</span>
                    <span>/</span>
                    <span className="text-white/80">Quality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DACH Hubs (Munich Anchored) */}
            <div className="absolute top-[28%] left-[55%] md:left-[60%] lg:left-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20">
              {/* Precision Dot */}
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" />
              {/* Radar Rings */}
              <div
                className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/30 animate-ping hidden md:block"
                style={{ animationDuration: "4s" }}
              />

              {/* Tech Line Connector & HUD - Pointing Up */}
              <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center">
                <div className="flex flex-col gap-1 items-center mb-3 pb-3 border-b border-white/20 px-6 backdrop-blur-sm bg-base/20 rounded-t-lg w-max">
                  <h4 className="text-white/80 font-bold tracking-[0.3em] uppercase text-[9px]">
                    02 — STRATEGIC HUBS
                  </h4>
                  <p className="text-white font-light tracking-wide text-xl my-1">
                    DACH Region
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[8px] uppercase tracking-[0.2em] text-white/40">
                    <span className="text-white/70">Germany</span>
                    <span>/</span>
                    <span className="text-white/70">Austria</span>
                    <span>/</span>
                    <span className="text-white/70">Switzerland</span>
                  </div>
                </div>
                <div className="h-10 lg:h-16 w-px bg-gradient-to-t from-white/60 to-white/10" />
              </div>
            </div>

            {/* Vienna & Zurich Micro Nodes */}
            <div className="absolute top-[28.5%] left-[51%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/70 z-10" />
            <div className="absolute top-[29%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/70 z-10" />

            {/* Footprints */}
            <div className="absolute top-[38%] left-[23%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
            <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
            <div className="absolute top-[45%] left-[65%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
            <div className="absolute top-[30%] left-[75%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
            <div className="absolute top-[65%] left-[30%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
            <div className="absolute top-[75%] left-[80%] w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Foreground Content Stack */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between flex-grow pointer-events-none max-w-[1400px] mx-auto">
        {/* Top Left: Title Copy */}
        <div
          ref={textRef}
          className="w-full xl:w-[50%] pr-4 md:pr-12 lg:pr-24 flex flex-col gap-8 pointer-events-auto mix-blend-difference relative z-30"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs tracking-[0.4em] text-[#d4af37] uppercase font-bold">
                Node 001. Worldwide Execution.
              </span>
            </div>
            <h2 className="text-[clamp(2.5rem,11vw,8rem)] font-bold text-white tracking-[-0.04em] leading-[0.8] uppercase">
              GLOBAL
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                AUTHORITY.
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-2 border-l-2 border-[#d4af37] pl-6 ml-2">
            <p className="text-2xl md:text-4xl text-white leading-tight font-light tracking-tight">
              One system. One standard.
            </p>
            <p className="text-xl md:text-3xl text-[#d4af37] italic font-serif opacity-90">
              Outcomes that hold.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Metrics & Caption */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-end gap-16 pointer-events-auto mt-[15vh] lg:mt-auto">
          {/* Caption */}
          <div className="flex items-center gap-3 order-2 lg:order-1 lg:mb-2">
            <span className="w-8 h-px bg-white/50 block" />
            <p className="text-white/70 text-[10px] font-serif italic tracking-wide drop-shadow-sm">
              Data architecture actively plotting. Centralized in Tbilisi.
            </p>
          </div>

          {/* 03 Global Presence Metrics */}
          <div
            ref={metricsRef}
            className="order-1 lg:order-2 flex flex-col gap-10 w-full lg:max-w-4xl bg-black/40 backdrop-blur-xl p-8 rounded-none border-t border-white/10 lg:p-10"
          >
            {/* Mobile Fallback Nodes */}
            <div className="md:hidden flex flex-col gap-8 pb-8 border-b border-white/10">
              <div className="flex flex-col gap-1 border-l-2 border-[#d4af37] pl-4">
                <h4 className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-[9px]">
                  01 — HEAD OFFICE
                </h4>
                <p className="text-white font-serif italic text-2xl">
                  Tbilisi, Georgia
                </p>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-white/30 pl-4">
                <h4 className="text-white/60 font-bold tracking-[0.3em] uppercase text-[9px]">
                  02 — STRATEGIC HUBS
                </h4>
                <p className="text-white text-xl font-light tracking-wide">
                  DACH Region
                </p>
              </div>
            </div>

            {/* Data Grid */}
            <div className="flex items-center gap-4 mb-2 ">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <h4 className="text-white/60 font-bold tracking-[0.4em] uppercase text-[10px] hidden lg:block">
                03 — GLOBAL PRESENCE
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-sm w-full">
              <div className="flex flex-col gap-2">
                <span className="text-white/50 uppercase text-[10px] tracking-[0.3em] font-semibold flex items-center gap-2">
                  <span className="w-3 h-px bg-white/30 block" /> Coverage
                </span>
                <span className="text-white text-4xl lg:text-5xl font-light tracking-tight flex items-baseline gap-2">
                  26
                  <span className="text-white/40 text-sm tracking-widest uppercase font-semibold">
                    Countries
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white/50 uppercase text-[10px] tracking-[0.3em] font-semibold flex items-center gap-2">
                  <span className="w-3 h-px bg-white/30 block" /> Partners
                </span>
                <span className="text-white text-4xl lg:text-5xl font-light tracking-tight flex items-baseline gap-2">
                  71
                  <span className="text-white/40 text-sm tracking-widest uppercase font-semibold">
                    Origins
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#d4af37]/70 uppercase text-[10px] tracking-[0.3em] font-semibold flex items-center gap-2">
                  <span className="w-3 h-px bg-[#d4af37]/50 block" /> Network
                </span>
                <span className="text-[#d4af37] text-4xl lg:text-5xl font-light tracking-tight flex items-baseline gap-2">
                  888<span className="text-2xl -ml-1">±</span>
                  <span className="text-[#d4af37]/50 text-sm tracking-widest uppercase font-semibold">
                    Signature
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white/50 uppercase text-[10px] tracking-[0.3em] font-semibold flex items-center gap-2">
                  <span className="w-3 h-px bg-white/30 block" /> Language
                </span>
                <span className="text-white text-4xl lg:text-5xl font-light tracking-tight flex items-baseline gap-2">
                  17
                  <span className="text-white/40 text-sm tracking-widest uppercase font-semibold">
                    Spoken
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
