"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import PillarCard from "@/components/PillarCard";
import PillarListRow from "@/components/PillarListRow";
import FooterSection from "@/components/FooterSection";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillarFluidCanvas from "@/components/PillarFluidCanvas";

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
  const cursorRef = useRef<HTMLDivElement>(null);

  // Custom Cursor Mouse Tracking
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("mousemove", moveCursor);
    
    // Hide default cursor on body when hovering inside the container
    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on the headline
      gsap.to(headlineRef.current, {
        y: "-15vh",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

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
      className="bg-[#050505] min-h-screen text-white font-sans overflow-hidden selection:bg-gold selection:text-black relative"
      style={{ cursor: 'none' }}
    >
      {/* Interactive WebGL Fluid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-70">
        <PillarFluidCanvas 
          colorBase="#020305"
          colorPetrol="#0a1a2a"
          colorTurquoise="#1a2b3c"
          className="absolute inset-0 z-0 mix-blend-screen"
        />
      </div>

      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="min-h-screen relative z-10 pt-[22vh] pb-[20vh] px-gutter w-full max-w-[1800px] mx-auto">
        
        {/* Cinematic Hero Section */}
        <section className="flex flex-col relative mb-[15vh]">
          {/* Dynamic Typography Header */}
          <div className="w-full mb-16 relative z-20 mix-blend-overlay">
            <h1
              ref={headlineRef}
              className="text-white text-[clamp(5rem,10vw,12rem)] leading-[0.85] font-black tracking-[-0.03em] uppercase overflow-hidden"
            >
              <span className="block overflow-hidden pb-4">
                <span className="word-wrap block bg-gradient-to-br from-white via-white/90 to-white/30 bg-clip-text text-transparent">All</span>
              </span>
              <span className="block overflow-hidden">
                <span className="word-wrap block bg-gradient-to-br from-white via-white/80 to-white/20 bg-clip-text text-transparent">Pillars.</span>
              </span>
            </h1>
            
            <div className="absolute top-8 right-0 md:right-12 xl:right-32 flex flex-col items-end hidden sm:flex">
              <span
                ref={counterRef}
                className="text-white/20 text-[clamp(6rem,12vw,14rem)] font-black leading-none opacity-0 mix-blend-overlay"
              >
                {String(pillars.length).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {/* Editorial Architectural Split Block */}
          <div className="w-full flex flex-col lg:flex-row relative z-30 mt-12 sm:mt-0 lg:mt-[5vh] gap-12 lg:gap-24 mb-32 pointer-events-auto">
            
            {/* Left Column: The Sticky Anchor */}
            <div className="w-full lg:w-[40%] relative">
              <div className="lg:sticky lg:top-40 flex flex-col">
                <div className="w-12 h-[2px] bg-[#d4af37]/60 mb-6" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4">Business Standards</p>
                <p className="text-[#d4af37] font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-widest uppercase max-w-sm">
                  Trust.<br/>Structure.<br/>Performance.
                </p>
              </div>
            </div>

            {/* Right Column: The Details */}
            <div className="w-full lg:w-[60%] flex flex-col">
              {/* Structural Divider */}
              <div className="w-full h-[1px] bg-white/20 mb-10" />

              <div className="flex flex-col gap-12 sm:gap-16">
                
                {/* Main Statement */}
                <p className="text-white text-[clamp(1.2rem,1.5vw,1.6rem)] font-light leading-relaxed tracking-wide">
                  We build operating-grade systems for people and strategic assets—when outcomes must be clear, execution must be clean, and performance must be repeatable.
                </p>

                {/* Thin hairline divider */}
                <div className="w-full h-[1px] bg-white/10" />

                {/* Sub-sections */}
                <div className="space-y-12 text-white/80 text-base sm:text-[1.1rem] font-light">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4 sm:gap-8">
                    <strong className="text-white/50 font-medium tracking-widest text-[11px] uppercase mt-1.5">Architecture</strong>
                    <p className="leading-relaxed">
                      <span className="text-white font-medium block mb-2">GOTT WALD is not a collection of services.</span>
                      It is a unified architecture: modular components, one standard, one language of delivery—built to turn complexity into clarity, clarity into decisions, and decisions into measurable impact.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4 sm:gap-8">
                    <strong className="text-white/50 font-medium tracking-widest text-[11px] uppercase mt-1.5">Operation</strong>
                    <div className="flex flex-col gap-1">
                      <p className="text-white/70">We don’t market partnerships.</p>
                      <p className="text-[#d4af37] font-medium text-xl">We operate them.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4 sm:gap-8">
                    <strong className="text-white/50 font-medium tracking-widest text-[11px] uppercase mt-1.5">Security</strong>
                    <p className="leading-relaxed">
                      <span className="text-white font-medium block mb-2">Discreet. Stable. Security-first.</span>
                      Confidentiality is not a promise—it is engineered into the framework.<br/><br/>
                      We don’t talk about partners or projects, not out of distance, but out of principle: trust compounds when it is protected.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4 sm:gap-8">
                    <strong className="text-white/50 font-medium tracking-widest text-[11px] uppercase mt-1.5">Scale</strong>
                    <p className="leading-relaxed">
                      Our matrix scales without losing integrity: components evolve, new layers can be added, markets can shift—yet the standard remains.
                    </p>
                  </div>
                </div>

                {/* Heavy Divider */}
                <div className="w-full h-[2px] bg-[#d4af37]/40 my-2" />

                {/* Filter Core Section */}
                <div className="flex flex-col gap-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">At the core is a non-negotiable filter:</p>
                  <p className="text-white font-light text-2xl sm:text-[2rem] leading-snug tracking-wide">
                    Peace. Love. Harmony <br/>
                    <span className="text-[#d4af37] italic text-xl sm:text-2xl mt-2 block">— for more Humanity.</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4 sm:gap-8 mt-4">
                    <strong className="text-white/50 font-medium tracking-widest text-[11px] uppercase mt-1.5">Filter</strong>
                    <p className="text-white/70 text-base sm:text-[1.1rem] leading-relaxed">
                      <span className="text-white block mb-2 font-medium tracking-wide">Skill matters. Character decides.</span>
                      Money is not the driver. Money is the result of alignment, responsibility, and clean execution.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Sticky Sidebar List Layout */}
        <section className="w-full relative z-20 mt-20 sm:mt-32 flex flex-col md:flex-row gap-12 md:gap-24 mb-16">
          
          {/* Sticky Left Sidebar */}
          <div className="w-full md:w-[30%] lg:w-[25%] relative">
            <div className="md:sticky md:top-40 flex flex-col gap-4">
               <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/50">Our Pillars</h2>
               <div className="w-8 h-[1px] bg-[#d4af37]/60" />
               <p className="text-white/60 text-sm font-light leading-relaxed mt-4 hidden md:block pr-4">
                 Explore the architectural components that form our unified operating system.
               </p>
            </div>
          </div>

          {/* Scrollable Right List */}
          <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col">
            <div className="w-full border-t border-white/20" /> {/* Top Border for the whole list */}
            {pillars.map((pillar, index) => (
              <PillarListRow key={pillar.slug} pillar={pillar} index={index} />
            ))}
            <div className="w-full border-t border-white/20" /> {/* Bottom Border for the whole list */}
          </div>
        </section>
      </main>

      <FooterSection />

      {/* Custom Cursor Bubble */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white/50 pointer-events-none z-[100] flex flex-col items-center justify-center mix-blend-screen transition-all duration-300 ease-out backdrop-blur-md border border-white/20"
        id="custom-cursor"
      >
        <span className="opacity-0 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-opacity duration-300">View</span>
      </div>
    </div>
  );
}
