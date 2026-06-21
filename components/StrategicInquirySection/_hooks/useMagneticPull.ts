"use client";

import { useCallback, useRef, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";

export interface MagneticHandlers {
  onMouseMove: (e: ReactMouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic cursor pull on a single element. The cursor offset from the
 * element's center is multiplied by `strength`, then elastically snapped
 * back on mouse-leave.
 */
export function useMagneticPull<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: ReactMouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width / 2) * strength,
        y: (e.clientY - rect.top - rect.height / 2) * strength,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  return { ref, handlers: { onMouseMove, onMouseLeave } as MagneticHandlers };
}
