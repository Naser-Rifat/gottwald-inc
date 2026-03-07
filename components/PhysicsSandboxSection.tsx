"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "./Header";

export default function PhysicsSandboxSection() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollIndicatorRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade in the scroll indicator
      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.2, delay: 1.5, ease: "power3.out" },
      );

      // Continuous gentle bounce on the chevron
      const chevron = el.querySelector(".scroll-chevron");
      if (chevron) {
        gsap.to(chevron, {
          y: 6,
          duration: 1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Pulse the dot ring
      const ring = el.querySelector(".scroll-ring");
      if (ring) {
        gsap.to(ring, {
          scale: 1.3,
          opacity: 0,
          duration: 1.8,
          ease: "power2.out",
          repeat: -1,
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col px-[5vw] pointer-events-none text-white">
      {/* Header */}
      <div className="pointer-events-auto z-20 w-full relative">
        <Header />
      </div>

      {/* Hero Content — centered vertically in remaining space */}
      <div className="flex-1 flex items-center z-10 relative">
        {/* Left: Label + Title */}
        <div className="flex-1">
          <div className="mb-5 text-[10px] md:text-[11px] tracking-[0.35em] text-white/35 font-normal uppercase">
            LABS AREA
          </div>
          <h1
            className="font-bold tracking-[-0.03em] leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 7vw, 9rem)" }}
          >
            PLAY GROUND
            <br />
            R&D COLLECTION
            <br />
            EXPERIMENTS
          </h1>
        </div>

        {/* Right: Description — anchored to bottom of title block, cleared above scroll zone */}
        <div className="hidden md:block max-w-[22rem] text-white/45 text-[13px] leading-[1.75] pointer-events-auto self-end pb-24">
          A space dedicated to anticipate how new technologies will affect
          brands and how we interact with them through R&D.
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto z-10 opacity-0"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 font-medium">
          Scroll
        </span>
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="scroll-ring absolute w-8 h-8 rounded-full border border-white/15" />
          {/* Static ring */}
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            {/* Bouncing chevron */}
            <svg
              className="scroll-chevron w-3 h-3 text-white/50"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4 L6 8 L10 4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
