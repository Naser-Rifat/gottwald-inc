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

      // Stagger text elements
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

      // Stagger HUD elements
      if (hudRef.current) {
        gsap.fromTo(
          hudRef.current.children,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2, // slightly slower stagger for the HUD
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
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

    // Pause CSS animations (animate-ping) when section is off-screen
    const el = containerRef.current;
    if (el) {
      const pingObserver = new IntersectionObserver(
        ([entry]) => {
          const pings = el.querySelectorAll(".animate-ping");
          pings.forEach((p) => {
            (p as HTMLElement).style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          });
        },
        { threshold: 0.01 },
      );
      pingObserver.observe(el);
      // Cleanup observer on unmount via ctx.revert's scope — or inline:
      return () => {
        ctx.revert();
        pingObserver.disconnect();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-journey="proof"
      className="relative w-full bg-transparent overflow-hidden flex flex-col pt-[5vh] md:pt-[6vh] pb-8 lg:pb-12 px-gutter min-h-screen"
    >
      {/* Light gradient overlay to ensure map contrast but keeping the beautiful liquid canvas fully visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020b14]/80 via-transparent to-[#020b14]/80 pointer-events-none z-0" />
      {/* 1. Foreground Title (At the top of the flow) */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-16 lg:mt-24">
        <div
          ref={textRef}
          className="w-full xl:w-[50%] pr-4 md:pr-12 lg:pr-24 flex flex-col gap-8 pointer-events-auto drop-shadow-lg relative z-30"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-turquoise rounded-full animate-pulse shadow-[0_0_10px_rgba(18,168,172,0.7)]" />
              <span className="text-[9px] sm:text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-turquoise uppercase font-bold">
                Node 001. Worldwide Execution.
              </span>
            </div>
            <h2 className="text-[clamp(2rem,7.5vw,10rem)] font-bold text-white tracking-[-0.04em] leading-[0.85] uppercase">
              GLOBAL
              <br />
              <span
                className="text-silver bg-clip-text"
                // style={{
                //   backgroundImage: "linear-gradient(90deg, #ffffff 0%, rgba(18,168,172,0.85) 60%, rgba(0,109,132,0.7) 100%)",
                // }}
              >
                AUTHORITY.
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-2 pl-6 ml-2 max-w-[80vw] border-l-2 border-petrol/60 mt-8">
            <p className="text-[clamp(1.2rem,2.2vw,3rem)] text-white leading-tight font-light tracking-tight">
              One system. One standard.
            </p>
            <p className="text-[clamp(0.9rem,1.2vw,1.35rem)] font-mono uppercase tracking-[0.18em] opacity-90 text-turquoise/85">
              Outcomes that hold.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Map Section — mask ONLY on the SVG layer, HUD lives outside the mask */}
      <div className="relative w-full my-[-8%] md:my-[-5%]">

        {/* 2a. Map Base */}
        <div className="relative inset-x-0 w-full z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="relative w-full sm:w-[130%] md:w-[120%] lg:w-[90%] max-w-[1600px] aspect-[1.47] flex items-center justify-center">
            {/* Extremely faint localized ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-turquoise/5 rounded-full blur-[150px] mix-blend-screen" />

            <Image
              src="/assets/world-map-dark.svg"
              alt="Global Network Map"
              fill
              className="object-contain opacity-[0.25] drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] mix-blend-screen"
              priority={false}
            />
          </div>
        </div>

        {/* 2b. HUD overlay — sits on top of the map, NOT inside the mask */}
        <div
          ref={hudRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto flex items-center justify-center"
        >
          {/* Inner container matches the map image width */}
          <div className="relative w-full sm:w-[130%] md:w-[120%] lg:w-[90%] max-w-[1600px] h-full">

            {/* 1. Tbilisi Control Node */}
            <div className="absolute top-[29.3%] left-[58.8%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20">
              {/* Restored Gold Dot */}
              <div className="w-2 h-2 rounded-full bg-[#cda434] shadow-[0_0_15px_rgba(205,164,52,1)] z-10 relative">
                <div className="absolute inset-0 rounded-full bg-[#cda434] animate-ping opacity-40" style={{ animationDuration: "3s" }} />
              </div>
              
              {/* Text located exactly where it was in the HUD design */}
              <div className="absolute top-1/2 left-full items-center -translate-y-1/2 flex items-center pointer-events-none z-10 w-max">
                {/* Delicate Horizontal connecting line */}
                <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-[#cda434]/60 to-transparent" />
                
                {/* Box-less pure typography, placed exactly at the end of the line */}
                <div className="flex flex-col items-start relative -ml-2">
                  {/* Invisible halo for perfect readability */}
                  <div className="absolute inset-0 bg-[#020b14]/90 blur-2xl rounded-[100px] -z-10 scale-[1.3]" />
                  <p className="text-[#cda434] tracking-[0.4em] uppercase text-[10px] font-bold whitespace-nowrap mb-1">01 — HEAD OFFICE</p>
                  <p className="text-white font-sans text-2xl lg:text-3xl tracking-wide whitespace-nowrap font-light drop-shadow-md">Tbilisi, Georgia</p>
                </div>
              </div>
            </div>

            {/* 2. DACH Hubs (Munich Anchored) */}
            <div className="absolute top-[25.5%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20">
              {/* Delicate Vertical connecting line */}
              <div className="absolute bottom-full mb-2 w-[1px] h-12 lg:h-16 bg-gradient-to-t from-turquoise/60 via-turquoise/20 to-transparent" />
              
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-10 relative">
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" style={{ animationDuration: "4s" }} />
              </div>
              
              {/* Text positioned exactly where it was in the HUD design (High Above) */}
              <div className="absolute bottom-full mb-12 lg:mb-16 flex flex-col items-center pointer-events-none z-10 w-max">
                {/* Box-less pure typography */}
                <div className="flex flex-col items-center relative">
                  {/* Invisible halo for perfect readability */}
                  <div className="absolute inset-0 bg-[#020b14]/90 blur-2xl rounded-[100px] -z-10 scale-[1.3]" />
                  <p className="text-white/80 tracking-[0.4em] uppercase text-[10px] font-bold whitespace-nowrap mb-1">02 — STRATEGIC HUBS</p>
                  <p className="text-turquoise font-sans font-medium text-3xl lg:text-4xl tracking-wide whitespace-nowrap mb-2 drop-shadow-md">DACH Region</p>
                  <p className="text-white/90 tracking-[0.3em] uppercase text-[10px] font-bold whitespace-nowrap flex items-center gap-3">
                    GERMANY / AUSTRIA / SWITZERLAND
                  </p>
                </div>
              </div>
            </div>

            {/* Vienna & Zurich Micro Nodes */}
            <div className="absolute top-[26.3%] left-[51.1%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/80 z-10 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            <div className="absolute top-[26.8%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/80 z-10 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />

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

      {/* 3. Bottom Bar: Metrics & Caption */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-[-8%] lg:mt-[-18%]">
        <div className="w-full flex flex-col lg:flex-row justify-between items-end gap-12 pointer-events-auto relative z-30">
          {/* Caption */}
          <div className="flex items-center gap-3 order-2 lg:order-1 lg:mb-[4vh] pt-8 lg:pt-0 w-full lg:w-max">
            <span className="w-10 h-[1px] bg-white/50 block" />
            <p className="text-white/70 text-[14px] lg:text-[18px] font-sans tracking-wide drop-shadow-md font-light">
              Data architecture actively plotting. Centralized in Tbilisi.
            </p>
          </div>

          {/* 03 Global Presence Metrics */}
          <div
            ref={metricsRef}
            className="order-1 lg:order-2 flex flex-col gap-8 w-full lg:max-w-[900px] xl:max-w-[1100px] relative z-20 pt-16 pb-8 lg:pb-0"
          >
            {/* Extremely subtle ambient fade for text readability without a hard box */}
            <div className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/90 via-black/30 to-transparent blur-2xl -z-10 pointer-events-none" />
            {/* Mobile Fallback Nodes */}
            <div className="md:hidden flex flex-col gap-8 pb-8 border-b border-white/10">
              <div className="flex flex-col gap-1 border-l-2 border-turquoise pl-4">
                <p className="text-turquoise font-bold tracking-[0.3em] uppercase text-[9px]">
                  01 — HEAD OFFICE
                </p>
                <p className="text-white font-mono uppercase tracking-[0.14em] text-base">
                  Tbilisi, Georgia
                </p>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-turquoise/60 pl-4">
                <p className="text-white font-bold tracking-[0.3em] uppercase text-[9px] drop-shadow-sm">
                  02 — STRATEGIC HUBS
                </p>
                <p className="text-turquoise text-xl font-bold tracking-wide drop-shadow-[0_0_8px_rgba(18,168,172,0.3)]">
                  DACH Region
                </p>
              </div>
            </div>

            {/* Data Grid Title */}
            <div className="flex items-center gap-4 mb-6 hidden md:flex">
             
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-sm w-full">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <span className="uppercase text-[10px] tracking-[0.3em] font-bold text-white/50 drop-shadow-md">
                  — COVERAGE
                </span>
                <span className="text-white/90 text-5xl lg:text-[5rem] font-medium tracking-tight leading-none flex items-baseline gap-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  26
                  <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold relative -top-4 font-sans">
                    COUNTRIES
                  </span>
                </span>
              </div>

              {/* Column 2 — Turquoise × Partners */}
              <div className="flex flex-col gap-3">
                <span className="uppercase text-[10px] tracking-[0.3em] font-bold text-turquoise/70 drop-shadow-md">
                  — PARTNERS
                </span>
                <span className="text-5xl lg:text-[5rem] font-medium tracking-tight leading-none flex items-baseline gap-2 text-turquoise drop-shadow-[0_4px_16px_rgba(18,168,172,0.3)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  71
                  <span className="text-turquoise/50 text-[10px] tracking-[0.2em] uppercase font-bold relative -top-4 font-sans">
                    ORIGINS
                  </span>
                </span>
              </div>

              {/* Column 3 — Copper × Network */}
              <div className="flex flex-col gap-3">
                <span className="uppercase text-[10px] tracking-[0.3em] font-bold text-[#c07840]/80 drop-shadow-md">
                  — NETWORK
                </span>
                <span className="text-5xl lg:text-[5rem] font-medium tracking-tight leading-none flex items-baseline gap-1.5 text-[#c07840] drop-shadow-[0_4px_16px_rgba(192,120,64,0.4)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  888<span className="text-3xl lg:text-4xl -ml-2 -mt-6 text-[#c07840]/60 font-sans">+</span>
                  <span className="text-[#c07840]/50 text-[10px] tracking-[0.2em] uppercase font-bold relative -top-4 ml-1 font-sans">
                    SIGNATURE
                  </span>
                </span>
              </div>

              {/* Column 4 — Silver × Language */}
              <div className="flex flex-col gap-3">
                <span className="uppercase text-[10px] tracking-[0.3em] font-bold text-silver/70 drop-shadow-md">
                  — LANGUAGE
                </span>
                <span className="text-5xl lg:text-[5rem] font-medium tracking-tight leading-none flex items-baseline gap-2 text-silver drop-shadow-[0_4px_16px_rgba(184,192,204,0.3)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  17
                  <span className="text-silver/50 text-[10px] tracking-[0.2em] uppercase font-bold relative -top-4 font-sans">
                    SPOKEN
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
