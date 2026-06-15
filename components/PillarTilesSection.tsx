"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillarFluidCanvas from "./PillarFluidCanvas";

gsap.registerPlugin(ScrollTrigger);

interface PillarTilesSectionProps {
  pillars: Pillar[];
}

export default function PillarTilesSection({ pillars }: PillarTilesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // We use CSS variables to smoothly transition complex radial gradients via an overlay fade
  const [activeSlide, setActiveSlide] = useState(0);

  // We take max 8 pillars for this layout
  const displayPillars = pillars.slice(0, 8);
  const totalSlides = displayPillars.length + 1;

  // Dynamic Aurora Colors based on API Theme [Color 1, Color 2, Color 3]
  const auroraColors = useMemo(() => {
    const colors = [
      ["#0a0b1a", "#1a0b2e", "#051a3a"], // Intro (Deep Space/Sci-Fi)
    ];
    displayPillars.forEach(pillar => {
      const accent = pillar.theme?.accent || "#d4af37";
      // We use the accent color for the glowing orbs to create a rich aura
      colors.push([accent, accent, accent]); 
    });
    return colors;
  }, [displayPillars]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Create master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalSlides * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Initially set background to Slide 0 (handled by React state `activeSlide` inline style, but we can set it to transparent or just leave it)
      // gsap.set(bgRef.current, { backgroundColor: 'transparent' });

      // Build the scrubbing animations for each transition
      for (let i = 1; i <= displayPillars.length; i++) {
        const prevSlide = `.slide-${i - 1}`;
        const currentSlide = `.slide-${i}`;
        
        // Add a label for this transition
        tl.addLabel(`transition-${i}`);
        
        // 1. Fade out previous slide (fast exit)
        tl.to(prevSlide, { 
          opacity: 0, 
          y: -60, 
          duration: 0.6, 
          ease: "power2.in" 
        }, `transition-${i}`);
        
        // 2. Change background color halfway through the transition
        tl.to({}, { 
          duration: 0.1,
          onStart: () => setActiveSlide(i)
        }, `transition-${i}+=0.5`);
        
        // 3. Fade in current slide (after prev slide has exited)
        tl.fromTo(currentSlide, 
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
          `transition-${i}+=0.6`
        );
        
        // 4. Hold the slide so the user can read it before the next transition
        tl.to({}, { duration: 0.5 });
      }
      
    }, sectionRef);

    return () => ctx.revert();
  }, [displayPillars.length]);

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
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-tiles-section"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white bg-[#0a0e16]"
    >
      {/* Aurora Background Layer with Subtle Wave */}
      <div className="absolute inset-0 z-0 overflow-hidden mix-blend-screen opacity-60">
        <PillarFluidCanvas 
          colorBase="#000000"
          colorPetrol={auroraColors[activeSlide]?.[0]}
          colorTurquoise={auroraColors[activeSlide]?.[1]}
          className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50 transition-colors duration-1000"
        />
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen blur-[120px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: auroraColors[activeSlide][0] }}
        />
        <div 
          className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] rounded-full mix-blend-screen blur-[120px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: auroraColors[activeSlide][1] }}
        />
        <div 
          className="absolute bottom-[-20%] left-[20%] w-[70%] h-[50%] rounded-full mix-blend-screen blur-[120px] transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: auroraColors[activeSlide][2] }}
        />
      </div>

      {/* Premium Horizontal Progress Indicator (Bottom Center) */}
      <div 
        className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 mix-blend-screen pointer-events-none transition-opacity duration-700 ease-in-out ${activeSlide > 0 ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50">
          {String(Math.max(1, activeSlide)).padStart(2, "0")}
        </span>
        <div className="w-24 sm:w-40 h-[1px] bg-white/20 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${(Math.max(1, activeSlide) / displayPillars.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50">
          {String(displayPillars.length).padStart(2, "0")}
        </span>
      </div>

      {/* SLIDE 0: Intro */}
      <div className="absolute inset-0 z-10 flex flex-col items-center slide-0 px-6 w-full text-center h-full overflow-y-auto custom-scrollbar mix-blend-screen">
        
        {/* Initial Viewport (Sci-Fi Minimal Intro) */}
        <div className="relative w-full min-h-[100vh] flex flex-col items-center justify-center shrink-0">
          
          {/* Centered Minimal Content */}
          <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/80 font-mono mb-6">
            Standards-Led Architecture
          </span>
          
          <h1 className="text-[clamp(1.5rem,3.5vw,4rem)] font-light uppercase tracking-widest leading-[1.3] max-w-5xl text-white">
            We build <span className="font-medium text-white">operating-grade systems</span> helping businesses scale cleanly.
          </h1>

          {/* Rotating "Scroll to discover" Circle */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mt-16">
            <div className="absolute inset-0 border border-white/20 rounded-full" />
            <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] fill-white/80 font-mono">
                <textPath href="#circlePath" startOffset="0%">
                  SCROLL TO DISCOVER • SCROLL TO DISCOVER • 
                </textPath>
              </text>
            </svg>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full" />
          </div>
        </div>

        {/* Content Below the Fold */}
        <div className="w-full max-w-5xl mx-auto pb-32 flex flex-col items-center">
          {/* Huge Title */}
          <h2 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-tighter leading-[0.9] mb-4 sm:mb-6 drop-shadow-2xl">
            BUSINESS STANDARDS.
          </h2>

          {/* Subtitle */}
          <p className="text-[9px] sm:text-[11px] tracking-[0.5em] text-[#00a8cc] font-bold uppercase mb-10 sm:mb-16">
            Trust. Structure. Performance.
          </p>

          {/* Two Column Grid for Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-[11px] sm:text-xs md:text-sm text-white/60 font-light text-left w-full mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <p className="leading-relaxed">
                GOTT WALD is not a collection of services. It is a unified architecture: modular components, one standard, one language of delivery—built to turn complexity into clarity, clarity into decisions, and decisions into measurable impact.
              </p>
              <div className="pl-4 border-l border-[#d4af37]/30">
                <p className="mb-1 uppercase tracking-widest text-[9px] text-white/40">Our Approach</p>
                <p className="leading-relaxed text-white/80">We don't market partnerships.</p>
                <p className="text-white font-medium text-base sm:text-lg">We operate them.</p>
              </div>
              <p className="leading-relaxed">
                We don't talk about partners or projects, not out of distance, but out of principle: trust compounds when it is protected.
              </p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <p className="leading-relaxed">
                <span className="text-white font-medium tracking-wide">Discreet. Stable. Security-first.</span><br/>
                Confidentiality is not a promise—it is engineered into the framework.
              </p>
              <p className="leading-relaxed">
                Our matrix scales without losing integrity: components evolve, new layers can be added, markets can shift—yet the standard remains.
              </p>
              <div className="p-4 sm:p-6 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-3">At the core is a non-negotiable filter:</p>
                <p className="text-[#d4af37] font-medium text-sm sm:text-base leading-relaxed mb-4">
                  Peace. Love. Harmony — for more Humanity.
                </p>
                <p className="leading-relaxed text-white/70">
                  <span className="text-white">Skill matters. Character decides.</span><br/>
                  Money is not the driver. Money is the result of alignment, responsibility, and clean execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDES 1 to N: Pillars */}
      {displayPillars.map((pillar, idx) => {
        const slideIndex = idx + 1;
        return (
          <div 
            key={pillar.slug} 
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center slide-${slideIndex} opacity-0 pointer-events-none px-6 sm:px-12 py-24 mix-blend-screen`}
          >
            {/* TALL Stacked Background Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden select-none opacity-[0.08]">
              <div 
                className="flex flex-col items-center justify-center text-[12vw] sm:text-[8vw] font-black uppercase leading-[0.85] tracking-widest text-white"
                style={{ transform: 'scaleY(2)' }}
              >
                {pillar.title.split(' ').map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </div>
            </div>

            {/* Center Image Floating */}
            {pillar.image && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20"
              >
                <div 
                  className="relative w-[60vw] max-w-[700px] aspect-square"
                  style={{ animation: "float 6s ease-in-out infinite" }}
                >
                  <Image 
                    src={`/images/pillars/${slideIndex}.png`}
                    alt={pillar.title}
                    fill
                    className="object-contain mix-blend-screen contrast-125 brightness-110"
                    style={{ 
                      maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)'
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                  
                  {/* Invisible Link Area that triggers Custom Cursor */}
                  <Link 
                    href={`/pillars/${pillar.slug}`}
                    className="absolute inset-0 z-30 cursor-none"
                    onMouseEnter={() => {
                      if (cursorRef.current) {
                        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
                      }
                    }}
                    onMouseLeave={() => {
                      if (cursorRef.current) {
                        gsap.to(cursorRef.current, { opacity: 0, scale: 0.2, duration: 0.3, ease: "power2.inOut" });
                      }
                    }}
                  >
                    <span className="sr-only">Learn more about {pillar.title}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom Left: Title */}
            <div className="absolute bottom-12 left-6 sm:left-12 max-w-md pointer-events-auto z-30">
              <div className="flex flex-col gap-2 mb-2">
                <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase font-bold">
                  Pillar {String(slideIndex).padStart(2, "0")}
                </span>
                <div className="w-12 h-px bg-white/30" />
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold uppercase leading-[1.1] tracking-tight">
                {pillar.title}
              </h3>
            </div>

            {/* Bottom Right: Description */}
            <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-12 max-w-[320px] sm:max-w-[400px] pointer-events-auto z-30">
              <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <p className="text-white/95 text-[11px] sm:text-sm leading-[1.7] text-right font-light tracking-wide">
                  {pillar.details || "Designed to digitally preserve the foundation with immersive UX, engaging storytelling, and scalable architecture."}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating Animation Keyframes injected globally */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />

      {/* Custom Cursor Bubble */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-white/10 backdrop-blur-md pointer-events-none z-[100] flex flex-col items-center justify-center opacity-0 scale-0"
      >
        <span className="text-xl leading-none font-light text-white mb-1">↗</span>
        <span className="text-[9px] tracking-widest uppercase font-bold text-white">
          Learn More
        </span>
      </div>
    </section>
  );
}
