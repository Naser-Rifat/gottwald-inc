"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { useInViewOnce } from "@/lib/useInViewOnce";

const ArchetypeCanvas = dynamic(() => import("./ArchetypeCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * IO-gated, dynamic-imported wrapper around `<ArchetypeCanvas/>`. The
 * three.js + drei chunk (~1.2MB combined with the route's other R3F
 * users) only fetches once the host card scrolls within 200px of the
 * viewport, keeping the canvases' parse cost off the partnerships
 * critical path. Sticky: once mounted, stays mounted.
 */
export default function LazyArchetypeCanvas({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);

  return (
    <div ref={ref} className="w-full h-full">
      {inView && <ArchetypeCanvas index={index} />}
    </div>
  );
}
