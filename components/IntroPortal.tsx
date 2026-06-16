"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import IntroPortalCanvas from "./IntroPortalCanvas";

export default function IntroPortal() {
  const portalRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen to the global loading progress from loadingGroup.ts
  useEffect(() => {
    const handleComplete = () => setIsLoaded(true);

    window.addEventListener("loading-complete", handleComplete);
    return () => {
      window.removeEventListener("loading-complete", handleComplete);
    };
  }, []);

  // Stop scrolling while portal is active
  useEffect(() => {
    if (mounted && isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, isVisible]);

  // Entrance animation for the canvas background
  useEffect(() => {
    if (!mounted || !isVisible || !portalRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Initial state
      gsap.set(orbRef.current, { opacity: 0 });
      gsap.set(".portal-reveal", { y: 20, opacity: 0 });

      // Canvas container fades in quickly at start
      tl.to(orbRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      });
      
    }, portalRef);

    return () => ctx.revert();
  }, [mounted, isVisible]);

  // Entrance animation for the text content (triggers when loading is complete)
  useEffect(() => {
    if (!isLoaded || !portalRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Text and buttons fade up
      tl.to(".portal-reveal", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      }, "-=0.2");
    }, portalRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const handleStart = () => {
    // Mark that portal was visited so Home hero adds a breath delay
    sessionStorage.setItem("portal-visited", "true");

    // Trigger wormhole shader animation
    window.dispatchEvent(new CustomEvent("portal-start"));
    
    // Animate out
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsVisible(false)
      });
      
      // Text disappears
      tl.to(".portal-reveal", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.in"
      });
      
      // Portal fades out at the very end of the wormhole jump
      tl.to(orbRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "+=0.9"); // Wait 0.9s for the zoom to swallow the screen
      
      // Background fades out
      tl.to(portalRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, "-=0.4");
    }, portalRef);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div
      ref={portalRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040404] text-white"
    >
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Portal WebGL Background */}
      <div
        ref={orbRef}
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none z-0"
        style={{ transformOrigin: "center center" }}
      >
        <IntroPortalCanvas />
      </div>

      {/* Centered Content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        
        {/* Eyebrow */}
        <div className="portal-reveal mb-6">
          <span className="text-[12px] sm:text-[14px] tracking-[0.4em] uppercase text-white/70 font-semibold">
            THE STANDARD OF
          </span>
        </div>

        {/* Main Title */}
        <h1 className="portal-reveal text-[clamp(2.5rem,8vw,8rem)] leading-[0.95] font-light tracking-[-0.03em] uppercase text-white mb-6">
          GOTT WALD<br/>HOLDING
        </h1>

        {/* Subtitle */}
        <div className="portal-reveal mb-12">
          <span className="text-[12px] sm:text-[14px] tracking-[0.35em] uppercase text-white/80 font-medium">
            EST. 2024 &nbsp;·&nbsp; TBILISI, GEORGIA
          </span>
        </div>

        {/* Start Button */}
        <div className="portal-reveal group relative cursor-pointer inline-block mb-8" onClick={handleStart}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 group-hover:border-turquoise transition-colors duration-300" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 group-hover:border-turquoise transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 group-hover:border-turquoise transition-colors duration-300" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 group-hover:border-turquoise transition-colors duration-300" />
          
          <div className="px-12 py-5 bg-transparent group-hover:bg-white/5 transition-colors duration-300">
            <span className="text-[12px] tracking-[0.25em] uppercase font-bold text-white">
              START EXPERIENCE
            </span>
          </div>
        </div>

        {/* Skip Link */}
        <div className="portal-reveal cursor-pointer group" onClick={handleStart}>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 group-hover:text-white/70 transition-colors">
            ENTER QUIETLY
          </span>
        </div>

      </div>
    </div>
  );
}
