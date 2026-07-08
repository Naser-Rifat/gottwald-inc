"use client";

import { useEffect } from "react";

/**
 * Sets `document.body.style.overflow = "hidden"` while `locked` is true
 * and restores it on toggle or unmount. Generic enough to reuse for any
 * fullscreen overlay (modals, intros, lightboxes).
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
