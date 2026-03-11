"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * RouteCleanup
 *
 * 1. Forces scroll position to top so pages always show the hero first
 * Note: We DO NOT globally kill ScrollTriggers here anymore. Next.js 14+ 
 * runs useEffect cleanup asynchronously, meaning a global kill here 
 * will falsely kill the NEW page's triggers created in useLayoutEffect.
 *
 * Individual pages MUST handle their own cleanup via gsap.context().revert()
 */
export default function RouteCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // On route ENTRY: scroll to top immediately
    window.scrollTo(0, 0);

    return () => {
      // Clear cached scroll positions so the new page starts fresh
      ScrollTrigger.clearScrollMemory();
      // Inform ScrollTrigger that layout has dramatically changed
      ScrollTrigger.refresh();
    };
  }, [pathname]);

  return null;
}
