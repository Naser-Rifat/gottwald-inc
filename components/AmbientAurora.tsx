"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AmbientAurora() {
  const rootRef = useRef<HTMLDivElement>(null);
  const auroraRef1 = useRef<HTMLDivElement>(null);
  const auroraRef2 = useRef<HTMLDivElement>(null);
  const auroraRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slow, breathing organic movements using GSAP
    if (!auroraRef1.current || !auroraRef2.current || !auroraRef3.current) return;

    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      // Petrol blob
      tweens.push(gsap.to(auroraRef1.current, {
        xPercent: 30,
        yPercent: 20,
        scale: 1.2,
        rotation: 15,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }));

      // Turquoise blob
      tweens.push(gsap.to(auroraRef2.current, {
        xPercent: -30,
        yPercent: -15,
        scale: 1.5,
        rotation: -20,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }));

      // Gold blob
      tweens.push(gsap.to(auroraRef3.current, {
        xPercent: 15,
        yPercent: -25,
        scale: 1.1,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }));
    });

    // Pause the infinite tweens when the section is off-screen. The blobs
    // are big blurred radial gradients — running their transform animation
    // while invisible still costs paint/composite work.
    const root = rootRef.current;
    let observer: IntersectionObserver | null = null;
    if (root) {
      observer = new IntersectionObserver(
        ([entry]) => {
          tweens.forEach((t) =>
            entry.isIntersecting ? t.resume() : t.pause(),
          );
        },
        { threshold: 0.01 },
      );
      observer.observe(root);
    }

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
