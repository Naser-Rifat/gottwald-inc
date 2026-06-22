"use client";

import { motion } from "framer-motion";

import { PARTNERSHIP_ARCHETYPES } from "@/lib/partnershipData";

import ArchetypeCanvas from "./ArchetypeCanvas";

type PartnershipArchetype = (typeof PARTNERSHIP_ARCHETYPES)[number];

interface ArchetypeCardProps {
  arch: PartnershipArchetype;
  index: number;
  /** Driven by the parent bento grid — the focused card expands while
   *  siblings shrink, via Framer Motion's `layout` animations. */
  flexValue: number;
  onHover: () => void;
  onLeave: () => void;
}

/**
 * Cinematic archetype card with:
 *  - a WebGL `<ArchetypeCanvas/>` backdrop tinted per index,
 *  - a mouse-follow gold spotlight overlay,
 *  - a giant outlined ordinal numeral that drifts a few pixels with the
 *    cursor (CSS custom-property parallax),
 *  - Framer Motion `layout` animations so the card grows/shrinks
 *    smoothly when the parent updates `flexValue` on hover.
 *
 * `--x`, `--y`, `--mx`, `--my` custom properties are written from
 * `onMouseMove` and consumed by the inline `style` props on the overlay
 * + numeral elements.
 */
export default function ArchetypeCard({
  arch,
  index,
  flexValue,
  onHover,
  onLeave,
}: ArchetypeCardProps) {
  return (
    <motion.div
      layout
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ flex: flexValue }}
      initial={{ flex: flexValue }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative bg-[#0a0c12] p-8 lg:p-10 rounded-2xl border border-white/8 hover:border-[var(--color-petrol)]/40 overflow-hidden flex flex-col justify-between cursor-default transition-[border-color,box-shadow] duration-700 w-full min-h-[320px] md:min-h-0 md:w-auto"
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (x - centerX) * -0.05;
        const moveY = (y - centerY) * -0.05;

        requestAnimationFrame(() => {
          el.style.setProperty("--x", `${x}px`);
          el.style.setProperty("--y", `${y}px`);
          el.style.setProperty("--mx", `${moveX}px`);
          el.style.setProperty("--my", `${moveY}px`);
        });
      }}
    >
      {/* Cinematic background canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl transition-transform duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)]">
        <div className="w-full h-full opacity-[0.65] group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms] ease-out will-change-transform">
          <ArchetypeCanvas index={index} />
        </div>
        <div
          className="absolute inset-0 bg-turquoise/10 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          style={{
            transform:
              "translate(calc(var(--mx, 0) * 0.5), calc(var(--my, 0) * 0.5))",
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/40 to-transparent pointer-events-none" />
      </div>

      {/* Mouse-follow gold spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-overlay"
        style={{
          background: `radial-gradient(600px circle at var(--x) var(--y), rgba(212,175,55,0.07), transparent 50%)`,
        }}
      />
      {/* Mouse-clipped silver ring */}
      <div
        className="pointer-events-none absolute inset-0 z-2 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 ring-1 ring-inset ring-silver/50"
        style={{
          maskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
          WebkitMaskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
        }}
      />
      {/* Watermark ordinal that drifts with the cursor */}
      <div
        className="absolute -bottom-8 -right-4 text-[10rem] lg:text-[13rem] font-black leading-none text-white/2 transition-[transform,color] duration-300 ease-out select-none pointer-events-none z-3 group-hover:text-silver/5"
        style={{ transform: "translate(var(--mx, 0), var(--my, 0))" }}
      >
        0{index + 1}
      </div>
      <motion.div
        layout
        className="relative z-10 flex flex-col h-full justify-between"
      >
        <motion.div
          layout
          className="flex items-center justify-between mb-auto"
        >
          <span className="text-silver/80 font-mono text-sm tracking-[0.4em] font-medium">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-12 h-px bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-turquoise origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </div>
        </motion.div>
        <motion.div
          layout
          className="mt-8 pt-4 border-t border-white/5 group-hover:border-silver/20 transition-colors duration-700"
        >
          <h3
            className={`font-black text-white/80 group-hover:text-white transition-colors duration-500 leading-[0.9] mb-3 tracking-tighter uppercase ${index === 0 ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"}`}
          >
            {arch.title}
          </h3>
          <p className="text-white/80 text-base font-light leading-relaxed group-hover:text-white/80 transition-colors duration-700 max-w-[20ch] sm:max-w-none">
            {arch.desc}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
