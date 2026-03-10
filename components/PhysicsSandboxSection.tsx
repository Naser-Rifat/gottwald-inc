"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Header from "./Header";

export default function PhysicsSandboxSection() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const words = heroRef.current!.querySelectorAll(".hero-word");
      const label = heroRef.current!.querySelector(".hero-label");
      const chapterNum = heroRef.current!.querySelector(".hero-chapter");
      const taglineLines =
        heroRef.current!.querySelectorAll(".hero-tagline-line");
      const cta = heroRef.current!.querySelector(".hero-cta");

      // ── 1. Set initial states ──────────────────────────────────────
      gsap.set(words, { y: 90, opacity: 0 });
      gsap.set(label, { opacity: 0, x: -12 });
      gsap.set(chapterNum, { opacity: 0, y: 8 });
      gsap.set(taglineLines, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      gsap.set(cta, { opacity: 0, y: 16 });

      // ── 2. Master entrance timeline ────────────────────────────────
      const tl = gsap.timeline({ delay: 0.15 });

      // Label fades in from left
      tl.to(label, { opacity: 1, x: 0, duration: 0.7, ease: "expo.out" });

      // Chapter number rises up
      tl.to(
        chapterNum,
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
        "-=0.4",
      );

      // Words cascade in — staggered one by one
      tl.to(
        words,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "expo.out",
        },
        "-=0.3",
      );

      // Tagline wipes in line by line (clip-path reveal)
      tl.to(
        taglineLines,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          stagger: 0.18,
          ease: "expo.out",
        },
        "-=0.3",
      );

      // CTA rises in last
      tl.to(
        cta,
        { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
        "-=0.3",
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    const el = scrollIndicatorRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.2, delay: 2.2, ease: "power3.out" },
      );
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
      const ring = el.querySelector(".scroll-ring");
      if (ring) {
        gsap.to(ring, {
          scale: 1.4,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
          repeat: -1,
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex flex-col px-gutter pointer-events-none text-white overflow-hidden"
    >
      {/* Header */}
      <div className="pointer-events-auto z-20 w-full relative">
        <Header />
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="flex-1 flex items-center z-10 relative">
        {/* LEFT: Massive asymmetric title block */}
        <div className="flex-1 flex flex-col gap-0 relative">
          {/* Gold chapter number — floats top-left of title */}
          <div className="hero-chapter flex items-center gap-3 mb-6">
            <span className="text-gold text-[11px] font-bold tracking-[0.4em] uppercase">
              01/
            </span>
            <span className="w-12 h-px bg-white/15" />
            <span className="hero-label text-[10px] tracking-[0.35em] text-white/30 uppercase">
              Gott Wald Holdings
            </span>
          </div>

          {/* Main title — each word is individually animated */}
          <h1
            className="font-black tracking-[-0.04em] leading-[0.82] uppercase overflow-hidden"
            style={{ fontSize: "clamp(3rem, 9.5vw, 11.5rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="hero-word block">WE TURN</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word block">
                COM
                <span className="text-white/20 italic font-serif font-light tracking-tight">
                  PLEXI
                </span>
                TY
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="hero-word block text-white/30 italic font-serif font-light"
                style={{ fontSize: "clamp(2rem,6vw,8rem)" }}
              >
                into inevitability.
              </span>
            </span>
          </h1>
        </div>

        {/* RIGHT: Editorial column — tagline + CTA */}
        <div className="hidden md:flex flex-col gap-6 max-w-[22rem] self-end pb-20 pointer-events-auto">
          {/* Thin gold rule */}
          <div className="w-8 h-px bg-gold/60 mb-2" />

          {/* Tagline — each line is clip-path masked separately */}
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="hero-tagline-line text-white/55 text-lg font-serif italic leading-[1.6]">
              One system.
            </div>
            <div className="hero-tagline-line text-white/55 text-lg font-serif italic leading-[1.6]">
              One standard.
            </div>
            <div className="hero-tagline-line text-white/55 text-lg font-serif italic leading-[1.6]">
              Outcomes that hold.
            </div>
          </div>

          {/* CTA */}
          <a
            href="/contact"
            data-magnetic
            className="hero-cta group mt-4 flex items-center gap-4 text-white/70 hover:text-gold transition-colors duration-300 w-max cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full group-hover:scale-150 transition-transform duration-300" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-transparent group-hover:border-gold/50 pb-1 transition-all duration-300">
              Request a Strategic Conversation
            </span>
          </a>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto z-10 opacity-0"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-bold">
          Scroll
        </span>
        <div className="relative flex items-center justify-center">
          <div className="scroll-ring absolute w-8 h-8 rounded-full border border-white/15" />
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            <svg
              className="scroll-chevron w-3 h-3 text-white/40"
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
