"use client";

import { useEffect, useRef, useCallback } from "react";
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

      gsap.to(image, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
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
        className={`relative overflow-hidden rounded-xl ${imageClassName}`}
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
              {/* Optional: Add a dark gradient at bottom for text readability if image exists */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>
          )}

          {/* 3. Foreground Text / Accents (Sits above background and image) */}
          <div className="absolute inset-0 pointer-events-none select-none z-20">
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-gold/40 via-gold/10 to-transparent" />

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
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-white/60 uppercase font-medium">
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
            <span className="text-[10px] tracking-[0.15em] text-white/35 uppercase font-normal">
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
    </Link>
  );
}
