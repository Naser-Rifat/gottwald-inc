"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Returns a ref that flips to `true` as soon as the user clicks any
 * <a> on the page. The capture-phase listener fires before React re-
 * renders, so downstream effects can read `ref.current` and bail out
 * before the unmount cascade triggers a false scroll completion.
 */
export function useLinkClickLock(): RefObject<boolean> {
  const lockRef = useRef(false);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a")) {
        lockRef.current = true;
      }
    };
    window.addEventListener("click", handle, { capture: true });
    return () =>
      window.removeEventListener("click", handle, { capture: true });
  }, []);

  return lockRef;
}
