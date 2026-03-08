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
 * 1. Kills ALL active GSAP ScrollTrigger instances on route change
 * 2. Forces scroll position to top so pages always show the hero first
 */
export default function RouteCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // On route ENTRY: scroll to top immediately
    window.scrollTo(0, 0);

    // On route EXIT: kill all ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, [pathname]);

  return null;
}
