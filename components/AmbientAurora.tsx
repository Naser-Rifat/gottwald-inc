"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AmbientAurora() {
  const auroraRef1 = useRef<HTMLDivElement>(null);
  const auroraRef2 = useRef<HTMLDivElement>(null);
  const auroraRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slow, breathing organic movements using GSAP
    if (!auroraRef1.current || !auroraRef2.current || !auroraRef3.current) return;

    const ctx = gsap.context(() => {
      // Petrol blob
      gsap.to(auroraRef1.current, {
        xPercent: 30,
        yPercent: 20,
        scale: 1.2,
        rotation: 15,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Turquoise blob
      gsap.to(auroraRef2.current, {
        xPercent: -30,
        yPercent: -15,
        scale: 1.5,
        rotation: -20,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Gold blob
      gsap.to(auroraRef3.current, {
        xPercent: 15,
        yPercent: -25,
        scale: 1.1,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mask */}
      <div className="absolute inset-0 bg-black/40 z-20 backdrop-blur-3xl" />
      
      {/* Blob Container (Behind Mask) */}
      <div className="absolute inset-0 z-10 mix-blend-screen opacity-40">
        {/* Petrol Blob */}
        <div 
          ref={auroraRef1}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(0,109,132,0.8) 0%, rgba(0,109,132,0) 70%)" }}
        />
        
        {/* Turquoise Blob */}
        <div 
          ref={auroraRef2}
          className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vh] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(18,168,172,0.6) 0%, rgba(18,168,172,0) 70%)" }}
        />

        {/* Subtle Gold Blob */}
        <div 
          ref={auroraRef3}
          className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vh] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0) 70%)" }}
        />
      </div>
    </div>
  );
}
