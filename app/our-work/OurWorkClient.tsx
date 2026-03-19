"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import PillarCard from "@/components/PillarCard";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OurWorkClientProps {
  pillars: Pillar[];
}

export default function OurWorkClient({ pillars }: OurWorkClientProps) {
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
                <p className="text-gold text-[clamp(0.75rem,0.9vw,0.85rem)] tracking-[0.2em] font-medium uppercase">
                  Trust. Structure. Performance.
                </p>
                <span
                  ref={counterRef}
                  className="text-white/30 text-[clamp(1rem,1.2vw,1.4rem)] font-light opacity-0"
                >
                  {pillars.length}
                </span>
              </div>
            </div>

            <div className="lg:w-[55%] flex flex-col gap-8 text-white/90 text-[clamp(1.1rem,1.4vw,1.6rem)] font-light leading-relaxed max-w-2xl lg:mt-2">
              <p>
                We build{" "}
                <span className="text-white font-medium">
                  operating-grade systems
                </span>{" "}
                for people and strategic assets—when outcomes must be clear,
                execution must be clean, and performance must be repeatable.
              </p>

              <div className="pt-6 mt-2 border-t border-white/20">
                <p className="text-white/70 text-[clamp(0.95rem,1.1vw,1.2rem)] leading-relaxed">
                  Explore our full registry of structural pillars below. Each
                  one is a complete component—designed to stand alone, and
                  engineered to connect into one integrated operating system.
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
    </div>
  );
}
