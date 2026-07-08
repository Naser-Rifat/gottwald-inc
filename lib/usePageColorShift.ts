"use client";

import { useEffect } from "react";

/**
 * usePageColorShift
 * Dispatches a `page-color-shift` event on mount so GlobalCanvas can
 * lerp its accent colour to this page's designated brand tone.
 *
 * Colors per page (from brand spec):
 *   home         → gold    #d4af37
 *   about        → silver  #b8c0cc
 *   partnerships → petrol  #006d84
 *   careers      → copper  #c07840
 *   contact      → turquoise #12a8ac
 */
export function usePageColorShift(color: string) {
  useEffect(() => {
    // Small delay so the canvas has already mounted before receiving event
    const id = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("page-color-shift", { detail: { color } })
      );
    }, 100);
    return () => clearTimeout(id);
  }, [color]);
}
