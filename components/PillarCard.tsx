"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pillar } from "@/lib/types/pillars";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PillarCardProps {
  pillar: Pillar;
  index: number;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
}

export default function PillarCard({
  pillar,
  index,
  className = "",
  imageClassName = "aspect-3/2 mb-5",
  titleClassName = "text-white text-[clamp(1.2rem,2vw,2rem)] font-semibold tracking-tight leading-[1.15] group-hover:text-gold transition-colors duration-500 line-clamp-2",
}: PillarCardProps) {
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
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,0.2), transparent 70%)`,
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
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/pillars/${pillar.slug}`}
      className={`group cursor-pointer block ${className}`}
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageWrapRef}
        className={`relative overflow-hidden rounded-xl ${imageClassName} shadow-[0_4px_25px_rgba(10,147,150,0.1)] transition-shadow duration-500 group-hover:shadow-[0_8px_30px_rgba(10,147,150,0.25)] ring-1 ring-white/5 ring-inset`}
        style={{ clipPath: "inset(100% 0 0 0)", minHeight: "180px" }}
      >
        <div
          ref={imageRef}
          className="w-full h-full relative"
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 1. Base Dark Background / Texture (Fallback) */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            {/* Multi-stop gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
              }}
            />

            {/* Subtle diagonal scan line texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                backgroundSize: "6px 6px",
              }}
            />
          </div>

          {/* 2. Image Layer (Sits above background) */}
          {pillar.image && (
            <div className="absolute inset-0 z-10">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 4}
                unoptimized
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
              {/* Metallic Tint Overlay for Visual Pop */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(192,120,64,0.15) 50%, rgba(160,165,170,0.15) 100%)"
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
                style={{
                  background: "linear-gradient(45deg, rgba(18,168,172,0.4) 0%, transparent 100%)"
                }}
              />
              {/* Optional: Add a dark gradient at bottom for text readability if image exists */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none mix-blend-multiply" />
              <div className="absolute inset-x-0 top-0 h-[2px] bg-turquoise/30 pointer-events-none group-hover:bg-turquoise/60 transition-colors" />
            </div>
          )}

          {/* 3. Foreground Text / Accents (Sits above background and image) */}
          <div className="absolute inset-0 pointer-events-none select-none z-20">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-turquoise/40 via-petrol/20 to-transparent" />

            {/* Large index number — editorial hero */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 mix-blend-screen">
              <span
                className="text-white/[0.15] font-black leading-none tracking-tighter"
                style={{ fontSize: "clamp(5rem, 10vw, 12rem)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Bottom content — title integrated into the card */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 drop-shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-turquoise group-hover:shadow-[0_0_8px_rgba(10,147,150,0.8)] transition-shadow" />
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-white/80 uppercase font-bold drop-shadow-md">
                  Pillar {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {/* <p className="text-white text-[clamp(1rem,2vw,1.5rem)] font-semibold tracking-tight leading-snug line-clamp-2">
                {pillar.title}
              </p> */}
            </div>

            {/* Top-right corner bracket */}
            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 w-6 h-6 border-t border-r border-white/20" />
          </div>

          {/* Hover overlay — on top of everything */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none opacity-0 z-30"
          />
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
        <span className="w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-hover:mr-4 opacity-0 transition-all duration-500 ease-out text-gold font-light">
          →
        </span>
        <h3 ref={titleRef} className={titleClassName}>
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
