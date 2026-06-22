"use client";

import { useRef } from "react";

import { usePauseAnimationsOffscreen } from "@/lib/usePauseAnimationsOffscreen";

const TRAITS = [
  "think in outcomes (not tasks)",
  "communicate cleanly (no fog, no ego)",
  "document properly (transferable, auditable)",
  "keep quality under pressure",
  "live discretion as a reflex",
  "can be different — without losing foundation",
] as const;

/**
 * Editorial spread: massive "WHO WE'RE LOOKING FOR" title + a
 * turquoise-tinted bullet list of culture traits. Ghost "culture."
 * watermark + copper/silver liquid aurora float behind the content.
 */
export default function WhoWereLookingForSection() {
  const sectionRef = useRef<HTMLElement>(null);
  usePauseAnimationsOffscreen(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="px-gutter py-[15vh] border-t border-white/5 relative overflow-hidden bg-[#050505]"
    >
      {/* Ghost watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-5vw] z-0 select-none opacity-40 mix-blend-overlay"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(8rem, 20vw, 24rem)",
          }}
        >
          culture.
        </span>
      </div>

      {/* Premium liquid aurora background (copper & silver) */}
      <div className="about-liquid-aurora absolute top-[20%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.06] blur-[120px] z-0 will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-[#c07840] via-transparent to-[#b8c0cc] rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#b8c0cc] to-[#c07840] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
        <div className="flex-1">
          <h2
            className="font-black tracking-tighter leading-none uppercase mb-8"
            style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
          >
            <span className="block text-white opacity-95 drop-shadow-2xl">
              WHO WE&apos;RE
            </span>
            <span
              className="block text-transparent"
              style={{
                WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.2)",
              }}
            >
              LOOKING FOR
            </span>
          </h2>
          <p className="text-white/80 italic text-lg border-l border-copper pl-6 mt-12">
            &quot;If this feels &apos;normal&apos; to you, you&apos;re probably
            in the right room.&quot;
          </p>
        </div>

        <div className="flex-1 border border-white/10 p-10 md:p-16 bg-white/[0.02] stagger-group">
          <ul className="flex flex-col gap-6 text-lg md:text-xl font-light text-white/80 tracking-wide">
            {TRAITS.map((trait) => (
              <li key={trait} className="stagger-item flex items-center gap-4">
                <span className="w-6 h-px bg-silver/40 shrink-0" />
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
