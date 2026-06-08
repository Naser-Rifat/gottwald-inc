"use client";

import { useEffect, useState } from "react";

/**
 * Tuning Instrument HUD — About page signature.
 *
 * A floating frequency-monitor panel that "locks onto" each section as the
 * reader scrolls. Literalises the brand's frequency / resonance language as
 * a functional UI element: section name → tuned-to readout, fictional Hz
 * frequency per section, animated signal-strength bars, geographic stamp
 * (Georgia / Tbilisi), and a live Tbilisi clock.
 *
 * The intent is anti-template: no other consulting site has this. A reader
 * remembers it because it's *useful nonsense* — purely decorative, but built
 * with the rigour of a real instrument.
 */
type SectionTuning = {
  id: string;
  name: string;
  freq: string;
  strength: number; // 0-36
};

const SECTION_FREQUENCIES: SectionTuning[] = [
  { id: "perception", name: "Perception", freq: "432.0", strength: 14 },
  { id: "openness",   name: "Openness",   freq: "528.0", strength: 20 },
  { id: "trust",      name: "Trust",      freq: "639.0", strength: 24 },
  { id: "pillars",    name: "Pillars",    freq: "741.0", strength: 26 },
  { id: "proof",      name: "Proof",      freq: "852.0", strength: 28 },
  { id: "cases",      name: "Cases",      freq: "963.0", strength: 30 },
  { id: "depth",      name: "Depth",      freq: "396.0", strength: 22 },
  { id: "patron",     name: "Patron",     freq: "1111",  strength: 32 },
  { id: "decision",   name: "Decision",   freq: "888.0", strength: 36 },
];

const BAR_COUNT = 18;

export default function TuningInstrumentHUD() {
  const [active, setActive] = useState<SectionTuning>(SECTION_FREQUENCIES[0]);
  const [time, setTime] = useState<string>("");

  // Live Tbilisi clock — anchors the page to a real coordinate. Refreshes
  // every second; cleanup on unmount so we don't leak intervals between
  // route navigations.
  useEffect(() => {
    const updateTime = () => {
      try {
        const stamp = new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Tbilisi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(stamp);
      } catch {
        // Some hardened browser modes block timeZone formatting — fall back
        // to a quiet placeholder so the HUD doesn't render a stack trace.
        setTime("--:--:--");
      }
    };
    updateTime();
    const id = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Track which section the reader is in via IntersectionObserver. Picks the
  // section with the highest visible ratio so we don't flicker between two
  // borderline sections when both are partially in view.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-journey]"),
    );
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.journey;
          if (!id) return;
          ratios.set(id, entry.intersectionRatio);
        });
        let topId: string | null = null;
        let topRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        });
        if (topId && topRatio > 0.12) {
          const next = SECTION_FREQUENCIES.find((s) => s.id === topId);
          if (next) setActive(next);
        }
      },
      { threshold: [0.12, 0.3, 0.55, 0.8] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed top-24 right-5 lg:right-8 z-40 hidden md:block"
    >
      <div className="relative bg-[#0c1320]/70 backdrop-blur-md border border-turquoise/[0.16] px-4 py-3 min-w-[200px] shadow-[0_0_40px_rgba(7,12,20,0.6)]">
        {/* Top row — signal lock indicator + geographic stamp. */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-turquoise/40 animate-ping" />
              <span className="relative rounded-full w-2 h-2 bg-turquoise" />
            </span>
            <span className="text-[8px] font-mono tracking-[0.34em] uppercase text-turquoise/85 font-medium">
              Signal Lock
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-white/40">
            GE / TBS
          </span>
        </div>

        {/* Section identification — `key` rotation re-mounts the element so the
            CSS keyframe animation re-runs each time the active section
            changes (cheap, no JS animation logic). */}
        <div className="mb-3">
          <p className="text-[8px] font-mono tracking-[0.42em] uppercase text-white/40 mb-1">
            Tuned to
          </p>
          <p
            key={`name-${active.id}`}
            className="tuning-hud-name text-[15px] font-mono tracking-[0.18em] uppercase text-white font-medium"
          >
            {active.name}
          </p>
        </div>

        {/* Frequency reading + waveform bars */}
        <div className="pt-3 border-t border-white/[0.07]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[8px] font-mono tracking-[0.34em] uppercase text-white/40">
              Frequency
            </span>
            <span
              key={`freq-${active.id}`}
              className="tuning-hud-freq font-mono text-[13px] text-turquoise tabular-nums"
            >
              {active.freq}
              <span className="text-[8px] text-turquoise/60 ml-1">Hz</span>
            </span>
          </div>

          {/* Strength bars — varied heights and staggered transition delay
              produce a "tuning in" feel each time the section changes. */}
          <div className="flex items-end gap-[2px] h-4 mt-1">
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const lit = (i + 1) / BAR_COUNT <= active.strength / 36;
              return (
                <span
                  key={i}
                  className={`flex-1 transition-all duration-700 ${
                    lit ? "bg-turquoise/80" : "bg-white/[0.07]"
                  }`}
                  style={{
                    height: lit ? `${25 + (i * 75) / BAR_COUNT}%` : "25%",
                    transitionDelay: `${i * 24}ms`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom row — live Tbilisi local time */}
        <div className="mt-3 pt-3 border-t border-white/[0.07] flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-[0.34em] uppercase text-white/40">
            Local
          </span>
          <span className="text-[11px] font-mono text-white/70 tabular-nums">
            {time}
          </span>
        </div>
      </div>
    </aside>
  );
}
