"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-driven parallax "shard" card used in the 7-line manifesto
 * grid. Each shard:
 *   - drifts vertically based on the section's scroll progress with an
 *     odd/even alternation so adjacent shards move in opposite
 *     directions (creates the editorial mosaic feel),
 *   - splits the principle text on a known delimiter ("instead of",
 *     "so", "without", "—") into a bold subject and an italic
 *     consequence, with the delimiter rendered as marginalia,
 *   - shows a giant outlined ordinal numeral as background watermark.
 *
 * `group/shard` + `group/shards` are the named utility groups the
 * parent grid uses to dim siblings on hover.
 */
export default function ParallaxShard({
  principle,
  index,
}: {
  principle: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 30 : 60, index % 2 === 0 ? -30 : -60],
  );

  const renderText = (text: string) => {
    const delimiters = ["instead of", "so", "without", "—"];
    for (const delim of delimiters) {
      if (text.includes(delim)) {
        const [first, second] = text.split(delim);
        return (
          <div className="flex flex-col items-start gap-4 lg:gap-5">
            <h4 className="text-3xl lg:text-[2.5rem] font-light text-white/90 group-hover/shard:text-white transition-colors duration-500 tracking-tight leading-[1.1]">
              {first.trim()}
            </h4>
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-white/10 group-hover/shard:bg-white/30 transition-colors duration-500" />
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/30 group-hover/shard:text-white/60 transition-colors duration-500">
                {delim}
              </span>
            </div>
            <p className="text-xl lg:text-2xl font-serif italic text-white/40 group-hover/shard:text-white/70 transition-colors duration-500 pr-4">
              {second.trim()}
            </p>
          </div>
        );
      }
    }
    return (
      <h4 className="text-3xl lg:text-[2.5rem] font-light text-white/90 leading-[1.1]">
        {text}
      </h4>
    );
  };

  return (
    <motion.div
      ref={ref}
      style={{ y: yOffset }}
      className="group/shard relative h-full"
    >
      <div className="relative overflow-hidden p-10 lg:p-14 h-full flex flex-col justify-between border border-white/5 bg-[#030407]/60 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-2xl group-hover/shards:opacity-30 group-hover/shards:blur-md hover:!opacity-100 hover:!blur-none hover:scale-[1.02] hover:z-20 hover:border-white/20 hover:bg-[#06080d]/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        {/* Outlined Background Number */}
        <span
          className="absolute -bottom-6 -right-6 text-[14rem] font-black pointer-events-none select-none z-0 tracking-tighter leading-none transition-all duration-700 group-hover/shard:-translate-y-4"
          style={{
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.04)",
          }}
        >
          0{index + 1}
        </span>

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between w-full mb-12">
          <span className="text-sm font-mono tracking-[0.2em] text-white/20 group-hover/shard:text-white/60 transition-colors duration-500">
            0{index + 1}
          </span>
          <span className="text-white/10 group-hover/shard:text-white/40 transition-colors duration-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full mt-auto">{renderText(principle)}</div>

        {/* Minimal Bottom Edge Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/0 group-hover/shard:bg-white/10 transition-colors duration-700 ease-out" />
      </div>
    </motion.div>
  );
}
