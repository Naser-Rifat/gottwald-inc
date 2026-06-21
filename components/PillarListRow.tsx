"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";

interface PillarListRowProps {
  pillar: Pillar;
  index: number;
}

export default function PillarListRow({ pillar, index }: PillarListRowProps) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = useCallback(() => {
    const wrap = imageWrapRef.current;
    if (wrap) {
      gsap.to(wrap, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const wrap = imageWrapRef.current;
    if (!wrap) return;

    // Center the floating image on the cursor
    gsap.to(wrap, {
      x: e.clientX,
      y: e.clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const wrap = imageWrapRef.current;
    if (wrap) {
      gsap.to(wrap, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, []);

  return (
    <>
      <Link
        ref={rowRef}
        href={`/our-work/${pillar.slug}`}
        className="block w-full group py-10 sm:py-16 border-t border-white/15 cursor-pointer relative"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 relative z-10">
          
          {/* Index & Title */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            <span 
              className="text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: pillar.theme?.accent || '#d4af37' }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] group-hover:text-white/80 transition-colors duration-300">
              {pillar.title}
            </h3>
          </div>

          {/* Sub-items (Content Blocks as services list) */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            {pillar.contentBlocks && pillar.contentBlocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {pillar.contentBlocks.slice(0, 4).map((block, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#d4af37] transition-colors duration-300" />
                    <span className="text-white/60 text-sm tracking-wide font-light group-hover:text-white/90 transition-colors duration-300">
                      {block.heading}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-base font-light leading-relaxed max-w-sm">
                {pillar.description}
              </p>
            )}
          </div>

        </div>
      </Link>

      {/* Floating Image Portal Element */}
      <div
        ref={imageWrapRef}
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none opacity-0 scale-80 z-50 overflow-hidden rounded-xl shadow-2xl"
        style={{ willChange: "transform, opacity" }}
      >
        {pillar.image && (
          <Image
            src={pillar.image}
            alt={pillar.title}
            fill
            className="object-cover"
            sizes="300px"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </>
  );
}
