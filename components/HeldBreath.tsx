"use client";

import { useEffect, useRef } from "react";

/**
 * HeldBreath — living pause between movements.
 *
 * Five sine waves, one per brand frequency (gold, silver, petrol,
 * turquoise, copper), drift continuously across a horizontal field.
 * Pace is read from --orchestration-pace (set by LivingEnvironment from
 * scroll velocity), so the orchestra accelerates when the reader does
 * and settles when they rest. Edge envelope tapers amplitude to zero at
 * both ends — waves emerge from and dissolve into nothing. Mix-blend
 * screen turns overlaps into light — the manifesto's "resonance" made
 * visible. No labels, no widgets — the field IS the breath.
 */

type Band = { color: string; freq: number; amp: number; phase: number };

// Frequencies chosen non-harmonic so waves never line up the same way
// twice — sustained interference, never a static pattern.
const BANDS: Band[] = [
  { color: "rgba(212,175,55,0.34)",  freq: 2.1, amp: 0.55, phase: 0.0 }, // gold
  { color: "rgba(184,192,204,0.26)", freq: 3.3, amp: 0.42, phase: 0.7 }, // silver
  { color: "rgba(0,109,132,0.40)",   freq: 4.7, amp: 0.70, phase: 1.4 }, // petrol
  { color: "rgba(18,168,172,0.46)",  freq: 5.9, amp: 0.50, phase: 2.1 }, // turquoise
  { color: "rgba(192,120,64,0.30)",  freq: 7.1, amp: 0.60, phase: 2.8 }, // copper
];

export default function HeldBreath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    // Per-visit seed nudges starting phase so the orchestra never opens
    // on the same chord twice.
    let phase = Math.random() * Math.PI * 2;
    let lastT = performance.now();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2;
      const baseAmp = h * 0.28;
      const steps = Math.max(80, Math.floor(w / 5));

      ctx.lineWidth = 1;
      ctx.globalCompositeOperation = "screen";

      for (const band of BANDS) {
        ctx.beginPath();
        ctx.strokeStyle = band.color;
        const k = (band.freq * Math.PI * 2) / w;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * w;
          // Sine envelope: amplitude fades to zero at edges.
          const envelope = Math.sin((s / steps) * Math.PI);
          const y =
            cy +
            Math.sin(x * k + phase + band.phase) *
              baseAmp *
              band.amp *
              envelope;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    let rafId: number | null = null;
    const tick = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 0.1);
      lastT = t;

      if (inView) {
        // --orchestration-pace is "Xs" (seconds per breath cycle), set
        // by LivingEnvironment. Faster scroll → smaller value → faster
        // phase drift. Idle → 11s → calm.
        const paceStr =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--orchestration-pace")
            .trim() || "11s";
        const paceSec = parseFloat(paceStr) || 11;
        // 0.35 multiplier keeps ambient drift contemplative even at the
        // fastest scroll pace.
        const rate = ((Math.PI * 2) / paceSec) * 0.35;
        phase += dt * rate;
        draw();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    if (reducedMotion) {
      draw();
    } else {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="w-full flex items-center justify-center py-16 lg:py-20 relative z-10 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="block h-[96px] lg:h-[120px]"
        style={{
          width: "min(78vw, 56rem)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      />
    </div>
  );
}
