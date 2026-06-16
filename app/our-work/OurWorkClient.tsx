"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import PillarCard from "@/components/PillarCard";
import FooterSection from "@/components/FooterSection";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OurWorkClientProps {
  pillars: Pillar[];
}

export default function OurWorkClient({ pillars }: OurWorkClientProps) {
  const tCommon = useTranslations("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word-wrap");
        gsap.fromTo(
          words,
          { y: "110%", rotateX: -80 },
          {
            y: "0%",
            rotateX: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out",
            delay: 0.2,
          },
        );
      }

      if (counterRef.current) {
        gsap.fromTo(
          counterRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.6,
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-hidden selection:bg-gold selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="min-h-screen bg-transparent pt-[20vh] pb-[15vh]">
        <section className="flex flex-col px-gutter w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[8vw] mb-20 lg:mb-32 max-w-[1600px] mx-auto w-full">
            <div className="lg:w-1/2" style={{ perspective: "600px" }}>
              <h1
                ref={headlineRef}
                className="text-white text-[clamp(4.5rem,7vw,7rem)] leading-[0.9] font-bold tracking-[-0.02em] uppercase mb-6 overflow-hidden"
              >
                <span className="inline-block overflow-hidden">
                  <span className="word-wrap inline-block">All</span>
                </span>
                <br />
                <span className="inline-block overflow-hidden">
                  <span className="word-wrap inline-block">Pillars.</span>
                </span>
              </h1>
              <div className="flex items-center gap-4">
                <span
                  ref={counterRef}
                  className="text-white/80 text-[clamp(1rem,1.2vw,1.4rem)] font-light opacity-0"
                >
                  {pillars.length}
                </span>
              </div>
            </div>
            
            <div className="lg:w-[55%] flex flex-col gap-8 text-white/90 text-[clamp(1.05rem,1.3vw,1.4rem)] font-light leading-relaxed max-w-2xl lg:mt-2">
              <p className="text-white/90">
                We build operating-grade systems for people and strategic assets—when
                outcomes must be clear, execution must be clean, and performance must
                be repeatable.
              </p>

              <div className="pt-6 mt-2 border-t border-white/20">
                <p className="text-white/80 leading-relaxed">
                  GOTT WALD is not a collection of services. It is a unified architecture: modular components, one standard, one language of delivery—built to turn complexity into clarity, clarity into decisions, and decisions into measurable impact.
                </p>
              </div>

              <div className="pl-6 py-2 border-l-2 border-[#d4af37]/50 bg-gradient-to-r from-white/[0.02] to-transparent">
                <p className="text-[#d4af37] text-[10px] uppercase font-bold tracking-widest mb-1">Our Approach</p>
                <p className="text-white/80 text-base mb-1">We don't market partnerships.</p>
                <p className="text-white font-medium text-xl">We operate them.</p>
              </div>

              <div className="space-y-6">
                <p className="leading-relaxed text-white/80">
                  <span className="text-white font-medium tracking-wide">Discreet. Stable. Security-first.</span><br/>
                  Confidentiality is not a promise—it is engineered into the framework.
                </p>
                <p className="leading-relaxed text-white/80">
                  Our matrix scales without losing integrity: components evolve, new layers can be added, markets can shift—yet the standard remains.
                </p>
              </div>

              <div className="p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group mt-4">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-5">At the core is a non-negotiable filter:</p>
                <p className="text-[#d4af37] font-medium text-base sm:text-lg leading-relaxed mb-6 drop-shadow-md">
                  Peace. Love. Harmony — for more Humanity.
                </p>
                <p className="leading-relaxed text-white/80 text-sm sm:text-base">
                  <span className="text-white font-medium block mb-2">Skill matters. Character decides.</span>
                  Money is not the driver. Money is the result of alignment, responsibility, and clean execution.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[3.5vw] gap-y-[10vh] max-w-[1600px] mx-auto w-full">
            {pillars.map((pillar, index) => (
              <PillarCard
                key={pillar.slug}
                pillar={pillar}
                index={index}
                imageClassName="aspect-3/2 mb-6"
                titleClassName="text-white text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-tight leading-[1.1] whitespace-pre-line group-hover:text-gold transition-colors duration-500"
              />
            ))}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
