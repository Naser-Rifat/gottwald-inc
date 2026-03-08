"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll(".reveal-item");

      gsap.fromTo(
        items,
        {
          y: 40,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-[15vh] px-[5vw] flex flex-col justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background Accent Element */}
      <div className="absolute right-[-10%] top-[40%] w-[40vw] h-[40vw] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Large Counter-Header */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="reveal-item text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium">
            02 — THE IDENTITY
          </span>
          <h2 className="reveal-item text-[clamp(3.5rem,8vw,6rem)] font-bold tracking-tighter leading-[0.9] text-white">
            LUSION.
            <br />
            EXPERIENCE
          </h2>
        </div>

        {/* Content Body (Asymmetric Offset) */}
        <div
          ref={textContainerRef}
          className="lg:col-span-7 lg:col-start-6 flex flex-col gap-10 mt-8 lg:mt-24"
        >
          <div className="reveal-item flex flex-col gap-6">
            <h3 className="text-lg md:text-xl text-white font-medium tracking-tight">
              A consciously created frequency space for 3D exploration.
            </h3>
            <div className="w-12 h-[1px] bg-white/20" />
          </div>

          <div className="flex flex-col gap-8">
            <p className="reveal-item text-md md:text-lg leading-relaxed text-white/60 font-light tracking-wide max-w-xl">
              We operate at the intersection of high-fidelity graphics and human
              resonance. The Lusion Experience is not a portfolio—it is a study
              in immersive responsibility and interactive motion.
            </p>

            <p className="reveal-item text-sm md:text-md leading-[1.8] text-white/40 font-light tracking-wide max-w-lg">
              Through our global hubs, we foster ecosystems that breathe. From
              the stability of our strategic consulting to the empathy of our
              aimed at sustainable growth.
            </p>

            <p className="reveal-item text-xl md:text-2xl leading-[1.8] text-white/50 italic font-serif tracking-wide max-w-md mt-4">
              &quot;Precision is not just a measure of distance, but a state of
              mind. Responsibility is not a burden, but a propellant.&quot;
            </p>
          </div>

          {/* Call to Action Anchor */}
          <div className="reveal-item mt-12 flex items-center gap-6 group cursor-pointer w-fit">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/5">
              <div className="w-1.5 h-1.5 bg-white rounded-full transition-transform duration-500 group-hover:scale-150" />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors">
              Explore the Manifesto
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
