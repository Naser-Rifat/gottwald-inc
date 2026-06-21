"use client";

import { type Ref } from "react";
import gsap from "gsap";

import {
  ECOSYSTEM_FREQUENCIES,
  FREQUENCY_TONE_CLASSES,
} from "../_data/ecosystem";

interface EcosystemSectionProps {
  /** Index of the currently hovered ecosystem row (null = none). */
  hoveredEcoIndex: number | null;
  /** Setter; the parent uses it to drive the reveal-cursor visibility. */
  setHoveredEcoIndex: (i: number | null) => void;
  /** Ref to the reveal-cursor element. Owned by the parent so a
   *  cross-section mousemove tracker can lerp it without re-binding on
   *  each hover toggle. */
  ecoCursorRef: Ref<HTMLDivElement>;
}

/**
 * ECOSYSTEM — distinct frequencies, one orchestration.
 *
 * Eight business areas presented as a table-of-rows. Hovering a row:
 *  - flags `hoveredEcoIndex` so the reveal cursor shows the matching
 *    image,
 *  - emits a `canvas-pulse` event so the GlobalCanvas background can
 *    flash a cinematic pulse,
 *  - snaps the cursor element to the current mouse position before the
 *    parent's smooth-follow effect takes over (prevents a top-left
 *    corner flash on first show).
 */
export default function EcosystemSection({
  hoveredEcoIndex,
  setHoveredEcoIndex,
  ecoCursorRef,
}: EcosystemSectionProps) {
  return (
    <section
      data-journey="depth"
      className="about-atmosphere pt-[14vh] pb-[18vh] px-gutter relative bg-[#070c14] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute left-[8vw] top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-turquoise/20 to-transparent"
      />
      <div className="max-w-[1400px] mx-auto">
        <div className="reveal-text grid lg:grid-cols-12 gap-10 lg:gap-20 mb-[10vh]">
          <div className="lg:col-span-7">
            <p className="text-[10px] tracking-[0.42em] uppercase text-turquoise/75 mb-8">
              The orchestra
            </p>
            <h2
              className="font-light text-white leading-[0.98] tracking-[-0.035em]"
              style={{
                fontSize:
                  "calc(clamp(3rem, 7vw, 7.5rem) * var(--heading-scale))",
              }}
            >
              Different frequencies.
              <span className="block italic text-white/45">
                One coherent sound.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-end">
            <p className="text-lg md:text-xl text-white/55 font-light leading-[1.65]">
              Each business area creates a distinct inner state. Together, they
              move people from uncertainty toward trust and action.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] relative">
          {/* Image Reveal Cursor Block */}
          <div
            ref={ecoCursorRef}
            className="fixed top-0 left-0 w-[24vw] aspect-[4/3] pointer-events-none z-50 rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 transition-all duration-500 ease-out will-change-transform shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10"
            style={{
              opacity: hoveredEcoIndex !== null ? 1 : 0,
              transform:
                hoveredEcoIndex !== null ? "scale(1)" : "scale(0.95)",
              visibility: hoveredEcoIndex !== null ? "visible" : "hidden",
            }}
          >
            {ECOSYSTEM_FREQUENCIES.map((eco, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`img-${index}`}
                src={eco.image}
                alt={eco.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{
                  opacity: hoveredEcoIndex === index ? 1 : 0,
                }}
              />
            ))}
          </div>

          {ECOSYSTEM_FREQUENCIES.map((eco, index) => {
            const isHovered = hoveredEcoIndex === index;
            const isSiblingHovered =
              hoveredEcoIndex !== null && hoveredEcoIndex !== index;

            return (
              <article
                key={eco.name}
                onMouseEnter={(e) => {
                  setHoveredEcoIndex(index);
                  // Trigger a cinematic pulse in the GlobalCanvas background
                  window.dispatchEvent(new CustomEvent("canvas-pulse"));
                  // Snap the cursor to the mouse position so first reveal
                  // doesn't flash from (0,0).
                  if (
                    ecoCursorRef &&
                    typeof ecoCursorRef === "object" &&
                    "current" in ecoCursorRef &&
                    ecoCursorRef.current
                  ) {
                    gsap.set(ecoCursorRef.current, {
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredEcoIndex(null)}
                className={`reveal-text group relative grid grid-cols-[3rem_1fr] md:grid-cols-12 gap-x-4 md:gap-x-8 py-7 md:py-9 border-b cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isHovered ? "border-white/20" : "border-white/[0.07]"
                } ${isSiblingHovered ? "opacity-20 grayscale" : "opacity-100"}`}
              >
                <span
                  className={`md:col-span-1 font-mono text-[10px] tracking-[0.25em] pt-2 transition-colors duration-500 relative z-20 mix-blend-difference ${isHovered ? "text-white/60" : "text-white/25"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className={`md:col-span-5 text-[clamp(1.5rem,2.6vw,2.8rem)] leading-[1.05] tracking-[-0.025em] font-light relative z-20 mix-blend-difference transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    isHovered
                      ? "text-white translate-x-4"
                      : "text-white/90 translate-x-0"
                  }`}
                >
                  {eco.name}
                </h3>
                <p
                  className={`col-start-2 md:col-start-auto md:col-span-2 mt-3 md:mt-2 text-[10px] uppercase transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] relative z-20 mix-blend-difference ${FREQUENCY_TONE_CLASSES[eco.tone]} ${
                    isHovered
                      ? "tracking-[0.5em] font-medium"
                      : "tracking-[0.3em]"
                  }`}
                >
                  {eco.frequency}
                </p>
                <p
                  className={`col-start-2 md:col-start-auto md:col-span-4 mt-3 md:mt-1 text-base md:text-lg font-light leading-[1.55] relative z-20 mix-blend-difference transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    isHovered
                      ? "text-white/95 translate-x-2"
                      : "text-white/70 translate-x-0"
                  }`}
                >
                  {eco.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
