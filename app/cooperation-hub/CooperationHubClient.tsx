"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

export default function CooperationHubClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal header text
      gsap.fromTo(
        ".reveal-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      // Form container fade up
      gsap.fromTo(
        ".fade-up-element",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#060606] text-white flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[20vh] pb-32 px-gutter">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Left Column: Context Only */}
          <div className="lg:col-span-8 lg:col-start-3 flex flex-col pt-10">
            <span className="reveal-text block text-[10px] uppercase tracking-[0.4em] text-gold/80 font-medium mb-6">
              Directory
            </span>
            <h1 className="reveal-text text-[clamp(2.5rem,5vw,5rem)] font-black uppercase tracking-tighter leading-[0.9] text-white mb-8">
              COOPERATION HUB
            </h1>
            <div className="reveal-text w-16 h-px bg-gradient-to-r from-gold/60 to-transparent mb-10" />
            <div className="space-y-6">
              <p className="reveal-text text-white/55 text-lg lg:text-xl leading-relaxed font-light">
                A dedicated point of entry for aligned partners, operators, advisors, investors, and strategic collaborators.
              </p>
              <p className="reveal-text text-white/55 text-lg lg:text-xl leading-relaxed font-light">
                Designed for values-aligned cooperation, structured growth, and long-term execution across meaningful ventures.
              </p>
            </div>
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}
