"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { PARTNERSHIP_SELECTION_STEPS } from "@/lib/partnershipData";

type PartnershipSelectionStep = (typeof PARTNERSHIP_SELECTION_STEPS)[number];

/**
 * Single step in the selection-process timeline.
 *
 * Each step:
 *   - alternates left/right of the central spine (even = left),
 *   - fades from 0.15→1 opacity and drifts 80px→0 across its slice of
 *     the parent's scroll progress,
 *   - lights up its node from white/5% to full turquoise in the same
 *     window, giving the visual impression of the spine "filling" as
 *     the reader scrolls down.
 */
function VerticalSpineStep({
  step,
  i,
  total,
  scrollYProgress,
}: {
  step: PartnershipSelectionStep;
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isEven = i % 2 === 0;
  const progressStart = i / total;

  const opacity = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.15],
    [0.15, 1],
  );
  const yOffset = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.15],
    [80, 0],
  );
  const nodeColor = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.05],
    ["rgba(255,255,255,0.05)", "rgba(18,168,172,1)"],
  );

  return (
    <motion.div
      style={{ opacity, y: yOffset }}
      className="relative w-full flex flex-col lg:flex-row items-center mb-32 lg:mb-52 last:mb-0 group"
    >
      <motion.div
        className="absolute left-8 lg:left-1/2 w-8 h-8 rounded-full border-2 bg-[#050505] -translate-x-1/2 z-20 transition-transform duration-700 group-hover:scale-[1.8] flex items-center justify-center"
        style={{ borderColor: nodeColor }}
      >
        <div className="w-2 h-2 rounded-full bg-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_rgba(18,168,172,0.8)]" />
      </motion.div>

      <div
        className={`w-full lg:w-1/2 flex pl-24 lg:pl-0 ${isEven ? "lg:justify-end lg:pr-24" : "lg:order-2 lg:justify-start lg:pl-24"}`}
      >
        <div className="relative">
          <span className="absolute -top-10 lg:-top-24 -left-6 lg:-left-12 text-[7rem] lg:text-[14rem] font-black text-white/[0.015] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-1000 -z-10">
            0{i + 1}
          </span>
          <h3 className="text-3xl lg:text-5xl font-black text-white relative z-10 group-hover:text-gold transition-colors duration-500 tracking-tighter">
            {step.title}
          </h3>
        </div>
      </div>

      <div
        className={`w-full lg:w-1/2 flex pl-24 lg:pl-0 mt-8 lg:mt-0 ${isEven ? "lg:order-2 lg:justify-start lg:pl-24" : "lg:justify-end lg:pr-24"}`}
      >
        <div className="bg-white/[0.01] border border-white/5 p-8 lg:p-10 rounded-3xl backdrop-blur-md w-full max-w-lg group-hover:bg-white/[0.03] group-hover:border-turquoise/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-turquoise/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed">
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Selection-process timeline: a vertical "laser" spine that fills as
 * the reader scrolls past it, with steps alternating left/right.
 *
 * Internally renders `VerticalSpineStep` for each entry in
 * `PARTNERSHIP_SELECTION_STEPS`. The motion value `scrollYProgress` is
 * shared across all steps so the laser fill, opacity and node-color
 * transitions stay frame-synced.
 */
export default function VerticalSpineTimeline({
  steps = PARTNERSHIP_SELECTION_STEPS,
}: {
  steps?: ReadonlyArray<PartnershipSelectionStep>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const laserHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto py-20 lg:py-40 overflow-hidden"
    >
      <div className="absolute top-0 bottom-0 left-8 lg:left-1/2 w-[1px] bg-white/5 -translate-x-1/2 z-0" />
      <motion.div
        style={{ height: laserHeight }}
        className="absolute top-0 left-8 lg:left-1/2 w-[2px] bg-gradient-to-b from-turquoise to-petrol shadow-[0_0_30px_6px_rgba(18,168,172,0.7)] z-10 -translate-x-1/2"
      />

      {steps.map((step, i) => (
        <VerticalSpineStep
          key={i}
          step={step}
          i={i}
          total={steps.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
