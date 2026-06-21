"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import AmbientAurora from "@/components/AmbientAurora";

import { useSplitTextReveal } from "./_hooks/useSplitTextReveal";
import { useScrollFadeIn } from "./_hooks/useScrollFadeIn";
import { useScrollParallax } from "./_hooks/useScrollParallax";

import HeadingPair from "./_components/HeadingPair";
import AboutBlock from "./_components/AboutBlock";
import VideoPanelAnchors from "./_components/VideoPanelAnchors";

/**
 * VideoPanelSection — "openness" beat of the home narrative. Two
 * massive stacked headings with character + word reveals, an about
 * paragraph, a CTA to /about, and two invisible anchors that drive
 * the WebGL video panel positioning (see lib/videoPanelShader.ts).
 */
export default function VideoPanelSection() {
  const t = useTranslations("home.videoPanel");
  const topline = t("topline");
  const tagline = t("tagline");

  const sectionRef = useRef<HTMLElement>(null);
  const toplineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useSplitTextReveal({ ref: toplineRef, text: topline, mode: "char" });
  useSplitTextReveal({ ref: taglineRef, text: tagline, mode: "word" });

  useScrollFadeIn({
    ref: descRef,
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
  });
  useScrollFadeIn({
    ref: ctaRef,
    from: { y: 30, opacity: 0, scale: 0.92 },
    to: {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.4)",
    },
    start: "top 90%",
  });

  useScrollParallax({ ref: toplineRef, scopeRef: sectionRef, yPercent: -20 });
  useScrollParallax({ ref: taglineRef, scopeRef: sectionRef, yPercent: -12 });

  return (
    <section
      ref={sectionRef}
      id="video-panel-section"
      data-journey="openness"
      aria-label="Company Mission"
      className="relative flex flex-col px-gutter w-full min-h-screen py-[15vh] overflow-hidden"
    >
      <AmbientAurora />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col relative z-10">
        <HeadingPair
          topline={topline}
          tagline={tagline}
          toplineRef={toplineRef}
          taglineRef={taglineRef}
        />
        <AboutBlock descRef={descRef} ctaRef={ctaRef} />
      </div>

      <VideoPanelAnchors />
    </section>
  );
}
