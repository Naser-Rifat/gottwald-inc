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
      className="relative w-full bg-transparent overflow-hidden flex flex-col pt-[5vh] md:pt-[6vh] pb-8 lg:pb-12 px-gutter min-h-screen"
    >
      {/* 1. Foreground Title (At the top of the flow) */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-4 lg:mt-8">
        <div
          ref={textRef}
          className="w-full xl:w-[50%] pr-4 md:pr-12 lg:pr-24 flex flex-col gap-8 pointer-events-auto drop-shadow-lg relative z-30"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              <span className="text-[9px] sm:text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-[#d4af37] uppercase font-bold">
                Node 001. Worldwide Execution.
              </span>
            </div>
            <h2 className="text-[clamp(2rem,7.5vw,10rem)] font-bold text-white tracking-[-0.04em] leading-[0.85] uppercase">
              GLOBAL
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #ffffff 0%, rgba(18,168,172,0.85) 60%, rgba(0,109,132,0.7) 100%)",
                }}
              >
                AUTHORITY.
              </span>
            </h2>
          </div>
          <div
            className="flex flex-col gap-2 pl-6 ml-2 max-w-[80vw]"
            style={{ borderLeft: "2px solid rgba(18,168,172,0.5)" }}
          >
            <p className="text-[clamp(1.2rem,2.2vw,3rem)] text-white leading-tight font-light tracking-tight">
              One system. One standard.
            </p>
            <p
              className="text-[clamp(1.1rem,1.8vw,2.5rem)] italic font-serif opacity-90"
              style={{ color: "rgba(18,168,172,0.85)" }}
            >
              Outcomes that hold.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Map Section — mask ONLY on the SVG layer, HUD lives outside the mask */}
      <div className="relative w-full my-[-8%] md:my-[-5%]">

        {/* 2a. Masked SVG + radar — mask stays here, never touches HUD */}
        <div
          className="relative inset-x-0 w-full z-0 pointer-events-none flex items-center justify-center opacity-90 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <div className="relative w-full sm:w-[130%] md:w-[120%] lg:w-[90%] max-w-[1600px] aspect-[1.47]">
            <Image
              src="/assets/world-map-dark.svg"
              alt="Global Network Map"
              fill
              className="object-contain opacity-50"
              priority={false}
            />
            {/* Radar Scanning Line */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-full opacity-30 mix-blend-screen hidden md:block">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-turquoise to-transparent animate-[scan_6s_linear_infinite] absolute" />
            </div>
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
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10" />
              <div
                className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#d4af37]/40 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#d4af37]/10 animate-ping hidden md:block"
                style={{ animationDuration: "3s", animationDelay: "1s" }}
              />
              <div className="hidden md:flex absolute top-1/2 left-4 items-center -translate-y-1/2">
                <div className="w-16 lg:w-24 h-px bg-gradient-to-r from-[#d4af37]/60 to-[#d4af37]/10" />
                <div className="flex flex-col gap-1 ml-4 py-2 border-l border-[#d4af37]/30 pl-4 w-max backdrop-blur-md bg-black/70 rounded-r-lg pr-4 shadow-2xl">
                  <h4 className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-[10px]">
                    01 — HEAD OFFICE
                  </h4>
                  <p className="text-white font-sans text-2xl lg:text-3xl my-1 drop-shadow-md">
                    Tbilisi, Georgia
                  </p>
                </div>
              </div>
            </div>

            {/* 2. DACH Hubs (Munich Anchored) */}
            <div className="absolute top-[25.5%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] z-10" />
              <div
                className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/40 animate-ping hidden md:block"
                style={{ animationDuration: "4s" }}
              />
              <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center">
                <div className="flex flex-col gap-1 items-center mb-3 pb-3 border-b border-[#48e5e8]/40 px-8 py-3 backdrop-blur-md bg-black/75 rounded-t-lg w-max shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                  <h4 className="text-white/90 font-bold tracking-[0.35em] uppercase text-[12px]">
                    02 — STRATEGIC HUBS
                  </h4>
                  <p className="text-[#48e5e8] font-bold tracking-wide text-2xl my-1 drop-shadow-[0_0_16px_rgba(72,229,232,0.6)]">
                    DACH Region
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.25em]">
                    <span className="text-white font-semibold">Germany</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white font-semibold">Austria</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white font-semibold">Switzerland</span>
                  </div>
                </div>
                <div className="h-10 lg:h-16 w-[2px] bg-gradient-to-t from-[#48e5e8] to-transparent drop-shadow-[0_0_6px_rgba(72,229,232,0.8)]" />
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
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none mt-[-5%] lg:mt-[-8%]">
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
            className="order-1 lg:order-2 flex flex-col gap-8 w-full lg:max-w-[900px] xl:max-w-[1050px] backdrop-blur-xl p-8 rounded-none border-t lg:py-12 lg:px-14 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(7,12,20,0.97) 0%, rgba(0,40,55,0.92) 100%)",
              borderColor: "rgba(18,168,172,0.1)",
            }}
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
              <div className="flex flex-col gap-1 border-l-2 border-[#48e5e8]/60 pl-4">
                <h4 className="text-white font-bold tracking-[0.3em] uppercase text-[9px] drop-shadow-sm">
                  02 — STRATEGIC HUBS
                </h4>
                <p className="text-[#48e5e8] text-xl font-bold tracking-wide drop-shadow-[0_0_8px_rgba(72,229,232,0.3)]">
                  DACH Region
                </p>
              </div>
            </div>

            {/* Data Grid Title */}
            <div className="flex items-center gap-3 mb-4 hidden md:flex">
              <div className="w-1 h-1 bg-white/70 rounded-full" />
              <h4 className="text-white/70 font-semibold tracking-[0.3em] uppercase text-[12px] lg:text-[14px]">
                03 — GLOBAL PRESENCE
              </h4>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-sm w-full">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <span className="text-white/50 uppercase text-[12px] tracking-[0.2em] font-semibold">
                  — COVERAGE
                </span>
                <span className="text-white text-5xl lg:text-[4rem] font-light tracking-tighter leading-none flex items-baseline gap-2">
                  26
                  <span className="text-white/50 text-[12px] tracking-[0.1em] uppercase font-bold relative -top-1">
                    COUNTRIES
                  </span>
                </span>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <span
                  className="uppercase text-[12px] tracking-[0.2em] font-semibold"
                  style={{ color: "rgba(18,168,172,0.7)" }}
                >
                  — PARTNERS
                </span>
                <span
                  className="text-5xl lg:text-[4rem] font-light tracking-tighter leading-none flex items-baseline gap-2"
                  style={{ color: "rgba(18,168,172,0.9)" }}
                >
                  71
                  <span
                    className="text-[12px] tracking-[0.1em] uppercase font-bold relative -top-1"
                    style={{ color: "rgba(18,168,172,0.5)" }}
                  >
                    ORIGINS
                  </span>
                </span>
              </div>

              {/* Column 3 — Copper × Network */}
              <div className="flex flex-col gap-3">
                <span
                  className="uppercase text-[12px] tracking-[0.2em] font-semibold"
                  style={{ color: "rgba(192,120,64,0.8)" }}
                >
                  — NETWORK
                </span>
                <span
                  className="text-5xl lg:text-[4rem] font-light tracking-tighter leading-none flex items-baseline gap-1.5"
                  style={{ color: "rgba(192,120,64,0.95)" }}
                >
                  888<span className="text-2xl lg:text-3xl -ml-2 -mt-2">±</span>
                  <span
                    className="text-[12px] tracking-[0.1em] uppercase font-bold relative -top-1 ml-1"
                    style={{ color: "rgba(192,120,64,0.55)" }}
                  >
                    SIGNATURE
                  </span>
                </span>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-3">
                <span
                  className="uppercase text-[12px] tracking-[0.2em] font-semibold"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                >
                  — LANGUAGE
                </span>
                <span
                  className="text-5xl lg:text-[4rem] font-light tracking-tighter leading-none flex items-baseline gap-2"
                  style={{ color: "rgba(212,175,55,0.9)" }}
                >
                  17
                  <span
                    className="text-[12px] tracking-[0.1em] uppercase font-bold relative -top-1"
                    style={{ color: "rgba(212,175,55,0.5)" }}
                  >
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
