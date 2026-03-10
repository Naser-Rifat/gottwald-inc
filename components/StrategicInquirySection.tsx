"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StrategicInquirySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Fade up the left column
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

      // 2. Smooth right-to-left scroll animation for paragraphs
      const slideElements = gsap.utils.toArray<HTMLElement>(".slide-left");
      slideElements.forEach((el, index) => {
        gsap.fromTo(
          el,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 60%",
              scrub: 1,
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
      className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5 overflow-hidden font-sans"
    >
      {/* Cinematic Depth: Huge abstract glow in the background */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-gold/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-16 xl:gap-24 relative z-10">
        {/* Left Column: Monolithic Heading */}
        <div className="flex-1 reveal-up pr-4 xl:max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase font-bold">
              Strategic Inquiry // Pro Division
            </span>
          </div>

          <h2 className="text-[clamp(4.5rem,8vw,11.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
            Initiate
            <br />
            Strategic
            <br />
            Alignment.
          </h2>
        </div>

        {/* Right Column: Original Content & CTA */}
        <div className="flex-1 xl:max-w-xl flex flex-col justify-center gap-8">
          <p className="slide-left text-white/90 font-medium text-3xl md:text-4xl leading-[1.3] pr-4">
            We are currently selecting a limited number of values-aligned
            partners for our 2030 infrastructure cycles.
          </p>

          <p className="slide-left text-white/40 text-lg md:text-xl font-light leading-relaxed pr-8">
            This channel is reserved for principals and operators who build
            resilient systems—and who treat trust, discipline, and delivery as
            non-negotiable.
          </p>

          <div className="slide-left pl-6 border-l border-white/10 my-2 text-white/30 text-base md:text-lg font-light leading-relaxed">
            <p>
              We operate{" "}
              <strong className="text-white font-medium">
                discreet by default
              </strong>{" "}
              and{" "}
              <strong className="text-white font-medium">
                standards-led by design
              </strong>
              : a governance-first framework, engineered for execution, built to
              compound performance over time. No noise. No public theatrics.
              Clean interfaces, controlled access, measurable outcomes.
            </p>
          </div>

          <p className="slide-left text-white text-xl md:text-2xl font-light leading-snug">
            If your work demands precision, confidentiality, and long-horizon
            thinking—this is the entry point.
          </p>

          {/* Execution Block */}
          <div className="slide-left flex flex-col items-start gap-8 mt-4">
            <Link
              href="/partnership#apply"
              className="group relative flex items-center justify-center bg-white text-black px-12 py-5 overflow-hidden w-full sm:w-max font-sans"
            >
              <span className="relative z-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-colors duration-500">
                Request Strategic Call
              </span>
              <span className="absolute inset-0 z-0 bg-[#e0e0e0] scale-x-0 origin-right group-hover:origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" />
            </Link>

            {/* Proof Pills */}
            <div className="w-full">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 mb-5">
                Confidential inquiry. Values-first selection.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Confidential by default",
                  "Standards-led governance",
                  "Network capacity: 888±",
                ].map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full border border-white/10 bg-transparent text-[9px] tracking-[0.2em] uppercase text-white/20 cursor-default"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
