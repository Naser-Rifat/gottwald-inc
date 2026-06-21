"use client";

import Image from "next/image";
import Link from "next/link";
import type { Pillar } from "@/lib/types/pillars";

import AuroraCanvasBg from "@/components/AuroraCanvasBg";

interface PillarSlideProps {
  pillar: Pillar;
  /** 1-indexed; drives the `.slide-N` className read by useScrollTimeline. */
  slideIndex: number;
  onHover: () => void;
  onUnhover: () => void;
}

const FALLBACK_DETAILS =
  "Designed to digitally preserve the foundation with immersive UX, engaging storytelling, and scalable architecture.";

export default function PillarSlide({
  pillar,
  slideIndex,
  onHover,
  onUnhover,
}: PillarSlideProps) {
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center slide-${slideIndex} opacity-0 invisible pointer-events-none px-6 sm:px-12 py-24 mix-blend-screen overflow-hidden`}
    >
      {/* Massive horizontal watermark text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden select-none opacity-[0.03]">
        <h2 className="text-[20vw] sm:text-[16vw] font-black uppercase leading-none tracking-tighter text-white whitespace-nowrap">
          {pillar.title}
        </h2>
      </div>

      {pillar.image && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-center lg:justify-start pointer-events-auto z-20 w-full lg:w-[50%] overflow-visible mix-blend-screen opacity-20 lg:opacity-100 -translate-y-[15vh] lg:translate-y-0">
          <div
            className="relative w-[140%] h-[140%] lg:w-[120%] lg:h-[120%] max-h-[1000px] max-w-[1000px]"
            style={{ animation: "slowRotateFloat 15s ease-in-out infinite" }}
          >
            <Image
              src={pillar.image || `/images/our-work/${slideIndex}.png`}
              alt={pillar.title}
              fill
              className="object-contain contrast-150 brightness-[1.15]"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
            />

            {/* Invisible hover target — shows/hides the ghost cursor */}
            <Link
              href={`/our-work/${pillar.slug}`}
              className="absolute inset-0 z-30 cursor-none"
              onMouseEnter={onHover}
              onMouseLeave={onUnhover}
            >
              <span className="sr-only">Learn more about {pillar.title}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Default Dark Glow (No image fallback) */}
      {!pillar.image && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-center lg:justify-start pointer-events-auto z-20 w-full lg:w-[50%] -translate-y-[5vh] lg:translate-y-0">
          <Link
            href={`/our-work/${pillar.slug}`}
            className="relative w-[300px] sm:w-[400px] md:w-[460px] aspect-[4/5] rounded-xl overflow-hidden cursor-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] group border border-white/10"
            onMouseEnter={onHover}
            onMouseLeave={onUnhover}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 opacity-60 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at top right, ${pillar.theme?.accent || '#ffffff'}22 0%, #050505 70%)`
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                  backgroundSize: "6px 6px",
                }}
              />
            </div>
            <div 
              className="absolute inset-0 rounded-xl border border-white/5 opacity-50 group-hover:opacity-100 group-hover:border-white/20 transition-all duration-500 z-20 pointer-events-none"
              style={{ borderColor: `${pillar.theme?.accent || '#ffffff'}33` }}
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[12px] tracking-[0.4em] text-white/50 uppercase font-bold mb-4">
                 Explore Pillar
               </span>
               <h3 className="text-3xl font-bold uppercase tracking-tight text-white drop-shadow-md">
                 {pillar.title}
               </h3>
            </div>
          </Link>
        </div>
      )}

      {/* Right-anchored content: title + glassmorphic description card */}
      <div className="absolute inset-y-0 right-6 sm:right-12 lg:right-20 flex flex-col justify-center max-w-[90%] sm:max-w-[480px] lg:max-w-[500px] pointer-events-auto z-30">
        <div className="flex flex-col gap-2 mb-8 ml-2">
          <span 
            className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-bold drop-shadow-md transition-colors duration-700"
            style={{ color: pillar.theme?.accent || '#d4af37' }}
          >
            Pillar {String(slideIndex).padStart(2, "0")}
          </span>
          <h3 className="text-4xl sm:text-6xl font-bold uppercase leading-[1.05] tracking-tight drop-shadow-lg text-white">
            {pillar.title}
          </h3>
        </div>

        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-7 sm:p-10 rounded-3xl relative overflow-hidden group shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
          <p className="text-white text-[14px] sm:text-[16px] leading-[1.8] font-medium tracking-wide relative z-10 drop-shadow-md">
            {pillar.details || FALLBACK_DETAILS}
          </p>

          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent group-hover:w-full transition-all duration-1000 ease-out opacity-70" />
        </div>
      </div>
    </div>
  );
}
