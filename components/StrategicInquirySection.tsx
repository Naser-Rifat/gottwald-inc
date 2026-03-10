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
      slideElements.forEach((el) => {
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
          <h2 className="text-[clamp(4.5rem,8vw,11.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-10">
            Initiate
            <br />
            Strategic
            <br />
            Alignment.
          </h2>

          {/* New Left-Aligned CTA Block matching reference */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4 slide-left">
            <Link
              href="/partnership#apply"
              className="group relative flex items-center justify-center bg-transparent border-[1.5px] border-gold rounded-full px-8 py-4 overflow-hidden w-full sm:w-max transition-colors hover:bg-gold/10"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="font-bold uppercase tracking-widest text-[13px] text-white">
                  Request Strategic Call
                </span>
                <span className="text-white font-light text-xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
            <span className="italic text-white/40 text-[13px] tracking-wide max-w-50 leading-tight font-light">
              Confidential inquiry. Values-first selection.
            </span>
          </div>
        </div>

        {/* Right Column: Paragraphs & Pills matching reference */}
        <div className="flex-1 xl:max-w-2xl flex flex-col justify-start gap-12 xl:mt-4">
          <div className="flex flex-col gap-6">
            <p className="slide-left text-white font-medium text-[clamp(1.5rem,2.5vw,2.5rem)] leading-[1.3] pr-4 tracking-tight">
              We are currently
              <br className="hidden md:block" />
              selecting a limited
              <br className="hidden md:block" />
              number of values-
              <br className="hidden md:block" />
              aligned partners for our
              <br className="hidden md:block" />
              2030 infrastructure
              <br className="hidden md:block" />
              cycles.
            </p>

            <p className="slide-left text-white/40 text-[clamp(1rem,1.2vw,1.25rem)] font-light leading-relaxed pr-8 max-w-[90%] mt-4">
              Reserved for principals and operators whose
              <br className="hidden lg:block" />
              work demands precision, confidentiality, and
              <br className="hidden lg:block" />
              long-horizon thinking.
            </p>
          </div>

          {/* Restyled Info Pills in the right column */}
          <div className="slide-left w-full mt-4">
            <div className="flex flex-wrap gap-4">
              {[
                "Confidential by default",
                "Standards-led governance",
                "Network capacity: 888±",
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2.5 rounded-full border border-white/20 bg-transparent text-[11px] tracking-wider text-white/50 cursor-default flex items-center gap-2 italic"
                >
                  <span className="text-white/40 font-bold mb-px">·</span>
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
