"use client";

import { useEffect, useState } from "react";

import { NON_NEGOTIABLES } from "@/lib/partnershipData";

/**
 * Pagination dots overlay for the horizontally-scrolled "non-negotiables"
 * section.
 *
 * Subscribes to:
 *   - the parent's `updateStandardsPagination` CustomEvent (dispatched
 *     from the GSAP scroll-pin onUpdate),
 *   - native `scroll` on the inner wrapper (covers mobile native scroll
 *     fallback when the pin is disabled below 768px),
 *   - `resize` (target X position changes with viewport width).
 *
 * Picks the card whose centre is closest to 25% of the viewport width
 * — that's where the active card lands when the horizontal pin is at
 * its mid scrub position.
 */
export default function StandardsPagination() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      const cards = document.querySelectorAll(".standards-card");
      if (cards.length === 0) return;

      let bestIndex = 0;
      let minDistance = Infinity;

      const targetX = window.innerWidth * 0.25;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - targetX);
        if (distance < minDistance) {
          minDistance = distance;
          bestIndex = index;
        }
      });

      setActiveIndex(bestIndex);
    };

    handleUpdate();

    window.addEventListener("updateStandardsPagination", handleUpdate);

    // Native scroll fallback for mobile (where the pin is disabled).
    // Both scroll + resize are read-only handlers (just call setState);
    // passive prevents the browser from waiting on us before scrolling.
    const scrollWrapper = document.querySelector(".standards-scroll-wrapper");
    scrollWrapper?.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });

    return () => {
      window.removeEventListener("updateStandardsPagination", handleUpdate);
      scrollWrapper?.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, []);

  // +1 accounts for the trailing CTA card after the standards cards.
  const total = NON_NEGOTIABLES.length + 1;

  return (
    <div className="absolute bottom-6 lg:bottom-10 left-8 lg:left-16 z-50 flex items-center gap-3 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            activeIndex === i
              ? "w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              : "w-2.5 bg-transparent border border-white/40"
          }`}
        />
      ))}
    </div>
  );
}
