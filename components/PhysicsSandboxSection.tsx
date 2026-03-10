"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Header from "./Header";

export default function PhysicsSandboxSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const words = heroRef.current!.querySelectorAll(".hero-word");
      const desc = heroRef.current!.querySelector(".hero-desc");
      const topLabel = heroRef.current!.querySelector(".hero-top-label");
      const scrollBtn = heroRef.current!.querySelector(".hero-scroll");

      // ── 1. Set initial states ──────────────────────────────────────
      gsap.set(words, { y: "150%" });
      const secondaryElements = [desc, topLabel, scrollBtn].filter(Boolean);
      if (secondaryElements.length > 0) {
        gsap.set(secondaryElements, { opacity: 0 });
      }

      // ── 2. Master entrance timeline ────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });

      // Words cascade up
      tl.to(words, {
        y: "0%",
        duration: 1.4,
        stagger: 0.1,
        ease: "power4.out",
      });

      // Fade in secondary elements smoothly
      if (secondaryElements.length > 0) {
        tl.to(
          secondaryElements,
          { opacity: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" },
          "-=0.8",
        );
      }

      // Add elegant bobbing animation to the scroll arrow
      const arrow = heroRef.current!.querySelector(".hero-scroll svg");
      if (arrow) {
        gsap.to(arrow, {
          y: 4,
          x: 4,
          duration: 1.2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex flex-col pointer-events-none text-white overflow-hidden pb-[10vh] px-gutter "
    >
      {/* Header */}
      <div className="pointer-events-auto z-20 w-full relative">
        <Header />
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="flex-1 flex items-end z-10 relative w-full mx-auto pointer-events-auto">
        {/* Bottom container: splits left (heading) and right (desc + scroll) */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-8">
          {/* Left Side: Label and Title */}
          <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-auto">
            {/* Top-left small label */}
            <div className="hero-top-label flex items-center gap-3">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-white/50">
                Gott Wald Area
              </span>
            </div>

            {/* Main title — ultra-clean, thin sans-serif, towering size */}
            <h1
              className="font-light tracking-[-0.03em] leading-[0.95] uppercase mix-blend-screen shrink-0"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 8rem)" }}
            >
              <span className="block overflow-hidden py-1">
                <span className="hero-word block">TURNING COMPLEXITY</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-word block text-white/90">
                  INTO CLARITY, AND DECISIONS
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-word block">INTO MEASURABLE IMPACT</span>
              </span>
            </h1>
          </div>

          {/* Right side: Description and Scroll aligned vertically to bottom */}
          <div className="flex flex-col md:flex-row lg:flex-col justify-between items-start md:items-end lg:items-end w-full lg:w-auto gap-8 lg:gap-6 mb-2">
            {/* Scroll Indicator positioned bottom-right */}
            <div
              className="hero-scroll group flex items-center gap-3 cursor-pointer mt-4 lg:mt-8"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/80 group-hover:text-white transition-colors"
              >
                <path
                  d="M5 5L19 19M19 19V5M19 19H5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/80 group-hover:text-white transition-colors pb-px">
                Scroll Down
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
