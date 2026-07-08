"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { useInViewOnce } from "@/lib/useInViewOnce";

const StandardCanvas = dynamic(() => import("./StandardCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * IO-gated, dynamic-imported wrapper around `<StandardCanvas/>`. Each
 * standards card sits in a horizontal scroller, so most cards are
 * off-screen at section enter — gating per-card means the three.js
 * chunk's parse work only kicks in for the cards the user actually
 * approaches. Sticky: once mounted, stays mounted.
 */
export default function LazyStandardCanvas({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);

  return (
    <div ref={ref} className="w-full h-full">
      {inView && <StandardCanvas index={index} />}
    </div>
  );
}
