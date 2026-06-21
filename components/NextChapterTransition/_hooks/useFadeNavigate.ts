"use client";

import { useCallback, type RefObject } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FADE_IN_MS = 350;
const SETTLE_MS = 500;
const FADE_OUT_MS = 400;

/**
 * Navigate to `href` with a fade-to-black overlay. Kills all live
 * ScrollTrigger instances first so unmounting pinned scrolls (e.g. the
 * partnerships page) does not freeze the browser during route change.
 *
 * Respects `lockRef`: if the user already clicked any link, this is a
 * no-op so we don't double-navigate.
 */
export function useFadeNavigate(lockRef: RefObject<boolean>) {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      if (lockRef.current) return;
      lockRef.current = true;

      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.scrollTo(0, 0);

      const overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999;opacity:0;transition:opacity 0.35s ease-out;pointer-events:none";
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
      });

      setTimeout(() => {
        router.push(href);
        setTimeout(() => {
          if (!overlay.parentNode) return;
          overlay.style.opacity = "0";
          setTimeout(() => {
            if (overlay.parentNode) document.body.removeChild(overlay);
          }, FADE_OUT_MS);
        }, SETTLE_MS);
      }, FADE_IN_MS);
    },
    [router, lockRef],
  );
}
