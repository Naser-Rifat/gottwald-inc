"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap-bootstrap";

export interface ParallaxLayer {
  /** CSS selector for elements that should drift with the cursor. */
  selector: string;
  /** Maximum pixel offset at the edges of the viewport. */
  intensity: number;
  /** Tween duration in seconds. Defaults vary so layers feel decoupled. */
  duration?: number;
  /** GSAP ease string. */
  ease?: string;
}

/**
 * Site-wide background mouse parallax. The about / careers / contact /
 * partnerships orchestrators each used to inline an identical
 * `mousemove → gsap.to(.watermark) + gsap.to(.aurora)` pair; this hook
 * replaces all four copies.
 *
 * Behaviour:
 *  - **rAF-gated.** Mousemove fires faster than the browser repaints;
 *    we coalesce multiple events into one `gsap.to` per frame instead
 *    of creating 60+ tweens per second. `lastX`/`lastY` capture the
 *    most recent cursor position; the rAF callback reads them.
 *  - **Passive listener.** Lets the browser scroll without waiting on
 *    our handler.
 *  - **Honours `prefers-reduced-motion`.** When the OS preference is
 *    set, the listener is never attached at all — no `gsap.set` reset
 *    is needed because the layers stay at their static position.
 *  - **Layers ref.** The layers array passed in is captured in a ref
 *    on every render so callers can pass fresh array literals without
 *    re-running the effect (no listener thrash).
 */
export function useBackgroundMouseParallax(layers: ParallaxLayer[]) {
  const layersRef = useRef(layers);
  useEffect(() => {
    layersRef.current = layers;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let lastX = 0;
    let lastY = 0;
    let pending = false;
    let rafId = 0;

    const flush = () => {
      pending = false;
      const px = lastX / window.innerWidth - 0.5;
      const py = lastY / window.innerHeight - 0.5;
      for (const layer of layersRef.current) {
        gsap.to(layer.selector, {
          x: px * layer.intensity,
          y: py * layer.intensity,
          duration: layer.duration ?? 1.5,
          ease: layer.ease ?? "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
