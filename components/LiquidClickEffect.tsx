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
  
  const mouse = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, lastTime: 0, velocity: 0 });
  const state = useRef({ intensity: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 2;
    isLowEndRef.current = cores <= 2;
  }, []);

  useEffect(() => {
    if (isLowEndRef.current) return;

    const turbulence = document.getElementById("liquid-turbulence");
    const displacement = document.getElementById("liquid-displacement");
    const rippleDiv = rippleRef.current;
    if (!turbulence || !displacement || !rippleDiv) return;

    const xSetter = gsap.quickSetter(rippleDiv, "x", "px");
    const ySetter = gsap.quickSetter(rippleDiv, "y", "px");

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - mouse.current.lastTime;
      
      if (dt > 0) {
        const dx = e.clientX - mouse.current.lastX;
        const dy = e.clientY - mouse.current.lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // velocity in px/ms
        const v = dist / dt;
        mouse.current.velocity = Math.min(v, 5); // cap raw velocity
      }
      
      mouse.current.lastX = e.clientX;
      mouse.current.lastY = e.clientY;
      mouse.current.lastTime = now;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleClick = () => {
      // Sudden burst of intensity on click
      state.current.intensity += 1.5;
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });

    const tick = () => {
      // Natural decay of mouse velocity
      mouse.current.velocity *= 0.9;
      
      // Target intensity driven by mouse speed
      const targetIntensity = Math.min(mouse.current.velocity * 0.8, 1.2);
      
      // Smoothly approach target intensity, or decay if click burst
      if (state.current.intensity > targetIntensity) {
         state.current.intensity *= 0.92; // decay burst
      } else {
         state.current.intensity += (targetIntensity - state.current.intensity) * 0.1; // lerp to target
      }

      const intensity = state.current.intensity;

      if (intensity > 0.01) {
        if (rippleDiv.style.display === "none") {
          rippleDiv.style.display = "block";
        }
        
        // Follow mouse
        xSetter(mouse.current.x - 100);
        ySetter(mouse.current.y - 100);
        
        // Apply visual distortion
        const scale = 1 + intensity * 0.2;
        gsap.set(rippleDiv, {
          scale: scale,
          opacity: Math.min(intensity, 1)
        });
        
        const distortAmount = intensity * 35;
        displacement.setAttribute("scale", String(distortAmount));
        
        const freq = 0.02 + intensity * 0.01;
        turbulence.setAttribute("baseFrequency", `${freq} ${freq * 0.8}`);
      } else {
        if (rippleDiv.style.display !== "none") {
          rippleDiv.style.display = "none";
          displacement.setAttribute("scale", "0");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
