"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

export interface ParallaxLayer {
  ref: RefObject<HTMLElement | null>;
  /** Px range applied to the layer; negative = inverse direction. */
  intensity: number;
  duration?: number;
  ease?: string;
}

/**
 * Subscribes a single mousemove listener on `sectionRef` and animates
 * each layer's translation independently. Layers are read via a ref so
 * callers can pass a fresh array literal without rebinding the listener.
 */
export function useMouseParallax(
  sectionRef: RefObject<HTMLElement | null>,
  layers: ParallaxLayer[],
) {
  const layersRef = useRef(layers);
  useEffect(() => {
    layersRef.current = layers;
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // rAF-gated mousemove: many DOM mousemove events fire per frame; we
    // only need one GSAP write per paint. clientX/Y are sampled inside
    // the rAF callback to keep the latest cursor position.
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;
    let pending = false;

    const flush = () => {
      pending = false;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const layer of layersRef.current) {
        const el = layer.ref.current;
        if (!el) continue;
        gsap.to(el, {
          x: (lastX / w - 0.5) * layer.intensity,
          y: (lastY / h - 0.5) * layer.intensity,
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

    section.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      section.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sectionRef]);
}
