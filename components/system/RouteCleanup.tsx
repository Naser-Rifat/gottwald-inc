"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * RouteCleanup — global per-route lifecycle guard
 *
 * CRITICAL TIMING NOTE:
 * React runs useEffect cleanups AFTER the new page mounts.
 * This means a naive `ScrollTrigger.getAll().forEach(t => t.kill())` in the
 * cleanup will kill the NEW page's triggers (created in useLayoutEffect), not
 * just the old page's ones — causing silent scroll freeze on the destination.
 *
 * FIX: Snapshot the current trigger IDs at the moment the effect runs (route ENTRY),
 * then on EXIT only kill the triggers that existed at that time.
 * New triggers registered after navigation are never touched.
 */
export default function RouteCleanup() {
  const pathname = usePathname();
  // Hold snapshot of trigger instances belonging to THIS route
  const snapshotRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    // ── ROUTE ENTRY ──────────────────────────────────────────────────────────

    // 1. Always strip body scroll-lock (from menu or any other source)
    document.body.classList.remove("no-scroll");

    // 2. Jump to top before new page layout is measured
    window.scrollTo(0, 0);

    // 3. Take a snapshot of ALL triggers now registered for this page.
    //    Delay by one frame so useLayoutEffect triggers on the new page
    //    have fully registered before we snapshot them.
    const raf = requestAnimationFrame(() => {
      snapshotRef.current = ScrollTrigger.getAll();
      // Now refresh so new-page layout metrics are accurate
      ScrollTrigger.refresh();
    });

    return () => {
      // ── ROUTE EXIT ─────────────────────────────────────────────────────────
      cancelAnimationFrame(raf);

      // Kill ONLY the triggers that were alive during THIS route's session.
      // Any triggers created AFTER navigation began (belonging to next page)
      // are NOT in the snapshot and will NOT be touched.
      snapshotRef.current.forEach((t) => {
        try {
          t.kill();
        } catch {
          // Already killed by the page's own gsap.context().revert() — ignore
        }
      });
      snapshotRef.current = [];

      // Clear cached scroll memory so new page starts at y=0
      ScrollTrigger.clearScrollMemory();
    };
  }, [pathname]);

  return null;
}
