"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StrategicInquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Glow parallax drift on scroll
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: -30,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Eyebrow: clip reveal with horizontal line expansion
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            duration: 1,
            ease: "power4.inOut",
            scrollTrigger: { trigger: eyebrowRef.current, start: "top 88%" },
          }
        );
      }

      // Heading: word-by-word 3D flip reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".heading-line");
        lines.forEach((line, lineIdx) => {
          const words = line.querySelectorAll(".word-mask");
          gsap.fromTo(
            words,
            { y: "120%", rotateX: -90, opacity: 0 },
            {
              y: "0%",
              rotateX: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.06,
              ease: "power4.out",
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top 82%",
              },
              delay: lineIdx * 0.15,
            }
          );
        });
      }

      // Gradient shimmer on the "ALIGNMENT." text
      const shimmer = section.querySelector(".shimmer-text");
      if (shimmer) {
        gsap.fromTo(
          shimmer,
          { backgroundPosition: "200% center" },
          {
            backgroundPosition: "-200% center",
            duration: 3,
            ease: "none",
            repeat: -1,
            scrollTrigger: {
              trigger: shimmer,
              start: "top 85%",
              toggleActions: "play pause resume pause",
            },
          }
        );
      }

      // Body text: staggered line fade-up
      if (bodyRef.current) {
        const paras = bodyRef.current.querySelectorAll(".body-line");
        gsap.fromTo(
          paras,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: bodyRef.current, start: "top 85%" },
          }
        );
      }

      // CTA button: scale up + fade
      if (ctaWrapRef.current) {
        gsap.fromTo(
          ctaWrapRef.current,
          { scale: 0.85, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ctaWrapRef.current, start: "top 88%" },
          }
        );
      }

      // Pills: staggered reveal from bottom
      if (pillsRef.current) {
        const pills = pillsRef.current.querySelectorAll(".proof-pill");
        gsap.fromTo(
          pills,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: { trigger: pillsRef.current, start: "top 90%" },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Magnetic hover for CTA button
  const handleCtaMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
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
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Strategic Partnership Inquiry"
      className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5 overflow-hidden font-sans flex flex-col items-center justify-center min-h-screen"
    >
      {/* Background glow — animated on scroll */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] bg-gold/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />

      <div className="w-full max-w-[95vw] lg:max-w-[85vw] mx-auto flex flex-col items-center text-center relative z-10">
        {/* Eyebrow — clip reveal */}
        <p
          ref={eyebrowRef}
          className="text-gold text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase mb-8 opacity-0"
        >
          STRATEGIC INQUIRY // PRO DIVISION
        </p>

        {/* Monolithic Heading — word-by-word 3D flip */}
        <h2
          ref={headingRef}
          className="text-[clamp(3.5rem,7vw,9.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-16 w-full flex flex-col items-center"
          style={{ perspective: "800px" }}
        >
          <span className="heading-line block overflow-hidden">
            <span className="word-mask inline-block" style={{ transformOrigin: "bottom center" }}>
              INITIATE
            </span>{" "}
            <span className="word-mask inline-block" style={{ transformOrigin: "bottom center" }}>
              STRATEGIC
            </span>
          </span>
          <span className="heading-line block overflow-hidden">
            <span
              className="shimmer-text word-mask inline-block text-transparent bg-clip-text bg-size-[200%_100%]"
              style={{
                transformOrigin: "bottom center",
                backgroundImage:
                  "linear-gradient(90deg, #ffffff 0%, #888888 25%, #ffffff 50%, #888888 75%, #ffffff 100%)",
              }}
            >
              ALIGNMENT.
            </span>
          </span>
        </h2>

        {/* Editorial Text Block */}
        <div ref={bodyRef} className="flex flex-col items-center w-full mt-4">
          <div className="text-white/80 font-light text-[clamp(1rem,1.3vw,1.5rem)] leading-[1.6] flex flex-col gap-8 w-full max-w-[65ch] text-left md:text-center tracking-wide">
            <p className="body-line text-white">
              We are currently selecting a limited number of values-aligned
              partners for our{" "}
              <strong className="font-semibold text-white">
                2030 infrastructure cycles.
              </strong>
            </p>

            <div
              className="overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] text-left md:text-center w-full"
              style={{
                maxHeight: isExpanded ? "1500px" : "0px",
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? "1rem" : "0",
              }}
            >
              <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/10 w-full text-[clamp(1rem,1.3vw,1.5rem)] text-white/80">
                <p>
                  This channel is reserved for principals and operators who
                  build resilient systems—and who treat trust, discipline, and
                  delivery as non-negotiable.
                </p>
                <p>
                  We operate{" "}
                  <strong className="text-white font-medium">
                    discreet by default
                  </strong>{" "}
                  and{" "}
                  <strong className="text-white font-medium">
                    standards-led by design:
                  </strong>
                  <br />a governance-first framework, engineered for execution,
                  built to compound performance over time.
                  <br />
                  No noise. No public theatrics. Clean interfaces, controlled
                  access, measurable outcomes.
                </p>
                <p>
                  If your work demands precision, confidentiality, and
                  long-horizon thinking—this is the entry point.
                </p>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-white/20 w-full block"></div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="body-line group mx-auto flex items-center gap-4 text-[12px] font-bold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors mt-8 mb-16 w-max"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/50 group-hover:border-white group-hover:bg-white/5 transition-[border-color,background-color]">
                <span className="text-xl font-light leading-none mb-0.5">
                  {isExpanded ? "−" : "+"}
                </span>
              </div>
              <span>{isExpanded ? "DISCOVER LESS" : "DISCOVER MORE"}</span>
            </button>
          </div>
        </div>

        {/* CTA — magnetic hover */}
        <div ref={ctaWrapRef} className="flex flex-col items-center mt-8 w-full opacity-0">
          <div
            className="flex flex-col items-center gap-4"
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
          >
            <Link
              ref={ctaRef}
              href="/partnerships#apply"
              className="group relative flex items-center justify-center bg-transparent border-[1.5px] border-gold rounded-full px-10 py-5 overflow-hidden w-full sm:w-max transition-colors hover:bg-gold/10"
              style={{ willChange: "transform" }}
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="font-bold uppercase tracking-[0.15em] text-[13px] text-white">
                  REQUEST STRATEGIC CALL
                </span>
                <span className="text-white font-light text-xl transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>
            <span className="italic text-white/40 text-[13px] tracking-wide leading-tight font-light text-center">
              Confidential inquiry. Values-first selection.
            </span>
          </div>

          {/* Proof Pills — staggered bounce-in */}
          <div ref={pillsRef} className="w-full mt-12 flex justify-center">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Confidential by default",
                "Standards-led governance",
                "Network capacity: 888±",
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="proof-pill px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] tracking-widest uppercase text-white/50 cursor-default flex items-center gap-2 font-medium transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  <span className="text-gold font-bold mb-px opacity-70">
                    ·
                  </span>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
