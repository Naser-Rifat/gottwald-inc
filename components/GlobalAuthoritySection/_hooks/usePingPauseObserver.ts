"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pauses `.animate-ping` keyframe playback while the section is off-
 * screen. CSS animations otherwise burn paint cycles on background
 * pings the user can't see.
 */
export function usePingPauseObserver(
  rootRef: RefObject<HTMLElement | null>,
  selector = ".animate-ping",
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const playState = entry.isIntersecting ? "running" : "paused";
        root.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).style.animationPlayState = playState;
        });
      },
      { threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef, selector]);
}
