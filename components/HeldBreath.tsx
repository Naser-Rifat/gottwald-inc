"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeldBreath — living pause between movements.
 *
 * Five sine waves, one per brand frequency (gold, silver, petrol,
 * turquoise, copper). The field responds to four signals simultaneously:
 *
 *   1. Ambient phase drift — paced by --orchestration-pace (set by
 *      LivingEnvironment from global scroll velocity). Always alive.
 *   2. Reveal envelope — a sine tent on scroll progress through the
 *      element. Waves rise from a flat line as you approach, peak at
 *      mid-pass, fall back to flat as you leave. The breath itself.
 *   3. Scroll-position phase — direct coupling. Scrubbing back/forth
 *      visibly moves the waves. The reader conducts.
 *   4. Attack-decay energy — fast scrolling bumps amplitude and line
 *      weight; rests decay them. Excitement that calms.
 *
 * Edge envelope tapers amplitude to zero at horizontal ends. Mix-blend
 * screen turns wave overlaps into light — the manifesto's "resonance"
 * rendered visible. No labels, no widgets, no typography. The field IS
 * the breath.
 */

type Band = { color: string; freq: number; amp: number; phase: number };

// Non-harmonic frequencies — the orchestra never repeats the same chord.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    // Scroll signals — written by ScrollTrigger, read by the rAF loop.
    const scrollProgressRef = { current: 0 };  // 0..1 across the element
    const energyRef = { current: 0 };           // 0..1 attack-decay velocity

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          // Attack: take the max of current energy and incoming velocity.
          // Decay happens in the rAF tick. Normalized: ~2000 px/s = full.
          const v = Math.min(Math.abs(self.getVelocity()) / 2000, 1);
          if (v > energyRef.current) energyRef.current = v;
        },
      });
    }, container);

    // Per-visit seed nudges the opening chord.
    let ambientPhase = Math.random() * Math.PI * 2;
    let lastT = performance.now();

    const draw = (revealAmount: number, energy: number) => {
      ctx.clearRect(0, 0, w, h);
      if (revealAmount < 0.01) return;

      const cy = h / 2;
      const baseAmp = h * 0.28;
      const steps = Math.max(80, Math.floor(w / 5));

      // Velocity-coupled line weight — faster scroll, thicker stroke.
      ctx.lineWidth = 1 + energy * 0.6;
      ctx.globalCompositeOperation = "screen";

      // Scroll-position phase: 6 full cycles across the element. Scrubbing
      // back and forth visibly moves the waves — direct conducting.
      const scrollPhase = scrollProgressRef.current * Math.PI * 6;

      for (const band of BANDS) {
        ctx.beginPath();
        ctx.strokeStyle = band.color;
        const k = (band.freq * Math.PI * 2) / w;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * w;
          const edgeEnvelope = Math.sin((s / steps) * Math.PI);
          const y =
            cy +
            Math.sin(x * k + ambientPhase + scrollPhase + band.phase) *
              baseAmp *
              band.amp *
              edgeEnvelope *
              revealAmount *
              (1 + energy * 0.5);
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
        // Ambient drift — paced by global orchestration var.
        const paceStr =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--orchestration-pace")
            .trim() || "11s";
        const paceSec = parseFloat(paceStr) || 11;
        // 0.35 keeps ambient drift contemplative even at fastest pace.
        ambientPhase += dt * ((Math.PI * 2) / paceSec) * 0.35;

        // Reveal envelope — sine tent on scroll progress through element.
        const p = Math.max(0, Math.min(1, scrollProgressRef.current));
        const reveal = Math.sin(p * Math.PI);

        // Decay energy each frame — exponential, ~0.5s to half.
        energyRef.current *= Math.pow(0.5, dt / 0.5);

        draw(reveal, energyRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    if (reducedMotion) {
      // Static frame at mid-reveal, no animation, no scroll coupling.
      draw(1, 0);
    } else {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      gsapCtx.revert();
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
