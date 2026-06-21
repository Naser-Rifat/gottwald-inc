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

    const handleMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const layer of layersRef.current) {
        const el = layer.ref.current;
        if (!el) continue;
        gsap.to(el, {
          x: (e.clientX / w - 0.5) * layer.intensity,
          y: (e.clientY / h - 0.5) * layer.intensity,
          duration: layer.duration ?? 1.5,
          ease: layer.ease ?? "power2.out",
        });
      }
    };

    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [sectionRef]);
}
