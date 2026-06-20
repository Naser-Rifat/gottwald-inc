"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FrequencyTone = "gold" | "silver" | "petrol" | "copper" | "turquoise";

interface PillarCardProps {
  pillar: Pillar;
  index: number;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  /** Per-pillar brand tone — gives each card its own frequency. Defaults
   *  rotate gold → silver → petrol → copper across the four pillars so the
   *  group reads as "different frequencies, one orchestration" (manifesto). */
  tone?: FrequencyTone;
}

const TONE_DOT: Record<FrequencyTone, string> = {
  gold: "bg-gold",
  silver: "bg-silver",
  petrol: "bg-petrol",
  copper: "bg-copper",
  turquoise: "bg-turquoise",
};
const TONE_HAIRLINE: Record<FrequencyTone, string> = {
  gold: "bg-gold/30 group-hover:bg-gold/65",
  silver: "bg-silver/30 group-hover:bg-silver/65",
  petrol: "bg-petrol/35 group-hover:bg-petrol/70",
  copper: "bg-copper/30 group-hover:bg-copper/65",
  turquoise: "bg-turquoise/30 group-hover:bg-turquoise/60",
};
const TONE_TITLE_HOVER: Record<FrequencyTone, string> = {
  gold: "group-hover:text-gold",
  silver: "group-hover:text-silver",
  petrol: "group-hover:text-petrol",
  copper: "group-hover:text-copper",
  turquoise: "group-hover:text-turquoise",
};

export default function PillarCard({
  pillar,
  index,
  className = "",
  imageClassName = "aspect-3/2 mb-5",
  titleClassName,
  tone = "turquoise",
}: PillarCardProps) {
  const titleClass =
    titleClassName ??
    `text-white text-[clamp(1.2rem,2vw,2rem)] font-semibold tracking-tight leading-[1.15] ${TONE_TITLE_HOVER[tone]} transition-colors duration-500 line-clamp-2`;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [offersExpanded, setOffersExpanded] = useState(false);
  const offersWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const tags = tagsRef.current;
    if (!card || !imageWrap || !image || !title || !tags) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });

      tl.fromTo(
        imageWrap,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          delay: index % 2 === 1 ? 0.15 : 0,
        },
      );

      tl.fromTo(
        image,
        { scale: 1.3 },
        { scale: 1, duration: 1.4, ease: "power3.out" },
        "<",
      );

      tl.fromTo(
        tags,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.5",
      );

      const chars = title.textContent || "";
      title.innerHTML = chars
        .split("")
        .map(
          (c) =>
            `<span class="inline-block overflow-hidden"><span class="title-char inline-block translate-y-full">${c === " " ? "&nbsp;" : c}</span></span>`,
        )
        .join("");

      tl.to(
        title.querySelectorAll(".title-char"),
        {
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power3.out",
        },
        "-=0.4",
      );

    }, card);

    return () => ctx.revert();
  }, [index]);

  const handleMouseEnter = useCallback(() => {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      gsap.to(cursor, {
        width: "80px",
        height: "80px",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.4)",
        duration: 0.4,
        ease: "back.out(1.5)",
      });
      const text = cursor.querySelector('span');
      if (text) {
        gsap.to(text, { opacity: 1, duration: 0.3 });
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!card || !image || !overlay) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;

    gsap.to(image, {
      scale: 1.05,
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(overlay, {
      opacity: 0.15,
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(18,168,172,0.22), transparent 70%)`,
      duration: 0.3,
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!image || !overlay) return;

    gsap.to(image, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      overwrite: "auto",
    });
    
    // Reset custom cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      gsap.to(cursor, {
        width: "12px",
        height: "12px",
        backgroundColor: "rgba(255,255,255,0.5)",
        borderColor: "rgba(255,255,255,0.2)",
        duration: 0.4,
        ease: "power3.out",
      });
      const text = cursor.querySelector('span');
      if (text) {
        gsap.to(text, { opacity: 0, duration: 0.2 });
      }
    }
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/pillars/${pillar.slug}`}
      className={`group cursor-pointer block w-full relative ${className}`}
      style={{ perspective: "1000px" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Glow Layer (Theme Accent) */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[80px]"
        style={{ 
          background: `radial-gradient(circle at center, ${pillar.theme?.accent || '#d4af37'}80 0%, transparent 70%)`,
          transform: 'scale(1.1)'
        }}
      />

      <div
        id={`tile-${index + 1}`}
        ref={imageWrapRef}
        className={`relative z-10 overflow-hidden rounded-2xl ${imageClassName} transition-all duration-700 bg-white/[0.02] border border-white/5 backdrop-blur-md group-hover:border-white/15`}
        style={{ clipPath: "inset(100% 0 0 0)", minHeight: "180px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      >
        <div
          ref={imageRef}
          className="w-full h-full relative p-[1px]"
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner glass wrapper */}
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black/20">
            {/* 1. Base Dark Background / Texture */}
            <div className="dom-image-layer absolute inset-0 pointer-events-none select-none z-0 transition-opacity duration-1000">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                  backgroundSize: "6px 6px",
                }}
              />
            </div>

            {/* 2. Image Layer */}
            {pillar.image && (
              <div className="dom-image-layer absolute inset-0 z-10 transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 4}
                  quality={100}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
                
                {/* Dynamic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                
                {/* Top Theme Hairline */}
                <div 
                  className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-all duration-500 opacity-30 group-hover:opacity-100" 
                  style={{ background: `linear-gradient(90deg, transparent, ${pillar.theme?.accent || '#d4af37'}, transparent)` }}
                />
              </div>
            )}

            {/* 3. Foreground Content */}
            <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-6 sm:p-10">
              
              {/* Top Layer: Index Number placed beautifully */}
              <div className="flex justify-end items-start w-full transform group-hover:translate-y-[-10px] transition-transform duration-700 ease-out">
                <span
                  className="font-black leading-none tracking-tighter mix-blend-overlay"
                  style={{ 
                    fontSize: "clamp(6rem, 12vw, 15rem)", 
                    color: "rgba(255,255,255,0.08)",
                    WebkitTextStroke: "1px rgba(255,255,255,0.05)"
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom Layer: Meta info */}
              <div className="flex flex-col gap-2 transform group-hover:translate-y-[-5px] transition-transform duration-500 ease-out">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full transition-shadow duration-300" 
                    style={{ 
                      backgroundColor: pillar.theme?.accent || '#d4af37',
                      boxShadow: `0 0 10px ${pillar.theme?.accent || '#d4af37'}80` 
                    }} 
                  />
                  <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-white/60 group-hover:text-white/90 uppercase font-bold transition-colors duration-300">
                    Pillar {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover overlay — cursor follow glow */}
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-screen"
            />
          </div>
        </div>
      </div>

      <div
        ref={tagsRef}
        className="flex items-center gap-1 mb-2.5 mt-5 opacity-0"
      >
        {pillar.tags.map((tag, i) => (
          <span key={tag} className="flex items-center">
            <span className="text-[10px] tracking-[0.15em] text-white/70 uppercase font-normal">
              {tag}
            </span>
            {i < pillar.tags.length - 1 && (
              <span className="text-white/20 text-[8px] mx-1.5">•</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center">
        <span className="w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-hover:mr-4 opacity-0 transition-all duration-500 ease-out text-turquoise font-light">
          →
        </span>
        <h3 ref={titleRef} className={titleClass}>
          {pillar.title}
        </h3>
      </div>

      {/* Strategic Offers Accordion */}
      {pillar.offers && pillar.offers.length > 0 && (
        <div className="mt-4 flex flex-col w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              setOffersExpanded((prev) => !prev);
            }}
            className="flex items-center gap-3 w-fit text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
            style={{ color: offersExpanded ? "rgba(18,168,172,1)" : "rgba(255,255,255,0.5)" }}
          >
            <span
              className="w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: offersExpanded ? "rgba(18,168,172,0.5)" : "rgba(255,255,255,0.2)",
              }}
            >
              <span className="font-light text-[10px] leading-none -mt-[1px]">
                {offersExpanded ? "−" : "+"}
              </span>
            </span>
            {offersExpanded ? "HIDE STRATEGIC OFFERS" : "VIEW STRATEGIC OFFERS"}
          </button>

          <div
            ref={offersWrapRef}
            className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-full"
            style={{
              maxHeight: offersExpanded ? "600px" : "0px",
              opacity: offersExpanded ? 1 : 0,
              marginTop: offersExpanded ? "1rem" : "0px",
            }}
          >
            <div className="flex flex-col gap-2 w-full pr-4 pb-2">
              {pillar.offers.map((offer, i) => {
                const isCopper = offer.tier === "copper";
                const isSilver = offer.tier === "silver";
                const color = isCopper
                  ? "#c07840"
                  : isSilver
                    ? "#a0a5aa"
                    : "#d4af37";
                const bgColors = isCopper
                  ? "rgba(192,120,64,0.05)"
                  : isSilver
                    ? "rgba(160,165,170,0.05)"
                    : "rgba(212,175,55,0.05)";

                return (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3.5 rounded-lg border border-white/5 transition-colors group/offer cursor-default"
                    style={{ backgroundColor: bgColors }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center gap-2 min-w-[70px]">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                      <span
                        className="text-[9px] uppercase tracking-[0.2em] font-bold"
                        style={{ color }}
                      >
                        {offer.tier}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1 sm:gap-4">
                      <span className="text-white/90 text-sm font-medium">
                        {offer.title}
                      </span>
                      <span className="text-[10px] tracking-wider uppercase text-white/40">
                        {offer.deliverable}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
