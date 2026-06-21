"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Pillar } from "@/lib/types/pillars";

interface PillarSlideProps {
  pillar: Pillar;
  index: number;
  slideIndex: number;
  onHoverChange: (slug: string | null) => void;
}

export default function PillarSlide({
  pillar,
  index,
  slideIndex,
  onHoverChange,
}: PillarSlideProps) {
  const router = useRouter();
  const bgText = pillar.title.split(" ")[0];

  return (
    <section
      id={`slide-${slideIndex}`}
      data-index={slideIndex}
      className="snap-section snap-always snap-center h-screen w-full relative overflow-hidden cursor-pointer mix-blend-screen"
      onMouseEnter={() => onHoverChange(pillar.slug)}
      onMouseLeave={() => onHoverChange(null)}
      onClick={() => router.push(`/our-work/${pillar.slug}`)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden mix-blend-overlay">
        <h2
          className="font-playfair italic text-[40vw] font-black tracking-[-0.05em] text-white/[0.04] whitespace-nowrap select-none drop-shadow-2xl"
          style={{ transform: "scaleY(1.3)" }}
        >
          {bgText}
        </h2>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-screen">
        <div className="relative w-full max-w-[28vw] min-w-[280px] sm:min-w-[320px] aspect-[1/2] pointer-events-none">
          {pillar.image ? (
            <Image
              src={pillar.image}
              alt={pillar.title}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-white/5 backdrop-blur-3xl flex items-center justify-center">
              <span className="text-white/20 font-mono text-xs tracking-widest">[ASSET PENDING]</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-[6vh] md:bottom-[8vh] left-[5vw] md:left-[8vw] right-[5vw] md:right-[8vw] flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 z-20 pointer-events-none">

        <div className="flex flex-col pointer-events-none flex-1 min-w-0 pr-4 md:pr-8">
          <div className="flex items-center mb-2 md:mb-4">
            <div className="font-playfair italic font-bold tracking-widest text-[#d4af37] text-[18px] md:text-[24px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Pillar {(index + 1).toString().padStart(2, "0")}
            </div>
          </div>
          <h3 className="font-sans text-[clamp(2.5rem,5vw,6.5rem)] xl:text-[clamp(3.5rem,5.5vw,8rem)] font-bold leading-[0.85] tracking-tight uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {bgText}
          </h3>
        </div>

        <div className="flex flex-col items-start md:items-end pointer-events-none w-full md:max-w-[380px] lg:max-w-[450px] shrink-0">
          <p className="text-white/95 text-[16px] md:text-[18px] leading-[1.6] font-normal font-sans text-left md:text-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {pillar.description}
          </p>
        </div>
      </div>

    </section>
  );
}
