"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  /** Pre-load margin so the target hydrates slightly before entering the
   *  viewport. Mirrors IntersectionObserver's `rootMargin` syntax. */
  rootMargin?: string;
  /** Intersection ratio at which the element flips to "in view". */
  threshold?: number;
};

/**
 * Sticky IntersectionObserver hook — returns `true` once `ref` has
 * intersected the viewport for the first time, and stays true forever
 * after. Used to gate the mount of heavy children (WebGL canvases,
 * dynamically-imported chunks) so they pay their parse cost only when
 * the user is about to see them, never reverting on scroll-out.
 *
 * Pairs with `next/dynamic` + `{ ssr: false }` to defer the import too
 * — the dynamic chunk is fetched the moment this flips, not on mount.
 */
export function useInViewOnce(
  ref: RefObject<Element | null>,
  { rootMargin = "200px", threshold = 0 }: Options = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, inView]);

  return inView;
}
