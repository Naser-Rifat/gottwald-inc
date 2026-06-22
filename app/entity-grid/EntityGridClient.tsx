"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "@/components/layout/Header";
import FooterSection from "@/components/layout/FooterSection";

import HeroSection from "./_components/HeroSection";
import EntityGridSection from "./_components/EntityGridSection";

gsap.registerPlugin(ScrollTrigger);

/**
 * EntityGridClient — orchestrator for the /entity-grid route.
 *
 * Owns the page-wide GSAP entrance choreography:
 *   - `.hero-reveal` elements get a staggered fade-up on mount.
 *   - `.entity-card` items animate in two passes — the first four
 *     cards (assumed above the fold) cascade on initial mount;
 *     the rest scroll-trigger as they enter the viewport.
 *
 * Both sections live in `_components/` and own their own markup;
 * static directory data lives in `_data/entities.ts`.
 */
export default function EntityGridClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text stagger
      gsap.fromTo(
        ".hero-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.1,
        },
      );

      // Card cascade. First 4 enter on mount (above the fold);
      // the rest scroll-trigger as they reach 85% of the viewport.
      const cards = gsap.utils.toArray(
        ".entity-card",
        containerRef.current!,
      ) as HTMLElement[];
      cards.forEach((card, i) => {
        if (i < 4) {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              force3D: true,
              clearProps: "transform",
              delay: 0.3 + i * 0.1,
            },
          );
        } else {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              force3D: true,
              clearProps: "transform",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-gold selection:text-black overflow-x-hidden"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full">
        <HeroSection />
        <EntityGridSection />
      </main>

      <FooterSection />
    </div>
  );
}
