"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pauses every infinite CSS animation inside `ref`'s subtree whenever
 * the element is scrolled off-screen, and resumes them when it scrolls
 * back into view.
 *
 * Targets Tailwind's `animate-[name_Xs_linear_infinite]` utilities by
 * looking for the `_infinite` substring in the class list. That's the
 * tightest selector that works without us having to tag every animated
 * element with a custom attribute.
 *
 * Why this matters: the spinning gradient blobs we sprinkle behind
 * editorial sections (about / careers / partnerships) are huge blurred
 * elements with two counter-rotating layers each. They keep recompositing
 * the same blur every frame even when the section is far above or below
 * the viewport — so the GPU is doing work for pixels nobody can see.
 * Pausing them yields scroll-time GPU back to whichever section is
 * actually on screen. The load-time TBT delta is below Lighthouse's
 * run-to-run noise; verify scroll-time impact via DevTools Performance
 * recording on `.about-liquid-aurora` paint events if you need numbers.
 *
 * Implementation notes:
 *   - Threshold 0.01 — resume as soon as a sliver enters; pause when
 *     fully off-screen.
 *   - We mutate `style.animationPlayState` directly rather than toggling
 *     a class so we don't have to coordinate with Tailwind's
 *     `animation-play-state` arbitrary-value generation.
 *   - The hook re-queries descendants on mount only. If you add new
 *     `_infinite` children dynamically, call this hook again on a child
 *     ref or pass a more specific selector. None of the current sections
 *     do that.
 */
export function usePauseAnimationsOffscreen(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animated = Array.from(
      el.querySelectorAll<HTMLElement>('[class*="_infinite"]'),
    );
    if (animated.length === 0) return;

    const setState = (state: "running" | "paused") => {
      for (const node of animated) {
        node.style.animationPlayState = state;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => setState(entry.isIntersecting ? "running" : "paused"),
      { threshold: 0.01 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);
}
