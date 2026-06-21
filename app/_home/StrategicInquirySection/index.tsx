"use client";

import { useRef, useState } from "react";

import { useEntranceReveal } from "./_hooks/useEntranceReveal";
import { useMouseParallax } from "./_hooks/useMouseParallax";
import { useMagneticPull } from "./_hooks/useMagneticPull";

import BackgroundWatermark from "./_components/BackgroundWatermark";
import LiquidAurora from "./_components/LiquidAurora";
import FrequencyWave from "./_components/FrequencyWave";
import EditorialHeadline from "./_components/EditorialHeadline";
import ProseColumn from "./_components/ProseColumn";
import ClosingCaption from "./_components/ClosingCaption";

/**
 * StrategicInquirySection — closing partnership invitation.
 *
 * Asymmetric magazine spread: massive editorial headline on the left,
 * prose column on the right with progressive-disclosure body and a
 * magnetic CTA. Layered background: ghost "alignment." watermark, liquid
 * aurora blob, and an ambient signal-wave foot.
 */
export default function StrategicInquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const alignmentRef = useRef<HTMLSpanElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEntranceReveal({ sectionRef, contentRef, alignmentRef });
  useMouseParallax(sectionRef, [
    { ref: bgTextRef, intensity: 60, duration: 1.5, ease: "power2.out" },
    { ref: auroraRef, intensity: -120, duration: 2.5, ease: "power3.out" },
  ]);
  const { ref: ctaRef, handlers: ctaHandlers } =
    useMagneticPull<HTMLAnchorElement>();

  return (
    <section
      ref={sectionRef}
      data-journey="decision"
      aria-label="Strategic Partnership Inquiry"
      className="relative z-10 w-full min-h-svh bg-base border-t border-white/[0.05] overflow-hidden flex items-center"
    >
      <BackgroundWatermark ref={bgTextRef} />
      <LiquidAurora ref={auroraRef} />
      <FrequencyWave />

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1500px] mx-auto px-gutter py-[12vh] lg:py-[14vh] flex flex-col gap-[8vh] lg:gap-[10vh]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative">
          <EditorialHeadline ref={alignmentRef} />
          <ProseColumn
            expanded={expanded}
            onToggleExpanded={() => setExpanded((v) => !v)}
            ctaRef={ctaRef}
            ctaHandlers={ctaHandlers}
          />
        </div>

        <ClosingCaption />
      </div>
    </section>
  );
}
