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
            GOTT WALD
          </div>
          <h1
            className="font-bold tracking-[-0.03em] leading-[0.88] mix-blend-difference text-white/90 z-30 relative"
            style={{ fontSize: "clamp(2.8rem, 7vw, 9rem)" }}
          >
            WE TURN
            <br />
            COMPLEXITY
            <br />
            INTO INEVITABILITY.
          </h1>
        </div>

        {/* Right: Description — anchored to bottom of title block, cleared above scroll zone */}
        <div className="hidden md:block max-w-[22rem] pointer-events-auto self-end pb-24 flex flex-col items-start gap-8">
          <p className="text-white/60 text-[18px] font-serif italic leading-[1.6]">
            One system. One standard. Outcomes that hold.
          </p>
          <button className="h-[46px] mt-6 rounded-full bg-white text-black flex items-center gap-3 px-6 hover:bg-white/90 transition-colors">
            <span className="w-1.5 h-1.5 bg-black rounded-full" />
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase mt-[1px]">
              Request a Strategic Conversation
            </span>
          </button>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto z-10 opacity-0"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">
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
