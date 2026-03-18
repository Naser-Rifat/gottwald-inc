"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoPanelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const toplineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Topline: character-by-character reveal
      if (toplineRef.current) {
        const text = toplineRef.current.textContent || "";
        toplineRef.current.innerHTML = text
          .split("")
          .map(
            (char) =>
              `<span class="inline-block overflow-hidden"><span class="char-mask inline-block translate-y-full opacity-0">${char === " " ? "&nbsp;" : char}</span></span>`
          )
          .join("");

        gsap.to(toplineRef.current.querySelectorAll(".char-mask"), {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.025,
          ease: "power4.out",
          scrollTrigger: {
            trigger: toplineRef.current,
            start: "top 85%",
          },
        });
      }

      // Tagline: word-level 3D flip
      if (taglineRef.current) {
        const words = taglineRef.current.textContent?.split(" ") || [];
        taglineRef.current.innerHTML = words
          .map(
            (word) =>
              `<span class="inline-block overflow-hidden mr-[0.3em]" style="perspective:600px"><span class="tag-word inline-block" style="transform:translateY(120%) rotateX(-60deg);transform-origin:bottom center;opacity:0">${word}</span></span>`
          )
          .join("");

        gsap.to(taglineRef.current.querySelectorAll(".tag-word"), {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 85%",
          },
        });
      }

      // Description paragraph fade-up
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: descRef.current,
              start: "top 88%",
            },
          }
        );
      }

      // CTA button scale-in
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
            },
          }
        );
      }

      // Parallax: headings drift up at different rates
      if (toplineRef.current) {
        gsap.to(toplineRef.current, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
      if (taglineRef.current) {
        gsap.to(taglineRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="video-panel-section"
      className="flex flex-col px-gutter w-full min-h-screen py-[15vh]"
    >
      {/* Animated headings */}
      <div className="about-headers pb-[8vh]">
        <div className="overflow-hidden w-full">
          <h1
            ref={toplineRef}
            id="h1-topline"
            className="text-[5vw] lg:text-[6vw] mb-0 text-white uppercase tracking-tight"
          >
            Peace. Love. Harmony
          </h1>
        </div>
        <div className="overflow-hidden w-full">
          <h1
            ref={taglineRef}
            id="h1-tagline"
            className="text-[5vw] lg:text-[6vw] mb-0 text-white tracking-tight uppercase"
          >
            for more Humanity.
          </h1>
        </div>
      </div>

      {/* About paragraphs */}
      <div className="flex flex-col items-end pb-[10vh]">
        <p
          ref={descRef}
          className="w-[40%] mb-8 text-md md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-white/70 font-sans opacity-0"
        >
          GOTT WALD is not a collection of services. It is a unified
          architecture: modular components, one standard, one language of
          delivery—built to turn complexity into clarity, clarity into
          decisions, and decisions into measurable impact.
        </p>
        <div ref={ctaRef} className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-sans opacity-0">
          <Link href="/about">
            <button
              className="h-11.5 w-fit rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                         tracking-[0.02em] transition-colors mt-4
                         bg-white/20 text-white hover:bg-white/15 border border-white/10"
              style={{ padding: "0 18px 0 22px" }}
            >
              <span>About Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </button>
          </Link>
        </div>
      </div>

      {/* Video panel anchors */}
      <div id="video-panel-start" className="w-1/2 aspect-video mt-[5vh]" />

      <div
        id="video-panel-end-parent"
        className="relative w-full mt-[10vh] mb-[5vh] aspect-video 3xl:h-[70vh] 3xl:aspect-auto"
      >
        <div
          id="video-panel-end"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}
