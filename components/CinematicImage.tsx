"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  priority?: boolean;
}

export default function CinematicImage({
  src,
  alt,
  className = "",
  overlay = false,
  priority = false,
}: CinematicImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Slow, premium Mask Wipe Reveal
      if (maskRef.current && containerRef.current) {
        gsap.to(maskRef.current, {
          yPercent: -100,
          ease: "expo.inOut",
          duration: 1.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Triggers slightly before fully in view
          },
        });
      }

      // 2. Buttery smooth WebGL-style Parallax
      if (imageWrapperRef.current && containerRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          {
            yPercent: -15,
            scale: 1.15,
          },
          {
            yPercent: 15,
            scale: 1.05, // Slight continuous scale down
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* The Parallax Image Container (Scaled up to allow movement) */}
      <div
        ref={imageWrapperRef}
        className="absolute w-full h-[130%] -top-[15%] left-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover object-center"
        />
      </div>

      {/* Cinematic Film Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Optional Dark Baseline Fade */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-80" />
      )}

      {/* Brutalist Solid Black Entry Mask */}
      <div
        ref={maskRef}
        className="absolute inset-0 bg-[#020202] z-10 pointer-events-none"
      />
    </div>
  );
}
