"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Global liquid click ripple effect — Lusion-style.
 *
 * PERFORMANCE OPTIMIZATIONS (v2):
 * - Checks `navigator.hardwareConcurrency` — disables on ≤2 core devices
 * - Reduced distortion scale (18 → 12) and duration (500ms → 400ms)
 * - Uses `will-change: filter` only during animation, removed immediately after
 * - Skips rapid clicks (debounce via isAnimating flag)
 * - Filter removed with `removeProperty` not just "none" to clear compositor layer
 */
export default function LiquidClickEffect() {
  const isAnimatingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const isLowEndRef = useRef(false);

  useEffect(() => {
    // Detect low-end devices — skip effect entirely
    const cores = navigator.hardwareConcurrency || 2;
    isLowEndRef.current = cores <= 2;
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (isAnimatingRef.current || isLowEndRef.current) return;

    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) return;

    isAnimatingRef.current = true;

    const turbulence = document.getElementById("liquid-turbulence");
    const displacement = document.getElementById("liquid-displacement");
    const main = document.getElementById("liquid-target");

    if (!turbulence || !displacement || !main) {
      isAnimatingRef.current = false;
      return;
    }

    // Promote to compositor layer for the animation
    main.style.willChange = "filter";
    main.style.filter = "url(#liquid-distort)";

    const startTime = performance.now();
    const duration = 400;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      // Reduced distortion for better perf on mid-range devices
      const scale = (1 - ease) * 12;
      const freq = 0.01 + ease * 0.03;

      turbulence.setAttribute("baseFrequency", `${freq} ${freq * 0.8}`);
      displacement.setAttribute("scale", String(scale));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Fully remove filter and compositor promotion
        main.style.removeProperty("filter");
        main.style.removeProperty("will-change");
        isAnimatingRef.current = false;
      }
    };

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
    <svg
      id="liquid-svg-filter"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="liquid-distort" x="-5%" y="-5%" width="110%" height="110%">
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
  );
}
