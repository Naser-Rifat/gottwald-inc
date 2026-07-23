"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-bootstrap";

import Header from "@/components/layout/Header";
import FooterSection from "@/components/layout/FooterSection";
import { usePageColorShift } from "@/lib/usePageColorShift";
import { useBackgroundMouseParallax } from "@/lib/useBackgroundMouseParallax";

import BackgroundLayers from "./_components/BackgroundLayers";
import HeroSection from "./_components/HeroSection";
import ContactInfoCard from "./_components/ContactInfoCard";
import ContactFormCard from "./_components/ContactFormCard";
import ConclusionSection from "./_components/ConclusionSection";

/**
 * ContactClient — orchestrator for the /contact route.
 *
 * Owns:
 *   - the global GSAP entrance choreography (hero clip-path slide,
 *     `.fade-up-element` cards, separator scaleX, status-pulse, hero
 *     eyebrow, mouse parallax),
 *   - the GlobalCanvas page-tint shift toward Golden Amber,
 *   - composition of the five visual blocks (background, hero, info
 *     card, form card, conclusion).
 *
 * Section markup lives in `_components/`; particle decoration data
 * lives in `_data/particles.ts`. The GSAP context targets sections
 * via class hooks so the child components stay animation-agnostic.
 */
export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  // Contact page shifts the GlobalCanvas to Golden Amber.
  usePageColorShift("#b67d33");

  // Background mouse parallax (watermark + aurora) — rAF-gated, passive,
  // reduced-motion aware. Replaces the inlined mousemove handler.
  useBackgroundMouseParallax([
    { selector: ".contact-parallax-target", intensity: 160, duration: 1.5, ease: "power2.out" },
    { selector: ".contact-liquid-aurora", intensity: -250, duration: 2.5, ease: "power3.out" },
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hoisted once for the entire context — any future motion-sensitive
      // tween in this block can read this without re-querying matchMedia
      // or shadowing inside a nested scope.
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // 1. Hero text reveal — clip-path slide up with light rotation.
      if (heroTextRef.current) {
        const lines = heroTextRef.current.querySelectorAll(".hero-line span");
        gsap.fromTo(
          lines,
          { yPercent: 120, rotationZ: 5, opacity: 0 },
          {
            yPercent: 0,
            rotationZ: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.2,
          },
        );

        // Hero breathing pulse — skipped under reduced-motion (the
        // scale-1.008 infinite loop is exactly what the OS preference is
        // meant to silence).
        if (!reducedMotion) {
          gsap.to(heroTextRef.current, {
            scale: 1.008,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            transformOrigin: "left center",
          });
        }
      }

      // 2. Form & details fade up.
      gsap.fromTo(
        ".fade-up-element",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".content-grid",
            start: "top 80%",
          },
        },
      );

      // 3. Animated separator line.
      if (separatorRef.current) {
        gsap.fromTo(
          separatorRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: separatorRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 4. Status pulse reveal.
      gsap.fromTo(
        ".status-pulse",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
        },
      );

      // 5. Eyebrow reveal (unused at present but kept warm in case the
      //    hero eyebrow copy returns; harmless no-op if no element matches).
      gsap.fromTo(
        ".hero-eyebrow",
        { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.8,
        },
      );

      // Background mouse parallax is handled by useBackgroundMouseParallax
      // (called outside this effect); it's rAF-gated and passive.
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white selection:bg-gold selection:text-black overflow-hidden flex flex-col relative"
    >
      <BackgroundLayers />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[25vh] pb-32 relative z-10">
        <HeroSection heroTextRef={heroTextRef} separatorRef={separatorRef} />

        {/* Content grid — left contact card, right form card. */}
        <section className="content-grid px-gutter grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 relative">
          {/* Form Watermark — italic "office." ghost echo. */}
          {/* Wrapped in an `overflow-hidden` container so the ghost text
              can no longer push the viewport wider than the screen on
              320 px mobile. Audit dated 2026-07-16 flagged /contact
              rendering at 352 px on a 320 px viewport (horizontal scroll).
              Font-size min tightened from 8rem to 4rem so it fits in
              320 px without relying on the outer clip alone. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-5%] right-[-5vw] z-0 select-none opacity-30 max-w-full overflow-hidden"
          >
            <span
              className="contact-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(4rem, 15vw, 20rem)",
              }}
            >
              office.
            </span>
          </div>

          <ContactInfoCard />
          <ContactFormCard />
        </section>
      </main>

      <ConclusionSection />

      <FooterSection />
    </div>
  );
}
