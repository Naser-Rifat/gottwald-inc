"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Tracks the mouse globally and animates the returned ref to follow.
 * Unlike `useGhostCursor` (used in /our-work), this does NOT set
 * `document.body.style.cursor = "none"` — the system cursor stays
 * visible and the followed element is layered on top.
 */
export function useFollowCursor<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return ref;
}
