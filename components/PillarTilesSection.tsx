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
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Aurora Blob Refs
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  
  // We use CSS variables to smoothly transition complex radial gradients via an overlay fade
  const [activeSlide, setActiveSlide] = useState(0);

  // We take max 8 pillars for this layout
  const displayPillars = pillars.slice(0, 8);
  // Number of slides is exactly the number of pillars
  const totalSlides = displayPillars.length;

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

      // Show slide 1 immediately
      gsap.set('.slide-1', { autoAlpha: 1, y: 0, scale: 1 });
      setActiveSlide(1);

      // Build the scrubbing animations for transitions starting from slide 2
      for (let i = 2; i <= displayPillars.length; i++) {
        const prevSlide = `.slide-${i - 1}`;
        const currentSlide = `.slide-${i}`;
        
        // Add a label for this transition
        tl.addLabel(`transition-${i}`);
        
        // 1. Fade out previous slide (fast exit)
        tl.to(prevSlide, { 
          autoAlpha: 0, 
          y: -60, 
          duration: 0.5, 
          ease: "power2.in" 
        }, `transition-${i}`);
        
        // 2. Change background color halfway through the transition
        tl.to({}, { 
          duration: 0.1,
          onStart: () => setActiveSlide(i),
          onReverseComplete: () => setActiveSlide(i - 1)
        }, `transition-${i}+=0.4`);
        
        // 3. Fade in current slide (starts exactly when prev finishes)
        tl.fromTo(currentSlide, 
          { autoAlpha: 0, y: 60, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          `transition-${i}+=0.5`
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

  // Removed CSS Blob animations since we are restoring WebGL
  useEffect(() => {
    // keeping custom cursor logic from above intact
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-tiles-section"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white bg-[#0a0808]"
    >
      {/* Ambient Aurora Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden mix-blend-screen opacity-60">
        <PillarFluidCanvas 
          colorBase="#000000"
          colorPetrol={auroraColors[activeSlide]?.[0] || "#006d84"}
          colorTurquoise={auroraColors[activeSlide]?.[1] || "#12a8ac"}
          className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-100 transition-colors duration-1000"
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



      {/* SLIDES 1 to N: Pillars */}
      {displayPillars.map((pillar, idx) => {
        const slideIndex = idx + 1;
        return (
          <div 
            key={pillar.slug} 
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center slide-${slideIndex} opacity-0 invisible pointer-events-none px-6 sm:px-12 py-24 mix-blend-screen overflow-hidden`}
          >
            {/* Massive Horizontal Watermark Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden select-none opacity-[0.03]">
              <h2 
                className="text-[20vw] sm:text-[16vw] font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap"
              >
                {pillar.title}
              </h2>
            </div>

            {/* Left Anchored 3D Asset */}
            {pillar.image && (
              <div 
                className="absolute inset-y-0 left-0 flex items-center justify-start pointer-events-auto z-20 w-[50%] overflow-visible mix-blend-screen"
              >
                <div 
                  className="relative w-[120%] h-[120%] max-h-[1000px] max-w-[1000px]"
                  style={{ animation: "slowRotateFloat 15s ease-in-out infinite" }}
                >
                  <Image 
                    src={pillar.image || `/images/pillars/${slideIndex}.png`}
                    alt={pillar.title}
                    fill
                    className="object-contain contrast-150 brightness-[1.15]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={100}
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

            {/* Right Anchored Content: Glassmorphic Card & Title */}
            <div className="absolute inset-y-0 right-6 sm:right-12 md:right-20 flex flex-col justify-center max-w-[90%] sm:max-w-[480px] pointer-events-auto z-30">
              {/* Title Section */}
              <div className="flex flex-col gap-2 mb-8 ml-2">
                <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-[#d4af37] uppercase font-bold drop-shadow-md">
                  Pillar {String(slideIndex).padStart(2, "0")}
                </span>
                <h3 className="text-4xl sm:text-6xl font-bold uppercase leading-[1.05] tracking-tight drop-shadow-lg text-white">
                  {pillar.title}
                </h3>
              </div>

              {/* Readable Box Description */}
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-7 sm:p-10 rounded-3xl relative overflow-hidden group shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
                <p className="text-white text-[14px] sm:text-[16px] leading-[1.8] font-medium tracking-wide relative z-10 drop-shadow-md">
                  {pillar.details || "Designed to digitally preserve the foundation with immersive UX, engaging storytelling, and scalable architecture."}
                </p>

                {/* Animated Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-out opacity-70" />
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
        @keyframes slowRotateFloat {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-20px) rotate(3deg) scale(1.03); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
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
