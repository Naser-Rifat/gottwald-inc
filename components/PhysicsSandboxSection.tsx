"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import Header from "./Header";

export default function PhysicsSandboxSection() {
  const t = useTranslations("home.hero");
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const hero = heroRef.current!;
      const words = hero.querySelectorAll(".hero-word");
      const desc = hero.querySelector(".hero-desc");
      const topLabel = hero.querySelector(".hero-top-label");
      const scrollBtn = scrollBtnRef.current;
      const header = headerRef.current;
      const orb = orbRef.current;
      const accentLine = hero.querySelector(".accent-line");

      // Initial states
      gsap.set(words, { y: "130%", rotateX: -45, opacity: 0 });
      gsap.set(
        [desc, topLabel, scrollBtn, header].filter(Boolean),
        { opacity: 0 }
      );
      if (orb) gsap.set(orb, { scale: 0, opacity: 0 });
      if (accentLine) gsap.set(accentLine, { scaleX: 0 });

      const tl = gsap.timeline({ delay: 0.3 });

      // Header fades in first
      if (header) {
        tl.to(header, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Top label reveals with clip
      if (topLabel) {
        tl.fromTo(
          topLabel,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "-=0.3"
        );
      }

      // Words cascade with 3D rotation
      tl.to(words, {
        y: "0%",
        rotateX: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.12,
        ease: "power4.out",
      }, "-=0.4");

      // Accent line expands under heading
      if (accentLine) {
        tl.to(accentLine, {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
        }, "-=0.8");
      }

      // Ambient orb scales in
      if (orb) {
        tl.to(orb, {
          scale: 1,
          opacity: 0.7,
          duration: 1.5,
          ease: "power2.out",
        }, "-=1.2");
      }

      // Description + scroll indicator
      if (desc) {
        tl.fromTo(
          desc,
          { y: 20 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.8"
        );
      }

      if (scrollBtn) {
        tl.fromTo(
          scrollBtn,
          { y: 15 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        );
      }

      // Continuous animations — orb rotation + scroll arrow bob
      // Store in array so we can pause when off-screen
      const infiniteTweens: gsap.core.Tween[] = [];

      if (orb) {
        infiniteTweens.push(
          gsap.to(orb.querySelector(".orb-ring-1"), {
            rotation: 360,
            duration: 20,
            ease: "none",
            repeat: -1,
          }),
          gsap.to(orb.querySelector(".orb-ring-2"), {
            rotation: -360,
            duration: 15,
            ease: "none",
            repeat: -1,
          }),
          gsap.to(orb.querySelector(".orb-glow"), {
            scale: 1.3,
            opacity: 0.4,
            duration: 2.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      }

      const arrow = hero.querySelector(".hero-scroll svg");
      if (arrow) {
        infiniteTweens.push(
          gsap.to(arrow, {
            y: 4,
            x: 4,
            duration: 1.2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      }

      // Pause infinite tweens when hero scrolls off-screen
      const observer = new IntersectionObserver(
        ([entry]) => {
          infiniteTweens.forEach(t => entry.isIntersecting ? t.resume() : t.pause());
        },
        { threshold: 0.01 },
      );
      observer.observe(hero);

      // Parallax: title moves up slightly faster than section scroll
      gsap.to(hero.querySelector(".hero-title-block"), {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Magnetic hover for scroll button
  const handleScrollHover = useCallback((e: React.MouseEvent) => {
    const btn = scrollBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleScrollLeave = useCallback(() => {
    const btn = scrollBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  return (
    <>
      {/* Header — must be outside perspective section to maintain fixed positioning */}
      <div
        ref={headerRef}
        className="pointer-events-auto z-[100] w-full fixed top-0 left-0 px-gutter opacity-0"
      >
        <Header />
      </div>

      <section
        ref={heroRef}
        aria-label="GOTT WALD Hero — Turning Complexity Into Clarity"
        className="relative w-full h-screen flex flex-col pointer-events-none text-white overflow-hidden pb-[8vh] sm:pb-[10vh] px-gutter"
        style={{ perspective: "1000px" }}
      >
      <div className="flex-1 flex items-end z-10 relative w-full mx-auto pointer-events-auto">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-8">
          {/* Left: Label + Title */}
          <div className="hero-title-block flex flex-col gap-6 lg:gap-8 w-full lg:w-auto">
            <div className="hero-top-label flex items-center gap-3 opacity-0">
              {/* CI pill */}
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] tracking-[0.2em] font-bold uppercase"
                style={{
                  borderColor: "rgba(18,168,172,0.35)",
                  color: "rgba(18,168,172,0.9)",
                  backgroundColor: "rgba(18,168,172,0.06)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-turquoise/80 animate-pulse" />
                Gott Wald Area
              </span>
            </div>

            {/* Hero text owned by next-intl. translate="no" keeps Google
                Translate from wrapping the .hero-word spans in <font> tags,
                which would break the GSAP word-flip reveal. */}
            <h1
              translate="no"
              className="notranslate font-light tracking-[-0.03em] leading-[0.95] uppercase mix-blend-screen shrink-0"
              style={{
                fontSize: "calc(clamp(1.6rem, 5.5vw, 8rem) * var(--heading-scale))",
                transformStyle: "preserve-3d",
              }}
            >
              <span className="block overflow-hidden py-1">
                <span className="hero-word block" style={{ transformOrigin: "bottom center" }}>
                  {t("line1")}
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-word block text-white/90" style={{ transformOrigin: "bottom center" }}>
                  {t("line2")}
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-word block" style={{ transformOrigin: "bottom center" }}>
                  {t("line3")}
                </span>
              </span>
            </h1>

            {/* Accent line under heading — petrol → turquoise → gold */}
            <div
              className="accent-line h-[2px] w-full max-w-[320px] origin-left"
              style={{
                background: "linear-gradient(90deg, rgba(18,168,172,0.8) 0%, rgba(0,109,132,0.6) 40%, rgba(212,175,55,0.4) 80%, transparent 100%)",
              }}
            />
          </div>

          {/* Right: Orb + Scroll */}
          <div className="flex flex-row lg:flex-col justify-between items-end lg:items-end w-full lg:w-auto gap-4 lg:gap-6 mb-2">
            {/* Ambient orb */}
            <div
              ref={orbRef}
              className="hidden lg:flex w-32 h-32 relative items-center justify-center mix-blend-screen pointer-events-none mb-4 scale-0 opacity-0"
            >
              {/* Petrol outer ring */}
              <div className="orb-ring-1 absolute inset-0 rounded-full" style={{ border: "1px solid rgba(0,109,132,0.5)" }} />
              {/* Turquoise inner ring */}
              <div className="orb-ring-2 absolute inset-3 rounded-full" style={{ border: "1px solid rgba(18,168,172,0.3)" }} />
              {/* Petrol core glow */}
              <div className="orb-glow absolute inset-6 blur-xl rounded-full" style={{ background: "rgba(18,168,172,0.12)" }} />
              {/* Gold center dot */}
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4af37", boxShadow: "0 0 12px rgba(212,175,55,0.9), 0 0 30px rgba(18,168,172,0.4)" }} />
            </div>

            {/* Scroll indicator */}
            <div
              ref={scrollBtnRef}
              className="hero-scroll group flex items-center gap-3 cursor-pointer lg:mt-8 opacity-0"
              style={{ willChange: "transform" }}
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              onMouseMove={handleScrollHover}
              onMouseLeave={handleScrollLeave}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/80 group-hover:text-white transition-colors"
              >
                <path
                  d="M5 5L19 19M19 19V5M19 19H5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/80 group-hover:text-white transition-colors pb-px">
                Scroll Down
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
