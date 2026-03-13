"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StrategicInquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Fade up the main content block
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal-up");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5 overflow-hidden font-sans flex flex-col items-center justify-center min-h-screen"
    >
      {/* Cinematic Depth: Huge abstract glow in the background */}
      <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] bg-gold/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-[95vw] lg:max-w-[85vw] mx-auto flex flex-col items-center text-center relative z-10 reveal-up">
        {/* Eyebrow */}
        <p className="text-gold text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase mb-8">
          STRATEGIC INQUIRY // PRO DIVISION
        </p>

        {/* Monolithic Heading */}
        <h2 className="text-[clamp(3.5rem,7vw,9.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-16 mix-blend-screen w-full flex flex-col items-center">
          <span className="block md:hidden">INITIATE</span>
          <span className="block md:hidden">STRATEGIC</span>
          <span className="hidden md:block">INITIATE STRATEGIC</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-[#888888] pr-[0.1em]">
            ALIGNMENT.
          </span>
        </h2>

        {/* Editorial Text Block (Expandable) */}
        <div className="flex flex-col items-center w-full mt-4">
          <div className="text-white/80 font-light text-[clamp(1rem,1.3vw,1.5rem)] leading-[1.6] flex flex-col gap-8 w-full max-w-[65ch] text-left md:text-center tracking-wide">
            <p className="text-white">
              We are currently selecting a limited number of values-aligned
              partners for our{" "}
              <strong className="font-semibold text-white">
                2030 infrastructure cycles.
              </strong>
            </p>

            <div
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] text-left md:text-center w-full`}
              style={{
                maxHeight: isExpanded ? "1500px" : "0px",
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? "1rem" : "0",
              }}
            >
              <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/10 w-full text-[clamp(1rem,1.3vw,1.5rem)] text-white/80">
                <p>
                  This channel is reserved for principals and operators who build
                  resilient systems—and who treat trust, discipline, and
                  delivery as non-negotiable.
                </p>
                <p>
                  We operate{" "}
                  <strong className="text-white font-medium">
                    discreet by default
                  </strong>{" "}
                  and{" "}
                  <strong className="text-white font-medium">
                    standards-led by design:
                  </strong>
                  <br />a governance-first framework, engineered for execution,
                  built to compound performance over time.
                  <br />
                  No noise. No public theatrics. Clean interfaces, controlled
                  access, measurable outcomes.
                </p>
                <p>
                  If your work demands precision, confidentiality, and
                  long-horizon thinking—this is the entry point.
                </p>
              </div>
            </div>

            {/* Always visible bottom separator */}
            <div className="pt-2 mt-2 border-t border-white/20 w-full block"></div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group mx-auto flex items-center gap-4 text-[12px] font-bold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors mt-8 mb-16 w-max"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/50 group-hover:border-white group-hover:bg-white/5 transition-all">
                <span className="text-xl font-light leading-none mb-0.5">
                  {isExpanded ? "−" : "+"}
                </span>
              </div>
              <span>{isExpanded ? "DISCOVER LESS" : "DISCOVER MORE"}</span>
            </button>
          </div>
        </div>

        {/* CTA Block & Proof Pills Container */}
        <div className="flex flex-col items-center mt-8 w-full">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/partnership#apply"
              className="group relative flex items-center justify-center bg-transparent border-[1.5px] border-gold rounded-full px-10 py-5 overflow-hidden w-full sm:w-max transition-colors hover:bg-gold/10"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="font-bold uppercase tracking-[0.15em] text-[13px] text-white">
                  REQUEST STRATEGIC CALL
                </span>
                <span className="text-white font-light text-xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
            <span className="italic text-white/40 text-[13px] tracking-wide leading-tight font-light text-center">
              Confidential inquiry. Values-first selection.
            </span>
          </div>

          {/* Proof Pills */}
          <div className="w-full mt-12 flex justify-center">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Confidential by default",
                "Standards-led governance",
                "Network capacity: 888±",
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-widest uppercase text-white/50 cursor-default flex items-center gap-2 font-medium transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  <span className="text-gold font-bold mb-px opacity-70">
                    ·
                  </span>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
