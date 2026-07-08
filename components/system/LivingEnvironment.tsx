"use client";

import { useEffect } from "react";

/**
 * LivingEnvironment — site-wide manifesto wiring.
 *
 * Mounts in the root layout and:
 *  - Sets `data-time-of-day` on <html> (Move A)
 *  - Drives the orchestration thread's pace from scroll velocity (Move D)
 *  - Tracks section dwell and adds .dwell-deepened (Move B)
 *  - Seeds per-visit animation phase offsets (Move E)
 *
 * Single source of truth for the "living frequency space" behaviors. Pages
 * don't re-implement these. The orchestration thread reads section
 * boundaries via `section[data-journey]` — pages opt into the journey by
 * adding that attribute to their sections.
 */
export default function LivingEnvironment() {
  // MOVE A — Time-of-day data-attribute on <html>. CSS reads it from
  // globals.css and applies a barely-perceptible body::before tint.
  useEffect(() => {
    const apply = () => {
      const h = new Date().getHours();
      const period =
        h < 5  ? "deep-night" :
        h < 9  ? "dawn" :
        h < 12 ? "morning" :
        h < 16 ? "afternoon" :
        h < 19 ? "dusk" :
        h < 22 ? "evening" :
                 "deep-night";
      document.documentElement.dataset.timeOfDay = period;
    };
    apply();
    const id = window.setInterval(apply, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  // MOVE B — Dwell-responsive deepening. Sections that are ≥50% in view
  // for ≥10s receive a permanent .dwell-deepened class.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    const DWELL_MS = 10000;
    const timers = new Map<Element, number>();

    const observe = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-journey]",
      );
      if (sections.length === 0) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              if (
                !timers.has(entry.target) &&
                !entry.target.classList.contains("dwell-deepened")
              ) {
                const t = window.setTimeout(() => {
                  entry.target.classList.add("dwell-deepened");
                  timers.delete(entry.target);
                }, DWELL_MS);
                timers.set(entry.target, t);
              }
            } else {
              const t = timers.get(entry.target);
              if (t !== undefined) {
                window.clearTimeout(t);
                timers.delete(entry.target);
              }
            }
          });
        },
        { threshold: [0.5] },
      );
      sections.forEach((s) => observer.observe(s));
      return observer;
    };

    // Re-observe on route changes by polling once briefly after mount —
    // covers Next App Router transitions that swap section nodes.
    let observer = observe();
    const retryId = window.setTimeout(() => {
      if (!observer) observer = observe();
    }, 600);

    return () => {
      window.clearTimeout(retryId);
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      observer?.disconnect();
    };
  }, []);

  // MOVE D — Scroll-velocity-aware orchestration pace.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    const samples: number[] = [];
    const MAX_SAMPLES = 6;
    let rafId: number | null = null;
    let scrollEndTimer: number | null = null;

    const applyPace = () => {
      rafId = null;
      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      const dt = now - lastT;
      const v = dt > 0 ? (dy / dt) * 1000 : 0;
      samples.push(v);
      if (samples.length > MAX_SAMPLES) samples.shift();
      const avg =
        samples.reduce((a, b) => a + b, 0) / Math.max(samples.length, 1);

      let duration: number;
      if (avg < 100) duration = 13;
      else if (avg < 350) duration = 10;
      else if (avg < 900) duration = 7;
      else if (avg < 2000) duration = 5;
      else duration = 3.5;

      document.documentElement.style.setProperty(
        "--orchestration-pace",
        `${duration}s`,
      );
      lastY = y;
      lastT = now;
    };

    const onScroll = () => {
      if (rafId === null) rafId = window.requestAnimationFrame(applyPace);
      if (scrollEndTimer !== null) window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        samples.length = 0;
        document.documentElement.style.setProperty(
          "--orchestration-pace",
          "11s",
        );
      }, 1200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (scrollEndTimer !== null) window.clearTimeout(scrollEndTimer);
    };
  }, []);

  // MOVE E — Per-visit generative seed nudges animation start-phase.
  useEffect(() => {
    const root = document.documentElement;
    const seed = Math.random();
    root.style.setProperty(
      "--rand-phase-orchestration",
      `${(seed * -0.55).toFixed(3)}s`,
    );
    root.style.setProperty(
      "--rand-phase-signal",
      `${(seed * -0.75).toFixed(3)}s`,
    );
    root.style.setProperty(
      "--rand-phase-breath",
      `${(seed * -0.35).toFixed(3)}s`,
    );
  }, []);

  return null;
}
