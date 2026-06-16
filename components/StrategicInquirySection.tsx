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
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
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

    // Mouse Parallax for Background Elements
    const handleParallax = (e: MouseEvent) => {
      if (bgTextRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 60;
        const y = (e.clientY / window.innerHeight - 0.5) * 60;
        gsap.to(bgTextRef.current, { x, y, duration: 1.5, ease: "power2.out" });
      }
      if (auroraRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * -120; // moves opposite
        const y = (e.clientY / window.innerHeight - 0.5) * -120;
        gsap.to(auroraRef.current, { x, y, duration: 2.5, ease: "power3.out" });
      }
    };

    section.addEventListener("mousemove", handleParallax);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", handleParallax);
    };
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
      className="relative z-10 w-full min-h-svh bg-base border-t border-white/[0.05] overflow-hidden flex items-center"
    >
      {/* Architectural anchor — massive italic "alignment." floats behind
          the headline area as the section's ghost echo. Repositioned to
          the upper-left so the colossal italic word lives behind the
          INITIATE STRATEGIC headline (which covers it at full opacity)
          rather than behind the colophon strip at the bottom (where its
          ghost letters previously competed with the silver/55 metadata).
          Manifesto: "before the mind understands, something is happening." */}
      {/* Architectural anchor — massive italic "alignment." floats behind */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[6%] -left-[6vw] z-0 select-none"
      >
        <span
          ref={bgTextRef}
          className="block italic font-light text-white/[0.03] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(11rem, 22vw, 26rem)",
          }}
        >
          alignment.
        </span>
      </div>

      {/* Premium Liquid Aurora Background */}
      <div 
        ref={auroraRef}
        className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen pointer-events-none opacity-[0.15] blur-[100px] z-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gold to-petrol rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      {/* Brand signal-language anchor — subtle frequency wave subscribes
          to LivingEnvironment's --orchestration-pace + --rand-phase-signal
          so it drifts in step with the site's scroll-velocity-driven
          breath. Connects this section to the brand's frequency/signal
          vocabulary (also seen in the PILLARS imagery and TuningInstrument
          HUD) without becoming dashboard decoration. The wave is two
          opacity-stacked sine curves at low opacity, gradient-faded at
          both edges so it reads as ambient signal, not a hard graphic. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] lg:h-[28vh] z-0 overflow-hidden"
      >
        <div
          className="strategic-signal-drift absolute bottom-0 left-0 w-[200%] h-full will-change-transform"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        >
          <svg
            viewBox="0 0 1600 200"
            preserveAspectRatio="none"
            className="block w-full h-full"
            aria-hidden="true"
          >
            <path
              d="M0,100 Q100,40 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100 T1400,100 T1600,100"
              fill="none"
              stroke="rgba(18, 168, 172, 0.20)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,130 Q100,90 200,130 T400,130 T600,130 T800,130 T1000,130 T1200,130 T1400,130 T1600,130"
              fill="none"
              stroke="rgba(18, 168, 172, 0.10)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
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
          <div className="lg:col-span-7 relative">
            <h2 className="strategic-reveal text-[clamp(3.5rem,6.5vw,8.5rem)] font-black leading-[0.83] tracking-[-0.055em] text-white uppercase opacity-0">
              Initiate <br />
              Strategic
              {/* Overflow-hidden mask + inner span ref. GSAP raises the
                  inner span y:100%→0% on scroll, performing the italic
                  word as a typographic event — the section's signature
                  memorable moment. pb-[0.18em] gives the Playfair italic
                  descenders ("g" tail, period stem) breathing room so
                  the overflow-hidden mask doesn't clip them. */}
              <span className="block pt-2 pb-[0.18em] overflow-hidden">
                <span
                  ref={alignmentRef}
                  className="block text-[0.85em] normal-case leading-[1] tracking-[-0.04em] text-turquoise"
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
          <div className="strategic-reveal lg:col-span-5 lg:pt-4 flex flex-col gap-8 opacity-0">
            {/* Lead — dramatically larger than body. The scale jump alone
                signals the chapter opening; no decorative marker needed.
                Default view's ONLY visible body line, Pentagram-style
                restraint. The body, operating principle, and expanded
                clauses all live behind the disclosure below. */}
            <p className="text-[clamp(1.7rem,2.6vw,3rem)] font-light leading-[1.18] tracking-[-0.018em] text-white max-w-[22ch]">
              We are currently selecting a limited number of values-aligned
              partners for our{" "}
              <strong className="font-semibold text-white">
                2030 infrastructure cycles.
              </strong>
            </p>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group flex items-center gap-3 self-start text-[10px] tracking-[0.25em] uppercase font-medium text-white/50 hover:text-white transition-colors duration-300 focus:outline-none mt-2"
            >
              <span className="w-6 h-[1px] bg-white/30 group-hover:bg-white/80 transition-colors" />
              <span>{expanded ? "SHOW LESS" : "DISCOVER MORE"}</span>
            </button>

            {/* Progressive disclosure — body + operating principle + the
                three expanded clauses all live here. Default view shows
                only the lead paragraph above; clicking discover more opens
                the full editorial flow. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                expanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!expanded}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-6 pt-1">
                  <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
                    This channel is reserved for principals and operators who
                    build resilient systems—and who treat trust, discipline,
                    and delivery as non-negotiable.
                  </p>
                  <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
                    We operate{" "}
                    <span className="text-white/95">discreet by default</span>{" "}
                    and{" "}
                    <span className="text-white/95">
                      standards-led by design
                    </span>
                    : a governance-first framework, engineered for execution,
                    built to compound performance over time.
                  </p>
                  <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/65 max-w-[58ch]">
                    No noise. No public theatrics. Clean interfaces, controlled
                    access, measurable outcomes.
                  </p>
                  <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/80 max-w-[58ch]">
                    If your work demands precision, confidentiality, and
                    long-horizon thinking—this is the entry point.
                  </p>
                </div>
              </div>
            </div>

            {/* Closing editorial verse — CTA in confident sans uppercase */}
            <div
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              className="inline-block self-start mt-6 lg:mt-10"
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
