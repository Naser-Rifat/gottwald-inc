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
          {pillar.image ? (
            <Image
              src={pillar.image}
              alt={pillar.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              unoptimized
              onError={(e) => {
                // Hide the broken image and show fallback
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          {/* Fallback gradient (visible when image is missing or fails to load) */}
          <div className="absolute inset-0 bg-linear-to-br from-white/6 via-white/2 to-transparent flex items-end p-6 pointer-events-none">
            <span className="text-white/10 text-[clamp(1.2rem,3vw,2.5rem)] font-bold uppercase tracking-tight leading-tight line-clamp-3">
              {pillar.title}
            </span>
          </div>
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none opacity-0"
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
