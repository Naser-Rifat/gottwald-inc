"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillarCard from "./PillarCard";

gsap.registerPlugin(ScrollTrigger);

interface PillarTilesSectionProps {
  pillars: Pillar[];
}

export default function PillarTilesSection({
  pillars,
}: PillarTilesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || "";
        headlineRef.current.innerHTML = text
          .split("")
          .map(
            (char) =>
              `<span class="inline-block overflow-hidden"><span class="split-char inline-block translate-y-full">${char === " " ? "&nbsp;" : char}</span></span>`,
          )
          .join("");

        gsap.to(headlineRef.current.querySelectorAll(".split-char"), {
          y: 0,
          duration: 1,
          stagger: 0.03,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 85%",
          },
        });
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 88%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-tiles-section"
      className="flex flex-col px-gutter w-full py-[15vh]"
    >
      <div className="flex flex-col items-center text-center gap-10 mb-20 lg:mb-32 w-full">
        <div className="flex flex-col items-center w-full max-w-[95vw] px-4">
          <h2
            ref={headlineRef}
            className="text-white text-[clamp(2.5rem,6vw,9rem)] leading-[0.9] font-bold tracking-tighter uppercase mb-6 whitespace-normal md:whitespace-nowrap"
          >
            BUSINESS STANDARDS.
          </h2>
          <p
            ref={subtitleRef}
            className="text-gold text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase opacity-0"
          >
            TRUST. STRUCTURE. PERFORMANCE.
          </p>
        </div>

        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-6 lg:px-0">
          <div className="text-white/80 font-light text-[clamp(1rem,1.3vw,1.5rem)] leading-[1.7] flex flex-col gap-8 w-full">
            <p className="text-white/90">
              We build{" "}
              <strong className="font-semibold text-white">
                operating-grade systems
              </strong>{" "}
              for people and strategic assets—when outcomes must be clear,
              execution must be clean, and performance must be repeatable.
            </p>

            <div
              className="overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                maxHeight: isExpanded ? "1500px" : "0px",
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? "1rem" : "0",
              }}
            >
              <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/10 w-full max-w-3xl mx-auto text-[clamp(1rem,1.3vw,1.5rem)] text-white/90">
                <p>
                  GOTT WALD is not a collective of services. It is a unified
                  architecture: modular components, one standard, one language
                  of delivery—built to turn complexity into clarity, clarity
                  into decisions, and decisions into measurable impact.
                </p>
                <p className="text-white/90 text-4xl">
                  We don&apos;t market partnerships.
                  <br />
                  <strong className="text-white font-medium text-[clamp(1.15rem,1.6vw,1.8rem)] leading-tight block mt-3">
                    We operate them.
                  </strong>
                </p>
                <p>
                  Discreet. Stable. Security-first.
                  <br />
                  Confidentiality is not a promise—it is engineered into the
                  framework.
                </p>
                <p>
                  We don&apos;t talk about partners or projects, not out of
                  distance, but out of principle: trust compounds when it is
                  protected.
                </p>
                <p>
                  Our matrix scales without losing integrity: components evolve,
                  new layers can be added, markets can shift—yet the standard
                  remains.
                </p>
                <p>
                  At the core is a non-negotiable filter:
                  <br />
                  <strong className="text-gold font-medium tracking-[0.05em] block mt-3">
                    Peace. Love. Harmony — for more Humanity.
                  </strong>
                </p>
                <p>
                  Skill matters. Character decides.
                  <br />
                  Money is not the driver. Money is the result of alignment,
                  responsibility, and clean execution.
                </p>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-white/20 w-full max-w-3xl mx-auto"></div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group mx-auto flex items-center gap-4 text-[12px] font-bold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors mt-6 w-max"
            >
              <span className="relative overflow-hidden w-8 h-8 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/5 transition-all">
                <span className="block w-3 h-px bg-current transition-transform duration-500 absolute" />
                <span
                  className={`block w-px h-3 bg-current transition-transform duration-500 absolute ${
                    isExpanded ? "rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                />
              </span>
              <span>{isExpanded ? "Read Less" : "Discover more"}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-[2.5vw] gap-y-[8vh]"
      >
        {pillars.slice(0, 4).map((pillar, index) => (
          <PillarCard key={pillar.slug} pillar={pillar} index={index} />
        ))}
      </div>

      <Link
        href="/our-work"
        className="group mx-auto inline-flex items-center gap-4 text-white hover:text-gold transition-colors mt-12 w-fit"
      >
        <span className="text-[clamp(1rem,1vw,1.3rem)] tracking-[0.2em] uppercase font-bold">
          View all pillars
        </span>
        <span className="text-2xl font-light transform transition-transform duration-500 group-hover:translate-x-3">
          →
        </span>
      </Link>
    </section>
  );
}
