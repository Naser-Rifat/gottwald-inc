"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * StrategicInquirySection — closing partnership invitation.
 *
 * Editorial Awwwards-grade composition. Every original word preserved:
 * massive headline, four body paragraphs (with the expanded "governance-
 * first framework / clean interfaces / long-horizon thinking" lines),
 * Discover More/Less progressive disclosure, Request Strategic Call CTA,
 * "Confidential inquiry. Values-first selection." italic colophon, and
 * the Confidential by default / Standards-led governance / Network
 * capacity 888± trio.
 *
 * What changes is the visual register: pill-shaped badges become an inline
 * editorial caption strip; the template pill-button CTA becomes a magnetic
 * inline link; the centered SaaS-style layout becomes an asymmetric
 * magazine spread (headline left, prose right) so the page reads as
 * editorial publication rather than dashboard panel.
 */
export default function StrategicInquirySection() {
  const t = useTranslations("home.strategicInquiry");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const alignmentRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll(".strategic-reveal"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        },
      );

      // MOVE 1 — Kinetic "Alignment." reveal (enhanced).
      // The italic Playfair word rises from below an overflow-hidden mask
      // with a subtle scale-settle and opacity emerge — a "focus pull"
      // cinematic effect, like a stage entrance. The slight delay (0.3s)
      // lets the main strategic-reveal stagger land first, so the word
      // appears as the closing punctuation of the section's entrance —
      // not as one of many reveals.
      //
      // Transform-origin at left bottom so the scale grows anchored to
      // the bottom-left of the word, matching the "rising from below"
      // metaphor. Under reduced-motion, settle instantly.
      if (alignmentRef.current) {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reducedMotion) {
          gsap.set(alignmentRef.current, { y: "0%", opacity: 1, scale: 1 });
        } else {
          gsap.set(alignmentRef.current, { transformOrigin: "left bottom" });
          gsap.fromTo(
            alignmentRef.current,
            { y: "100%", scale: 0.92, opacity: 0.4 },
            {
              y: "0%",
              scale: 1,
              opacity: 1,
              duration: 1.7,
              delay: 0.3,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
              },
            },
          );
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Magnetic CTA — cursor pull within a small radius, elastic snap back.
  const handleCtaMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.22,
      y: y * 0.22,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleCtaMouseLeave = useCallback(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      data-journey="decision"
      aria-label="Strategic Partnership Inquiry"
      className="relative z-10 w-full min-h-[100svh] bg-base border-t border-white/[0.05] overflow-hidden flex items-center"
    >
      {/* Architectural anchor — massive italic "alignment." floats behind
          the headline area as the section's ghost echo. Repositioned to
          the upper-left so the colossal italic word lives behind the
          INITIATE STRATEGIC headline (which covers it at full opacity)
          rather than behind the colophon strip at the bottom (where its
          ghost letters previously competed with the silver/55 metadata).
          Manifesto: "before the mind understands, something is happening." */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[6%] -left-[6vw] z-0 select-none"
      >
        <span
          className="block italic font-light text-white/[0.03] leading-[0.78] tracking-[-0.06em] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(11rem, 22vw, 26rem)",
          }}
        >
          alignment.
        </span>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1500px] mx-auto px-gutter py-[12vh] lg:py-[14vh] flex flex-col gap-[8vh] lg:gap-[10vh]"
      >
        {/* Asymmetric magazine spread: headline left, prose right. No
            literal divider — the column gap IS the separation. Negative
            space carries the composition; a gradient hairline previously
            sat here but collided with the massive headline letterforms at
            large viewports, so it was removed. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative">
          {/* Left — massive editorial headline. "INITIATE STRATEGIC"
              massive sans, "Alignment." Playfair italic turquoise accent. */}
          <div className="lg:col-span-6 relative">
            <h2 className="strategic-reveal text-[clamp(4rem,8.6vw,11rem)] font-black leading-[0.83] tracking-[-0.055em] text-white uppercase opacity-0">
              Initiate <br />
              Strategic
              {/* Overflow-hidden mask + inner span ref. GSAP raises the
                  inner span y:100%→0% on scroll, performing the italic
                  word as a typographic event — the section's signature
                  memorable moment. */}
              <span className="block pt-2 overflow-hidden">
                <span
                  ref={alignmentRef}
                  className="block text-[0.78em] normal-case leading-[0.85] tracking-[-0.04em] text-turquoise"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    transform: "translateY(100%)",
                  }}
                >
                  Alignment.
                </span>
              </span>
            </h2>
          </div>

          {/* Right — editorial prose column. Lead paragraph IS the chapter
              opening (no separate marker — the typographic scale jump is
              the structural cue); body settles into reading rhythm;
              disclosure folds inline as italic em-dash continuation; CTA
              reads as the closing editorial verse in confident sans, not
              theatrical Playfair. */}
          <div className="strategic-reveal lg:col-span-6 lg:pt-4 flex flex-col gap-8 opacity-0">
            {/* Lead — dramatically larger than body. The scale jump alone
                signals the chapter opening; no decorative marker needed. */}
            <p className="text-[clamp(1.7rem,2.6vw,3rem)] font-light leading-[1.18] tracking-[-0.018em] text-white max-w-[22ch]">
              We are currently selecting a limited number of values-aligned
              partners for our{" "}
              <strong className="font-semibold text-white">
                2030 infrastructure cycles.
              </strong>
            </p>

            {/* Body — quiet, settled into reading scale. */}
            <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
              This channel is reserved for principals and operators who build
              resilient systems—and who treat trust, discipline, and delivery
              as non-negotiable.
            </p>

            {/* Operating principle — discover-more folded INLINE as italic
                continuation. No button, no separate row. Clicking the
                italic phrase reveals the expansion below. */}
            <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
              We operate{" "}
              <span className="text-white/95">discreet by default</span> and{" "}
              <span className="text-white/95">standards-led by design</span>
              {" — "}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="italic font-light text-turquoise/90 hover:text-turquoise underline decoration-turquoise/35 hover:decoration-turquoise/80 underline-offset-[6px] decoration-1 transition-colors duration-300 align-baseline cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-turquoise/60 focus-visible:outline-offset-4 rounded-xs"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {expanded ? "show less" : "discover more"}
              </button>
              {expanded ? ":" : "."}
            </p>

            {/* Progressive disclosure — folds inline as continuation
                clauses, not a modal. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                expanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!expanded}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-5">
                  <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/65 max-w-[58ch] italic">
                    a governance-first framework, engineered for execution,
                    built to compound performance over time.
                  </p>
                  <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/65 max-w-[58ch]">
                    No noise. No public theatrics. Clean interfaces, controlled
                    access, measurable outcomes.
                  </p>
                  <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/72 max-w-[58ch]">
                    If your work demands precision, confidentiality, and
                    long-horizon thinking—this is the entry point.
                  </p>
                </div>
              </div>
            </div>

            {/* Section signature rule — gold→petrol horizontal gradient
                above the closing editorial verse. Symbolically: positive
                action (gold) grounded in deep structure (petrol). Adds
                the missing 5th brand color (petrol) without disrupting
                composition. Anchors the CTA as the section's deliberate
                conclusion mark. */}
            <span
              aria-hidden="true"
              className="block h-px w-24 lg:w-32 bg-gradient-to-r from-gold/70 to-petrol/55 mt-2"
            />

            {/* Closing editorial verse — CTA in confident sans uppercase
                with light weight. Boosted scale + longer hairline +
                slightly heavier gold lit segment so it reads as the
                section's conclusion, not a quiet whisper. The
                gold-growing hairline is the eye-catcher moment. */}
            <div
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              className="inline-block self-start"
            >
              <Link
                ref={ctaRef}
                href="/partnerships#apply"
                translate="no"
                className="group inline-flex items-center gap-6 text-white hover:text-gold transition-colors duration-500 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold/60 focus-visible:outline-offset-6"
              >
                <span className="font-light uppercase tracking-[0.18em] text-[clamp(1.05rem,1.2vw,1.3rem)]">
                  {t("requestCall")}
                </span>
                {/* Two-tone hairline: silver base, gold lit segment that
                    extends on hover. Longer and slightly heavier than the
                    minimal earlier version — anchors the CTA as the
                    section's conversion moment. */}
                <span className="relative inline-block w-24 h-px bg-silver/45 overflow-visible">
                  <span className="absolute inset-y-0 left-0 w-4 bg-gold transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                </span>
                <span className="text-current text-base group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>

            {/* Italic colophon — quiet whisper directly under the CTA. */}
            <p
              className="text-silver/55 leading-[1.5] -mt-3"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
              }}
            >
              Confidential inquiry. Values-first selection.
            </p>
          </div>
        </div>

        {/* Closing caption — section colophon. A thin silver rule above
            separates it from the editorial column above, marking it as
            deliberate section metadata (magazine convention: rule +
            colophon = standard editorial footer). Gold dot prefix anchors
            the strip; opacity lifted slightly for legibility without
            losing restraint. */}
        <div className="strategic-reveal flex flex-col gap-5 opacity-0 mt-2">
          <span
            aria-hidden="true"
            className="block h-px w-full bg-silver/15"
          />
          <div className="flex items-center gap-3">
            <span className="block w-1 h-1 rounded-full bg-gold/70" />
            <p className="text-[10px] tracking-[0.32em] uppercase text-silver/55 font-medium">
              Confidential by default — Standards-led governance — Network
              capacity: 888±
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
