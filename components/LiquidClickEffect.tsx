"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * Localized Liquid Ripple Effect
 * Applies an SVG displacement filter only to a small area around the cursor using backdrop-filter.
 * This prevents the filter from breaking video panels or stacking contexts across the whole page.
 */
export default function LiquidClickEffect() {
  const isLowEndRef = useRef(false);
  const rippleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Detect low-end devices
    const cores = navigator.hardwareConcurrency || 2;
    isLowEndRef.current = cores <= 2;
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (isLowEndRef.current) return;

    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) return;

    const turbulence = document.getElementById("liquid-turbulence");
    const displacement = document.getElementById("liquid-displacement");
    const rippleDiv = rippleRef.current;

    if (!turbulence || !displacement || !rippleDiv) return;

    // Move the ripple div exactly to the click coordinates
    gsap.set(rippleDiv, {
      x: e.clientX - 100,
      y: e.clientY - 100,
      display: "block"
    });

    const startTime = performance.now();
    const duration = 600;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      // Intense initial ripple that quickly scales down
      const scale = (1 - ease) * 30;
      const freq = 0.02 + ease * 0.03;

      turbulence.setAttribute("baseFrequency", `${freq} ${freq * 0.8}`);
      displacement.setAttribute("scale", String(scale));

      // Expand the ripple div slightly over time
      gsap.set(rippleDiv, {
        scale: 1 + ease * 0.5,
        opacity: 1 - progress
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rippleDiv.style.display = "none";
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleClick]);

  return (
    <>
      <svg
        id="liquid-svg-filter"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <defs>
          <filter id="liquid-distort" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              id="liquid-turbulence"
              type="fractalNoise"
              baseFrequency="0.02 0.016"
              numOctaves={1}
              seed={42}
              result="noise"
            />
            <feDisplacementMap
              id="liquid-displacement"
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      
      {/* The localized ripple div that acts as a magnifying glass */}
      <div
        ref={rippleRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          pointerEvents: "none",
          display: "none",
          zIndex: 9998,
          backdropFilter: "url(#liquid-distort)",
          WebkitBackdropFilter: "url(#liquid-distort)",
          willChange: "transform, opacity"
        }}
      />
    </>
  );
}
