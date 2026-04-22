"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const handleStrategicClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          router.push("/contact");
        }, 50);
      },
    });

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:100vh;left:0;width:100vw;height:100vh;background:#030303;z-index:99999;pointer-events:none;display:flex;align-items:center;justify-content:center;";

    const glow = document.createElement("div");
    glow.style.cssText =
      "position:absolute;width:100vw;height:100vw;background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 60%);mix-blend-mode:screen;filter:blur(40px);";
    overlay.appendChild(glow);
    document.body.appendChild(overlay);

    tl.to(btn, { opacity: 0, duration: 0.4, ease: "power2.out" }).to(
      overlay,
      { top: 0, duration: 0.8, ease: "expo.inOut" },
      "-=0.2",
    );

    setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        },
      });
    }, 1200);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Fade In — opacity+y only, GPU-composited
      gsap.fromTo(
        ".hero-manifest-text",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.15,
          delay: 0.1,
          force3D: true,
          clearProps: "transform",
        },
      );

      // Hero Text Parallax (Awwwards effect)
      gsap.to(".parallax-fast", {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".parallax-slow", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll Indicator Intro & Loop
      gsap.to(".scroll-indicator", {
        opacity: 1,
        duration: 1.5,
        delay: 2,
        ease: "power2.out",
      });
      gsap.to(".scroll-indicator-line", {
        yPercent: 200,
        duration: 2,
        repeat: -1,
        ease: "power1.inOut",
      });

      // 1.5 Hero Image Breathing — opacity shift only, NO scale (scale creates new compositor layer)
      gsap.to(".hero-bg-texture", {
        opacity: 0.65,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Ambient Light Breathing — opacity only, reduced frequency
      gsap.to(".ambient-light", {
        opacity: 0.35,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 3, from: "random" },
      });

      // 3. Reveal Elements on Scroll — Grouped Batching for High Performance
      ScrollTrigger.batch(".reveal-text", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.1,
              force3D: true,
              clearProps: "transform",
            }
          );
        },
        once: true,
      });

      // 3.5 "What we do differently" Custom Staggered Animation
      const staggerContainer = document.querySelector(".stagger-container");
      if (staggerContainer) {
        const staggerLines = gsap.utils.toArray(".stagger-line");
        const scaleLine = document.querySelector(".stagger-scaleX");

        if (scaleLine) {
          gsap.fromTo(
            scaleLine,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.out",
              force3D: true,
              scrollTrigger: { trigger: staggerContainer, start: "top 80%" },
            },
          );
        }

        gsap.fromTo(
          staggerLines,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: staggerContainer,
              start: "top 80%",
            },
          },
        );
      }

      // 3.6 Pillar Rows — Staggered reveal with number counter
      const pillarRows = gsap.utils.toArray(".pillar-row") as HTMLElement[];
      pillarRows.forEach((row, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%" },
        });

        tl.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.05,
          },
        );

        // Animate the number from 0 opacity to visible
        const numEl = row.querySelector("span");
        if (numEl) {
          tl.fromTo(
            numEl,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.8",
          );
        }
      });

      // 4. Axis Background Image Reveal — opacity only, NO blur filter animation
      gsap.to(".axis-bg", {
        opacity: 0.7,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".axis-trigger",
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        },
      });

      // 5. Case Studies Horizontal Scroll Wrapper (Sticky)
      const horizontalContainer = document.querySelector(
        ".cases-container",
      ) as HTMLElement;
      if (horizontalContainer) {
        gsap.to(horizontalContainer, {
          xPercent: -100 + 100 / 5,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: ".cases-wrapper",
            start: "top top",
            end: "+=3000",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // 6. Ecosystem Items — GSAP-powered hover microinteractions
      const ecoItems = gsap.utils.toArray(".eco-item") as HTMLElement[];
      ecoItems.forEach((item) => {
        const line = item.querySelector(".eco-line");
        const title = item.querySelector("h3");

        item.addEventListener("mouseenter", () => {
          gsap.to(line, { width: "100%", duration: 0.6, ease: "expo.out" });
          if (title)
            gsap.to(title, {
              x: 8,
              duration: 0.4,
              ease: "power2.out",
              force3D: true,
            });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(line, { width: "0%", duration: 0.5, ease: "power2.inOut" });
          if (title)
            gsap.to(title, {
              x: 0,
              duration: 0.3,
              ease: "power2.out",
              force3D: true,
            });
        });
      });

      // 7. Patron Section — floating orb parallax + content reveal
      const patronOrb = document.querySelector(".patron-orb");
      if (patronOrb) {
        gsap.to(patronOrb, {
          y: -60,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: ".patron-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // 8. CTA Section — cinematic entrance
      const ctaSection = document.querySelector(".cta-section");
      if (ctaSection) {
        const ctaElements = ctaSection.querySelectorAll(".cta-reveal");
        gsap.fromTo(
          ctaElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.2,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 75%",
            },
          },
        );

        // Pulsing glow on the CTA button
        const ctaBtn = ctaSection.querySelector(".cta-btn-glow");
        if (ctaBtn) {
          gsap.to(ctaBtn, {
            boxShadow: "0 0 80px rgba(212,175,55,0.3)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-[#050a12] min-h-screen text-white/80 font-sans overflow-hidden selection:bg-gold/20 selection:text-white"
    >
      <div className="fixed top-0 left-0 w-full z-[100] px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* ── HERO ── Awwwards-level cinematic composition */}
        <section className="hero-section relative w-full min-h-[100svh] bg-[#050a12] overflow-hidden flex flex-col">
          {/* ① Full-bleed image — covers 100% of hero */}
          <div
            className="hero-bg-texture absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.95, willChange: "opacity" }}
          >
            <div className="absolute inset-0 bg-[url('/images/about_hero_abstract_v2.png')] bg-cover bg-center bg-no-repeat opacity-90" />
            
            {/* CI Petrol/Turquoise Tint Overlay (Subtle) */}
            <div 
              className="absolute inset-0 mix-blend-color opacity-30" 
              style={{ background: "linear-gradient(135deg, rgba(0,109,132,1) 0%, rgba(18,168,172,1) 100%)" }} 
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#050a12]/70 via-[#050a12]/20 via-[45%] to-[#050a12]/95" />
            <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-[#050a12] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050a12]/85 via-transparent via-[55%] to-transparent" />
          </div>

          {/* ② Ambient orbs */}
          <div
            className="ambient-light absolute top-[0%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[140px] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(18,168,172,0.2) 0%, transparent 70%)",
              opacity: 0.6,
              willChange: "opacity",
            }}
          />
          <div
            className="ambient-light absolute bottom-[10%] right-[-5%] w-[50vw] h-[50vh] rounded-full blur-[140px] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(0,109,132,0.25) 0%, transparent 70%)",
              opacity: 0.7,
              willChange: "opacity",
            }}
          />

          {/* ③ HERO CONTENT */}
          <div className="relative z-10 flex flex-col justify-between flex-1 pt-[18vh] pb-0">
            {/* Eyebrow */}
            <div className="hero-manifest-text px-gutter flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span className="text-gold text-[9px] font-black tracking-[0.65em] uppercase">
                About Us
              </span>
              <span className="h-px w-8 bg-white/20" />
              <span className="text-white/60 text-[9px] font-bold tracking-[0.4em] uppercase">
                Gott Wald Holding
              </span>
            </div>

            {/* HEADLINE — full-viewport-width cascade */}
            <div className="px-gutter mt-8">
              <h1
                className="hero-manifest-text"
                aria-label="We Turn Complexity into Inevitability"
              >
                <div className="overflow-hidden">
                  <span
                    className="block font-black uppercase text-white leading-[0.82] tracking-[-0.04em] parallax-fast"
                    style={{ fontSize: "clamp(4rem, 12.5vw, 160px)" }}
                  >
                    WE TURN
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span
                    className="block font-black uppercase text-white leading-[0.82] tracking-[-0.04em] parallax-fast"
                    style={{ fontSize: "clamp(4rem, 12.5vw, 160px)" }}
                  >
                    COMPLEXITY
                  </span>
                </div>
                {/* Serif italic — offset right to break left-column monotony */}
                <div className="overflow-hidden flex justify-end pr-4 lg:pr-16 mt-2">
                  <span
                    className="block font-serif italic text-gold leading-[1.0] tracking-[-0.01em] parallax-slow"
                    style={{ fontSize: "clamp(2.8rem, 9vw, 118px)" }}
                  >
                    into inevitability.
                  </span>
                </div>
              </h1>
            </div>

            {/* BOTTOM BAR — full-width, left copy / right data */}
            <div className="hero-manifest-text px-gutter mt-auto border-t border-white/[0.08]">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-8">
                {/* Sub-copy — widened so text doesn't wrap on 3rd line */}
                <p className="text-white/80 text-lg lg:text-xl font-light leading-[1.65] max-w-lg">
                  If you&apos;re a CEO, founder, executive — or you run an SME
                  that must grow —{" "}
                  <strong className="text-white font-semibold">
                    you know this moment.
                  </strong>
                </p>

                {/* Data + scroll indicator */}
                <div className="flex items-end gap-10 lg:gap-14 shrink-0">
                  {[
                    { n: "5+", label: "Axes" },
                    { n: "7", label: "Entities" },
                    { n: "GEO", label: "Georgia HQ" },
                  ].map(({ n, label }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <span className="text-[2rem] font-black text-white leading-none tracking-tight">
                        {n}
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.45em] text-white/60 font-bold">
                        {label}
                      </span>
                    </div>
                  ))}

                  {/* Scroll indicator — just line, no text */}
                  <div className="scroll-indicator hidden sm:flex flex-col items-center gap-1 opacity-0 pb-0.5 ml-6">
                    <div className="w-px h-12 bg-white/15 relative overflow-hidden">
                      <div className="scroll-indicator-line absolute top-0 left-0 w-full h-full bg-gold -translate-y-[101%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NARRATIVE SCROLL SEQUENCE - CASCADING ELEGANCE */}
        <section className="bg-[#050a12] relative z-10 py-[25vh] overflow-hidden">
          
          {/* Subtle Ambient Light (No distracting watermarks) */}
          <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-turquoise/5 blur-[200px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] bg-petrol/10 blur-[200px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-gutter relative z-10 w-full flex flex-col space-y-[15vh]">
            
            {/* Block 1: The Observation */}
            <div className="reveal-text max-w-5xl">
              <p className="text-[clamp(2rem,3.5vw,3.5rem)] font-light text-white/70 leading-[1.3] parallax-slow">
                You can feel there&apos;s more possible...
                <span className="text-white/95 mt-4 block">yet something in the system keeps draining energy.</span>
              </p>
            </div>

            {/* Block 2: The Assessment */}
            <div className="reveal-text max-w-5xl">
              <p className="text-[clamp(2rem,3.5vw,3.5rem)] text-white/70 font-light leading-[1.3]">
                Too many topics, <strong className="text-white/95 font-normal">not enough sequence.</strong><br />
                Too much noise, <strong className="text-white/95 font-normal">not enough truth.</strong>
              </p>
            </div>

            {/* Block 3: The Weight */}
            <div className="reveal-text max-w-5xl parallax-fast">
              <p className="text-[clamp(2rem,3.5vw,3.5rem)] font-light text-white/70 leading-[1.3]">
                And even though everyone is smart, it doesn&apos;t get lighter —{" "}
                <span className="text-white font-semibold">
                  it just gets fuller.
                </span>
              </p>
            </div>

            {/* Block 4: The Turn */}
            <div className="reveal-text text-center pt-[5vh]">
              <div className="w-12 h-px bg-gold/40 mx-auto mb-10" />
              <p className="text-[clamp(2.5rem,5vw,5rem)] font-serif italic leading-[1.2] text-gold">
                That&apos;s where our work begins.
              </p>
            </div>

          </div>
        </section>

        {/* THE DIFFERENCE */}
        <section className="py-[25vh] px-gutter relative bg-[#050a12] overflow-hidden">
          {/* Cinematic Axis Background — JPG, opacity-only reveal, no blur filter, no mix-blend-mode */}
          <div
            className="axis-bg absolute inset-0 z-0 opacity-0 pointer-events-none"
            style={{ willChange: "opacity" }}
          >
            <div className="absolute inset-0 bg-[url('/images/about_axis_abstract_ci.png')] bg-cover bg-center bg-no-repeat opacity-60" />
            <div className="absolute inset-0 max-w-full bg-gradient-to-b from-[#050a12] from-0% via-transparent via-50% to-[#050a12] to-100%" />
            <div className="absolute inset-0 mix-blend-color opacity-30 bg-gradient-to-tr from-turquoise to-petrol" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-32 relative z-10">
            <div className="reveal-text space-y-12">
              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                GOTT WALD HOLDING is not a traditional service provider.
              </h2>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
                We are an execution standard: strategy, structure, technology,
                communication, and human performance — built as one integrated
                system that reduces complexity and makes outcomes inevitable.
              </p>
            </div>

            <div className="axis-trigger reveal-text">
              <p className="text-lg md:text-xl text-white/80 mb-6">
                And we carry an axis you don&apos;t debate — you feel it:
              </p>
              <p className="text-3xl md:text-5xl font-black tracking-widest text-gold opacity-90 drop-shadow-2xl">
                NATURE<span className="text-white/80 mx-4">–</span>ANIMALS
                <span className="text-white/80 mx-4">–</span>HUMANS
              </p>
            </div>

            <div className="reveal-text space-y-8 max-w-3xl mx-auto pt-16 border-t border-white/5">
              <p className="text-sm tracking-[0.3em] uppercase text-gold/90 font-bold mb-4">
                The difference
              </p>
              <h3 className="text-4xl md:text-6xl font-light text-white">
                We don&apos;t optimize parts.
              </h3>
              <p className="text-2xl md:text-4xl font-serif italic text-white/80">
                We redesign the system — until &quot;solved&quot; is felt in
                real life.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE STAND FOR */}
        <section className="py-[25vh] px-gutter relative bg-[#03070d]">
          <div className="max-w-6xl mx-auto">
            <p className="reveal-text text-sm tracking-[0.3em] uppercase text-gold font-bold mb-16">
              What we stand for
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-24 items-center">
              
              <div className="reveal-text space-y-10">
                <h3 className="text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.15] tracking-tight text-white/90">
                  We believe in something radical — <br className="hidden md:block" />
                  <span className="font-serif italic text-gold/90 mt-2 block">
                    and practical:
                  </span>
                </h3>
                <p className="text-[clamp(1.2rem,2vw,1.5rem)] text-white/80 leading-relaxed font-light max-w-xl">
                  When structure becomes visible, the right solution becomes
                  inevitable. Not &quot;someday.&quot; Not &quot;when
                  there&apos;s time.&quot;
                </p>
                
                <ul className="space-y-6 pt-4 max-w-lg">
                  {[
                    "But in a way that lets a CEO breathe again.",
                    "In a way that helps founders know what comes first.",
                    "In a way that lets teams deliver with focus — and systems carry instead of pull."
                  ].map((text, idx) => (
                    <li key={idx} className="flex gap-5 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/90 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                      <p className="text-lg text-white/90  font-light leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal-text bg-[#0a1526]/60 backdrop-blur-md p-10 md:p-14 rounded-[2rem] border border-turquoise/10 flex flex-col justify-center relative overflow-hidden group shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_20px_40px_-20px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-turquoise/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
                
                <h4 className="text-[clamp(2.5rem,4vw,3.5rem)] font-light text-white mb-8 leading-[1.1] tracking-tight">
                  Solved means <strong className="text-white font-normal block mt-2">solved.</strong>
                </h4>
                
                <div className="border-l-2 border-gold/50 pl-6 mb-8">
                  <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-[1.4]">
                    &quot;Solved&quot; means you feel it on Monday morning, not in
                    a pitch.
                  </p>
                </div>
                
                <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                  Less friction. Clearer decisions. Higher speed. More calm in
                  the system.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5 PILLARS (WHAT WE DO DIFFERENTLY) */}
        <section className="py-[20vh] px-gutter relative bg-[#050a12]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-32 max-w-5xl stagger-container">
              <div className="flex items-center gap-6 mb-12">
                <span className="w-16 h-[2px] bg-gold/50 origin-left stagger-scaleX" />
                <p className="text-[12px] tracking-[0.3em] uppercase text-gold font-bold stagger-line">
                  What we do differently
                </p>
              </div>

              <h3 className="text-[clamp(3rem,5vw,6rem)] font-light leading-[1.05] tracking-tight text-white/80 space-y-1">
                <div className="overflow-hidden">
                  <span className="block stagger-line">
                    The world is full of
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-4 text-white stagger-line">
                    “optimizations.”
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-8 text-white/80 stagger-line">
                    We build{" "}
                    <span className="font-serif italic text-gold font-normal">
                      architecture
                    </span>{" "}
                    —
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-16 text-white/70 text-[clamp(2rem,3.5vw,4rem)] py-2 stagger-line">
                    so growth doesn&apos;t mean “more pressure,”
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block font-medium text-white drop-shadow-2xl stagger-line pt-2">
                    but more clarity.
                  </span>
                </div>
              </h3>
            </div>

            <div className="space-y-32">
              {[
                {
                  num: "01",
                  title: "We remove noise until only truth remains",
                  desc: "Most problems aren't complex — they're just hidden. We reveal what truly drives the system: root cause, leverage, sequence.",
                },
                {
                  num: "02",
                  title: "We make decisions light again",
                  desc: 'When a system becomes clear, decisions almost make themselves. Not because it\'s "easy," but because it is finally ordered.',
                },
                {
                  num: "03",
                  title: "We build signal, not volume",
                  desc: "Marketing is not a campaign. It's Trust & Demand Infrastructure: positioning, proof architecture, messaging, conversion — built so premium clients and top talent take you seriously immediately.",
                },
                {
                  num: "04",
                  title: "We treat technology as infrastructure",
                  desc: "Websites are not business cards. They are discovery, trust, conversion, scale — including SEO and AI indexing. With IT Solutions 2030, we transform outdated presences into future-ready digital infrastructure.",
                },
                {
                  num: "05",
                  title: "We strengthen the human behind the system",
                  desc: "Because the best strategy fails when the person behind it is burning out or drifting. Coaching & Mentoring with us means regulation, focus, clarity, identity — so performance becomes sustainable.",
                },
              ].map((pillar, i) => (
                <div
                  key={i}
                  className="pillar-row flex flex-col md:flex-row gap-6 md:gap-16 border-t border-white/5 pt-16 group"
                >
                  <div className="md:w-1/4">
                    <span className="text-[64px] md:text-[80px] font-black text-white/20 group-hover:text-gold/30 transition-colors duration-700 leading-none">
                      {pillar.num}
                    </span>
                  </div>
                  <div className="md:w-3/4 space-y-6 pt-2">
                    <h4 className="text-[28px] md:text-[34px] font-light text-white">
                      {pillar.title}
                    </h4>
                    <p className="text-[18px] md:text-[20px] text-white/80 font-light leading-relaxed max-w-3xl">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTCOMES & TIME TO VALUE */}
        <section className="py-[15vh] px-gutter relative bg-[#03070d]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="reveal-text space-y-8">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 font-bold mb-4">
                  Proof (without bragging)
                </p>
                <h3 className="text-[clamp(2.5rem,3.5vw,3.5rem)] text-white/95 font-light leading-[1.1] tracking-tight mb-6 pr-4">
                  We work discreetly and systematically.
                </h3>
                <p className="text-[clamp(1.2rem,1.5vw,1.5rem)] font-serif italic text-white/70">
                  Our proof is not loudness — it&apos;s outcomes.
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-xs tracking-[0.3em] uppercase text-gold/80 font-bold mb-8">
                  Typical outcomes felt quickly:
                </p>
                <div className="flex flex-col border-t border-white/5">
                  {[
                    {
                      strong: "Decision gridlock dissolves:",
                      text: "clear priorities, clear ownership, fewer open loops.",
                    },
                    {
                      strong: "Execution becomes predictable:",
                      text: 'projects are not "felt," they are led — with SSOT, sequence, and standards.',
                    },
                    {
                      strong: "Visibility becomes plan-able:",
                      text: "messaging locks in, proof is structured, conversion rises — because trust forms faster.",
                    },
                    {
                      strong: "Digital presence becomes powerful:",
                      text: "performance, indexability, structure — website as operating system, not brochure.",
                    },
                    {
                      strong: "Leadership state stabilizes:",
                      text: "more calm, more focus, better decisions — without self-loss.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="reveal-text group flex items-start gap-5 sm:gap-8 py-7 border-b border-white/5 cursor-default transition-colors duration-500 hover:border-turquoise/20 relative pl-4 sm:pl-6 -mx-4 sm:-mx-6"
                    >
                      {/* Subtle Left Accent on Hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-turquoise/40 to-transparent scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 origin-top transition-all duration-700 ease-out" />
                      
                      <span className="text-gold/80 font-mono text-sm group-hover:text-gold transition-colors duration-500 mt-1.5 tracking-widest shrink-0">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      
                      <div className="transition-transform duration-700 ease-out group-hover:translate-x-4">
                        <p className="text-xl sm:text-2xl text-white/95 block mb-3 font-light group-hover:text-white transition-colors duration-500 tracking-tight">
                          {item.strong}
                        </p>
                        <p className="text-lg sm:text-xl text-white/70 font-light leading-[1.6] group-hover:text-white/90 transition-colors duration-500 max-w-lg pr-4">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glass Monolith Box */}
            <div className="reveal-text relative p-8 lg:p-12 xl:p-16 rounded-[2.5rem] border border-turquoise/20 overflow-hidden group/card shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_30px_60px_-20px_rgba(0,0,0,0.6)] flex items-center">
              {/* Inner Glow / Monolithic effect */}
              <div className="absolute inset-0 bg-[#0a1526]/40 backdrop-blur-3xl z-0" />
              <div className="absolute inset-0 bg-gradient-to-br from-turquoise/5 via-transparent to-[#04080e]/90 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(18,168,172,0.15),transparent_70%)] z-0 transition-opacity duration-1000 group-hover/card:opacity-100 opacity-60" />

              <div className="relative z-10 w-full flex flex-col justify-center h-full">
                <div className="absolute top-0 right-0">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 font-bold mb-10">
                    Time-to-value
                  </p>
                </div>

                <div className="space-y-12 mt-12">
                  {[
                    {
                      days: "7–14",
                      title: "DAYS",
                      desc: "Root cause + leverage + sequence become crystal clear (not just opinions).",
                    },
                    {
                      days: "30",
                      title: "DAYS",
                      desc: "Less friction, more line, visible relief across the system.",
                    },
                    {
                      days: "60–90",
                      title: "DAYS",
                      desc: "Standards hold, signal stands, infrastructure carries — execution becomes stable.",
                    },
                  ].map((phase, idx) => (
                    <div
                      key={idx}
                      className="relative group/item cursor-default flex flex-col"
                    >
                      {/* Watermark Number */}
                      <div
                        className="absolute -left-6 -top-10 text-[6rem] lg:text-[8rem] font-black pointer-events-none select-none tracking-tighter overflow-hidden whitespace-nowrap hidden sm:block z-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000"
                        style={{
                          color: "transparent",
                          WebkitTextStroke: "1px rgba(18, 168, 172, 0.15)",
                        }}
                      >
                        {phase.days}
                      </div>

                      <div className="relative z-10 pl-0 sm:pl-8 border-l border-turquoise/10 sm:border-white/5 group-hover/item:border-turquoise/50 transition-colors duration-700">
                        <div className="flex items-baseline gap-4 mb-2">
                          <h4 className="text-5xl lg:text-6xl xl:text-7xl text-white group-hover/item:text-turquoise font-light tracking-[-0.03em] transition-colors duration-500">
                            {phase.days}
                          </h4>
                          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-turquoise/80 group-hover/item:text-turquoise transition-colors duration-500">
                            {phase.title}
                          </span>
                        </div>
                        <p className="text-lg sm:text-xl text-white/70 font-light leading-[1.5] group-hover/item:text-white/90 transition-colors duration-500 max-w-[20rem]">
                          {phase.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-lg text-white italic mt-16 pt-8 border-t border-white/5">
                  Wherever metrics belong (conversion, lead quality, meeting
                  time), we use numbers only when they are measurable and
                  defensible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MINI CASES — Section Header (OUTSIDE the pinned wrapper) */}
        <section className="bg-[#050a12] relative pt-28 pb-16 px-gutter">
          <div className="reveal-text max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-12 h-px bg-gold/40" />
              <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-bold">
                Mini Case Stories
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-serif italic text-white/50 max-w-md">
              (you&apos;ll recognize yourself)
            </p>
          </div>
        </section>

        {/* MINI CASES — Horizontal Scroll (GSAP pins THIS element only) */}
        <section className="cases-wrapper h-screen bg-[#050a12] overflow-hidden relative">
          <div className="cases-container flex h-full w-[500vw] items-center">
            {[
              {
                tag: "CEO / Founder / Entrepreneur",
                title: "Case 1 — Too many moving parts",
                before:
                  "Everything matters, nothing is ordered. Decisions are heavy. Team pressure rises.",
                intervention:
                  "SolutionFinder → root cause visible → sequence + SSOT → execution standard.",
                after:
                  "Fewer open loops, a clear line, noticeably more calm. Decision-making becomes light again.",
              },
              {
                tag: "SME / Premium Offer",
                title: "Case 2 — We're great — but invisible",
                before:
                  "High quality, unclear external signal. Inconsistent leads.",
                intervention:
                  "Messaging architecture + proof structure + trust system + conversion flow.",
                after:
                  "The market understands you immediately. Trust forms faster. Demand becomes more predictable.",
              },
              {
                tag: "SME",
                title: "Case 3 — Old website, slow growth",
                before:
                  "Website as a brochure. Performance and structure hold you back. Indexing potential is wasted.",
                intervention:
                  "IT Solutions 2030 → infrastructure upgrade (performance, SEO/AI readability, structure, scalability).",
                after:
                  "More discoverable, faster, clearer — website becomes a growth engine.",
              },
              {
                tag: "Executive",
                title: "Case 4 — High responsibility, inner drift",
                before:
                  "You function outwardly, but feel restless inside. Focus breaks. Energy drops.",
                intervention:
                  "Mentoring as a Human Operating System (regulation, focus, identity, daily systems).",
                after:
                  "Stable state, clearer decisions, stronger impact — without drama.",
              },
              {
                tag: "Entrepreneur / Holding",
                title: "Case 5 — Structure Deployment (Georgia)",
                before:
                  "You want structure, but risk chaos, half-knowledge, wrong sequence.",
                intervention:
                  "Assessment → defensible setup → clean coordination (compliant, bankable, operational).",
                after:
                  "Structure stands. Operations are clear. Less stress. More safety.",
              },
            ].map((c, i) => {
              const [caseNum, caseName] = c.title.split(" — ");

              return (
                <div
                  key={i}
                  className="w-screen h-full px-gutter flex items-center justify-center shrink-0"
                >
                  <div className="w-full max-w-5xl bg-[#080e1a]/80 backdrop-blur-xl border border-white/[0.07] p-8 sm:p-10 md:p-14 rounded-3xl relative overflow-hidden group shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                    {/* Ambient Hover Glow */}
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-turquoise/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-[2s] pointer-events-none" />

                    {/* Tagline */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-8 h-px bg-gold/50" />
                      <p className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-gold/90">
                        {c.tag}
                      </p>
                    </div>
                    
                    {/* Title */}
                    <div className="mb-8 md:mb-12">
                      <span className="block font-serif italic text-gold/80 text-lg md:text-xl mb-2 tracking-wide">{caseNum}</span>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-[1.1] max-w-4xl tracking-[-0.02em]">
                        {caseName}
                      </h3>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 relative">
                      
                      {/* BEFORE */}
                      <div className="space-y-4 md:pr-10 relative group/col">
                        <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-white/50">
                          Before
                        </p>
                        <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed group-hover/col:text-white/80 transition-colors duration-500">
                          {c.before}
                        </p>
                      </div>

                      {/* INTERVENTION (Highlighted) */}
                      <div className="space-y-4 md:px-10 relative group/intervention md:border-l md:border-white/[0.06]">
                        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-turquoise/60 via-turquoise/20 to-transparent hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/[0.04] to-transparent hidden md:block z-[-1] rounded-r-xl" />

                        <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-turquoise/90">
                          Intervention
                        </p>
                        <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed">
                          {c.intervention}
                        </p>
                      </div>

                      {/* AFTER */}
                      <div className="space-y-4 md:border-l md:border-white/[0.06] md:pl-10 relative group/col">
                        <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-white/50">
                          After
                        </p>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed group-hover/col:text-white/90 transition-colors duration-500">
                          {c.after}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section className="pt-[15vh] pb-[20vh] px-gutter relative bg-[#03070d]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="reveal-text">
              <h2 className="text-4xl md:text-5xl font-light text-white">
                Our Ecosystem
              </h2>
              <p className="text-2xl font-serif italic text-white/70 mt-4">
                (everything reinforces everything)
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "SolutionFinder / Solution Management",
                  desc: "find the cause, lead the solution, lock stability.",
                },
                {
                  name: "Consulting",
                  desc: "executive-grade structure, strategy, decision systems, growth.",
                },
                {
                  name: "Marketing & Communication",
                  desc: "signal, trust, demand infrastructure.",
                },
                {
                  name: "IT Solutions 2030",
                  desc: "website as high-performance, indexable infrastructure.",
                },
                {
                  name: "Coaching & Mentoring",
                  desc: "human operating system for high responsibility.",
                },
                {
                  name: "Structure Deployment (Georgia)",
                  desc: "defensible setup for entrepreneurs/holdings.",
                },
                { name: "YIG.CARE", desc: "platform & movement. Launch 2026." },
                {
                  name: "PLHH_Coin",
                  desc: "RWA + Governance DAO for real-world regeneration: NATURE – ANIMALS – HUMANS.",
                },
              ].map((eco, i) => (
                <div
                  key={i}
                  className="eco-item  reveal-text group py-8 border-t border-white/5 cursor-default relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 relative z-10">
                    <h3 className="text-2xl md:text-3xl text-white font-light group-hover:text-gold transition-colors duration-500">
                      {eco.name}
                    </h3>
                    <p className="text-xl text-white/80 font-light md:w-1/2 md:text-right">
                      {eco.desc}
                    </p>
                  </div>
                  <div className="eco-line absolute bottom-0 left-0 h-px w-0 bg-gold" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PATRON OF GOTT WALD */}
        <section className="patron-section py-[30vh] px-gutter relative flex items-center justify-center bg-[#050a12]">
          {/* Breathing Orb */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div
              className="patron-orb ambient-light w-[80vw] h-[80vw] rounded-full opacity-20 blur-[150px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)",
                willChange: "transform",
              }}
            />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-24">
            <div className="reveal-text space-y-8">
              <h2 className="text-[clamp(3rem,6vw,6rem)] font-light leading-[1.1] uppercase tracking-tighter">
                THE PATRON <br />
                <span className="font-serif italic text-gold/80 block text-[clamp(2rem,4vw,4rem)] lowercase mt-4">
                  of gott wald
                </span>
              </h2>
              <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
                In the fabric of GOTT WALD, the PATRON is not the &quot;single
                maker&quot; — and not the lone specialist. The PATRON is the
                protective framework.
              </p>
            </div>

            <div className="reveal-text grid grid-cols-1 md:grid-cols-2 text-left border-y border-white/10 py-16 md:py-24 max-w-5xl mx-auto w-full relative">
              {/* Vertical divider line for desktop */}
              <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 w-px bg-white/10" />

              {/* LEFT COLUMN: THE DECISION CODE */}
              <div className="reveal-text md:pr-24 space-y-12 pb-16 md:pb-0">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-bold mb-6">
                    The Decision Code
                  </p>
                  <p className="text-[clamp(1.2rem,1.5vw,1.5rem)] text-white/80 font-light leading-relaxed max-w-lg">
                    GOTT WALD is not built on trends. It is built on principles.
                    <br/><span className="text-white italic mt-2 block">Timeless. Durable. Non-negotiable.</span>
                  </p>
                </div>
                
                <ul className="flex flex-col border-t border-white/10">
                  {[
                    { core: "Love", meaning: "as the measure" },
                    { core: "Peace", meaning: "as the direction" },
                    { core: "Harmony", meaning: "as the outcome" },
                    { core: "Compassion", meaning: "as the posture" },
                    { core: "Empathy", meaning: "as the capability" },
                    { core: "Service", meaning: "as lived responsibility" },
                  ].map((val, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b border-white/5 py-6 group cursor-default">
                      <span className="font-serif italic text-3xl md:text-4xl text-white group-hover:text-gold transition-colors duration-500">
                        {val.core}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] font-light text-white group-hover:text-white transition-colors duration-500">
                        {val.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-l border-gold/40 pl-6 py-2">
                  <p className="text-lg font-light text-white/90">
                    This is not a slogan.
                    <strong className="block font-normal text-gold mt-1">This is lived reality.</strong>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: A RARE GIFT */}
              <div className="reveal-text space-y-12 md:pl-24 pt-16 md:pt-0 border-t border-white/10 md:border-t-0 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold/95 font-bold mb-6">
                    A rare gift
                  </p>
                  <p className="text-[clamp(1.2rem,1.4vw,1.5rem)] text-white/95 font-light leading-relaxed max-w-lg">
                    The PATRON carries a rare gift: a reader of people, a feeler,
                    a gatherer. The PATRON sees you before you&apos;ve fully
                    organized yourself.
                  </p>
                </div>

                <div className="relative p-10 lg:p-14 rounded-[2rem] border border-turquoise/20 overflow-hidden group shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                  {/* Glassmorphism Background */}
                  <div className="absolute inset-0 bg-[#0a1526]/40 backdrop-blur-3xl z-0" />
                  <div className="absolute inset-0 bg-gradient-to-br from-turquoise/5 via-transparent to-[#04080e]/90 z-0" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(18,168,172,0.1),transparent_70%)] z-0 transition-opacity duration-1000 group-hover:opacity-100 opacity-60" />
                  
                  <div className="relative z-10">
                    <p className="text-white/95 italic font-serif leading-[1.2] text-3xl md:text-4xl tracking-tight mb-10">
                      &quot;Nothing here is performed, <br className="hidden lg:block"/>
                      <span className="text-gold/80">everything here is held.&quot;</span>
                    </p>
                    
                    <ul className="space-y-4">
                      {[
                        "Conflict becomes clear.",
                        "Disorder becomes direction.",
                        "Pressure becomes purpose."
                      ].map((effect, idx) => (
                        <li key={idx} className="flex gap-4 items-center">
                          <div className="w-[1px] h-4 bg-turquoise/50" />
                          <p className="text-lg text-white/90 font-light tracking-wide">{effect}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-[clamp(1.2rem,1.4vw,1.5rem)] text-white/70 font-light leading-relaxed max-w-lg">
                  So specialists can build without systems turning cold. So
                  growth never consumes the soul. A framework that carries. A
                  system that protects. A force that unites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DECISION / CTA */}
        <section className="cta-section h-screen px-gutter relative flex items-center justify-center bg-[#03070d] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="w-[60vw] h-[60vw] rounded-full opacity-10 blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center max-w-3xl space-y-16">
            <div className="cta-reveal">
              <p className="text-lg tracking-[0.3em] uppercase text-white/90 font-bold mb-6">
                Who this is for
              </p>
              <h3 className="text-3xl md:text-5xl font-light leading-[1.3] text-white/90">
                For CEOs, founders, executives, and SMEs who don&apos;t want to
                &quot;do more&quot; — but to do the right thing, the right way.
              </h3>
            </div>

            <p className="cta-reveal text-2xl font-serif italic text-white/80">
              If you want it cleanly solved — we are.
            </p>

            <div className="cta-reveal pt-16 pb-8">
              <button
                onClick={handleStrategicClick}
                className="cta-btn-glow group relative cursor-pointer px-10 md:px-14 py-5 md:py-6 rounded-full overflow-hidden bg-[#0A0A0A] border border-gold/30 hover:border-gold transition-colors duration-700 shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]"
              >
                {/* Sweep animation background */}
                <div className="absolute inset-0 bg-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                {/* Button text */}
                <span className="relative z-10 text-[11px] md:text-sm tracking-[0.3em] uppercase font-bold text-gold group-hover:text-[#030303] transition-colors duration-500">
                  Request a Strategic Conversation
                </span>
              </button>
            </div>

            <p className="cta-reveal text-xl text-white/90 font-light mt-8">
              We don&apos;t create noise. We create structure.
              <br />
              And structure creates inevitability.
            </p>
          </div>
        </section>
      </main>

      <FooterSection />
      <NextChapterTransition
        nextTitle="PARTNERSHIP"
        nextHref="/partnerships"
        prevHref="/"
      />
    </div>
  );
}
