"use client";

import { useLayoutEffect, useEffect, useRef, useState, useCallback, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";
import {
  NON_NEGOTIABLES,
  PARTNERSHIP_DOMAINS,
  PARTNERSHIP_ARCHETYPES,
  PARTNER_BENEFITS,
  PARTNER_EXPECTATIONS,
  MANIFESTO_LINES,
  PARTNERSHIP_PRINCIPLES,
  PARTNERSHIP_SELECTION_STEPS,
} from "@/lib/partnershipData";

gsap.registerPlugin(ScrollTrigger);

export default function PartnershipsClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData(formRef.current);
      formData.append("type", "partnership");

      const res = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setSubmitStatus("success");
      formRef.current.reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Partnership form submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      if (heroTextRef.current) {
        const heroChildren =
          heroTextRef.current.querySelectorAll(".hero-reveal");
        gsap.set(heroChildren, { opacity: 0, y: 30 });

        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl.to(heroChildren, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          force3D: true,
        });

        // Hero decoupled parallax typography
        const heroParent = heroTextRef.current?.parentElement;
        gsap.to(gsap.utils.toArray(".parallax-fast", pageRef.current!), {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: heroParent,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(gsap.utils.toArray(".parallax-slow", pageRef.current!), {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroParent,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Setup Scroll Indicator Loop
        gsap.fromTo(
          gsap.utils.toArray(".scroll-indicator-line", pageRef.current!),
          { yPercent: -100 },
          { yPercent: 400, duration: 2, repeat: -1, ease: "none" },
        );

        // Complete Hero section container fade/scale
        gsap.to(heroTextRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroTextRef.current?.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Reveal Up animations — fire-once, GPU-composited
      const reveals = gsap.utils.toArray(
        ".reveal-up",
        pageRef.current!,
      ) as HTMLElement[];
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 3. Standards Horizontal Scroll
      const scrollWrapper = gsap.utils.toArray(
        ".standards-scroll-wrapper",
        pageRef.current!,
      )[0] as HTMLElement;
      if (scrollWrapper && window.innerWidth >= 768) {
        const xOffset = -(scrollWrapper.scrollWidth - window.innerWidth);

        gsap.to(scrollWrapper, {
          x: xOffset,
          force3D: true,
          ease: "none",
          scrollTrigger: {
            trigger: "#standards-section",
            start: "top top",
            end: () => `+=${scrollWrapper.scrollWidth - window.innerWidth}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // 4. Manifesto Lines — staggered cascade with counter fade
      const manifestoLines = gsap.utils.toArray(
        ".manifesto-line",
        pageRef.current!,
      ) as HTMLElement[];
      manifestoLines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.06,
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 5. Archetype Cards — staggered grid entrance
      const archCards = gsap.utils.toArray(
        ".arch-card",
        pageRef.current!,
      ) as HTMLElement[];
      gsap.fromTo(
        archCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: archCards[0]?.parentElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // 6. Partner Benefits/Expectations — list item cascade
      const benefitItems = gsap.utils.toArray(
        ".benefit-item",
        pageRef.current!,
      ) as HTMLElement[];
      benefitItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 7. Accordion sections — sequential slide-in
      const accordionItems = gsap.utils.toArray(
        ".accordion-item",
        pageRef.current!,
      ) as HTMLElement[];
      accordionItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 8. Selection Process Steps — cascade with scale
      const processSteps = gsap.utils.toArray(
        ".process-step",
        pageRef.current!,
      ) as HTMLElement[];
      gsap.fromTo(
        processSteps,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: processSteps[0]?.parentElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // 9. Application Form — cinematic entrance (scoped to pageRef)
      const formSection = pageRef.current!.querySelector(".form-section");
      if (formSection) {
        const formElements = formSection.querySelectorAll(".form-reveal");
        gsap.fromTo(
          formElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: formSection,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Calculate a slight offset for fixed header
          const yOffset = -100;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 600); // Wait for GSAP and layout
    };

    // Run on initial load
    handleHashScroll();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div
      ref={pageRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-x-hidden selection:bg-gold selection:text-black"
    >
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        <section className="min-h-screen w-full flex flex-col justify-end relative bg-transparent overflow-hidden pt-32 lg:pt-40">
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-2" />

          <div
            ref={heroTextRef}
            className="relative w-full px-gutter pb-32 md:pb-40 lg:pb-48 xl:pb-56 will-change-transform z-5 mt-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-10 lg:gap-16 xl:gap-24 items-end">
              {/* LEFT: Power-statement */}
              <div className="hero-reveal w-full max-w-[850px]">
                <div className="flex items-center gap-3 mb-8 lg:mb-10">
                  <span className="text-gold text-xs lg:text-sm font-bold tracking-[0.4em] uppercase">
                    02/
                  </span>
                  <span className="w-16 h-px bg-white/15" />
                  <span className="text-xs lg:text-sm tracking-[0.35em] text-white/40 uppercase font-bold">
                    Partnerships
                  </span>
                </div>

                {/* Adjusted clamp sizes for better fit next to HUD on 1024-1280px screens */}
                <h1 className="text-[clamp(1.8rem,9vw,9rem)] sm:text-[clamp(2.5rem,11vw,9rem)] lg:text-[clamp(2.5rem,5.5vw,9rem)] xl:text-[clamp(3.5rem,7vw,9rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-white flex flex-col">
                  <span className="parallax-fast inline-block whitespace-nowrap">
                    PARTNERSHIPS
                  </span>
                  <span className="parallax-slow inline-block text-white/90">
                    AT GOTT WALD
                  </span>
                </h1>

                <p className="hero-reveal flex items-center gap-4 text-[clamp(1.2rem,2vw,2.5rem)] lg:text-[clamp(1.5rem,2.2vw,3rem)] font-serif italic text-gold/80 tracking-tight leading-tight mt-8 lg:mt-10 pl-0.5">
                  <span className="w-8 md:w-16 h-0.5 bg-gold/50 flex-shrink-0" />
                  We don&apos;t buy vendors. We select PARTNERS.
                </p>

                {/* Trust line */}
                <p className="hero-reveal mt-6 text-sm uppercase tracking-[0.3em] text-white/30 font-medium pl-0.5">
                  Confidential by default. NDA-ready on request.
                </p>
              </div>

              {/* RIGHT: HUD Metric Strip */}
              <div className="hero-reveal hidden lg:flex flex-col gap-0 self-end bg-[#0a0a0a]/95 rounded-sm p-8 lg:p-10 -m-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gold/20">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <p className="text-[10px] lg:text-xs uppercase tracking-[0.5em] text-gold/80 font-bold">
                    Our Reach — Live
                  </p>
                </div>

                {[
                  { label: "Countries", value: "26" },
                  { label: "Partner Origins", value: "71" },
                  { label: "Network Size", value: "888+" },
                  { label: "Languages", value: "17" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="group flex items-baseline justify-between py-5 border-b border-white/5 last:border-0 cursor-default"
                  >
                    <span className="text-xs lg:text-sm uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-300">
                      {label}
                    </span>
                    <span className="text-4xl lg:text-5xl font-light text-white/90 tabular-nums group-hover:text-gold transition-colors duration-300">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href="#apply"
                    data-magnetic
                    className="group inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300 w-full"
                  >
                    <span className="text-xs lg:text-sm tracking-[0.3em] uppercase font-bold">
                      Apply for Partnership
                    </span>
                    <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  </a>
                  <a
                    href="#apply"
                    data-magnetic
                    className="group inline-flex items-center justify-center gap-4 px-8 py-3 text-white/40 hover:text-white transition-colors duration-300 w-full"
                  >
                    <span className="text-[11px] tracking-[0.3em] uppercase font-medium">
                      Request an Intro Call
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Awwwards Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4 z-20 pointer-events-none">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">
              Scroll
            </span>
            <div className="w-px h-16 bg-white/10 relative overflow-hidden">
              <div className="scroll-indicator-line absolute top-0 left-0 w-full h-[30%] bg-gold" />
            </div>
          </div>
        </section>

        {/* ── SECTION 2: GOTT WALD STANDARD (3 statements) ── */}
        <section className="px-gutter py-[18vh] bg-[#0a0a0a] relative z-10 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-12 reveal-up">
            <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold">
              What we are
            </p>
            <div className="space-y-6">
              <p className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 leading-[1.3]">
                GOTT WALD is not a marketplace.
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.3] tracking-tight">
                GOTT WALD is a standard.
              </p>
              <p className="text-2xl md:text-3xl font-serif italic text-white/55 leading-relaxed max-w-2xl mx-auto">
                We only work with companies that have principle — and can
                deliver. When both are true, partnership becomes inevitable.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: 7-LINE MANIFESTO ── */}
        <section
          id="manifesto"
          className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold mb-4">
                Our Foundation
              </p>
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white">
                A 7-LINE
                <br />
                <span className="text-white/30">MANIFESTO</span>
              </h2>
            </div>
            <div className="flex flex-col border-t border-white/10">
              {MANIFESTO_LINES.map((line, i) => (
                <div
                  key={i}
                  className="manifesto-line group flex items-center gap-8 py-8 border-b border-white/5 hover:bg-white/2 transition-colors duration-500 px-4 -mx-4"
                >
                  <span className="text-gold font-mono text-xs shrink-0 w-8 text-right opacity-50 group-hover:opacity-100 transition-opacity">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/70 group-hover:text-white transition-colors duration-500 leading-tight">
                    {i === 5 ? (
                      <>
                        We build for{" "}
                        <span className="font-black text-gold">
                          NATURE — ANIMALS — HUMANS
                        </span>
                        .
                      </>
                    ) : (
                      line
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: PARTNERSHIP PRINCIPLE ── */}
        <section className="px-gutter py-[18vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* TOP: The Principle Statement */}
            <div className="reveal-up space-y-10">
              <div>
                <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold mb-6">
                  The Principle
                </p>
                <h2 className="text-[clamp(3rem,5vw,5.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white">
                  PARTNERSHIP IS
                  <br />
                  ALIGNMENT
                </h2>
                <div className="w-16 h-1 bg-white mt-8 mb-6" />
                <h2 className="text-[clamp(3rem,5vw,5.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white/30">
                  NOT
                  <br />
                  PROCUREMENT.
                </h2>
              </div>
              <p className="text-2xl text-white/60 leading-relaxed font-light max-w-2xl">
                We don&apos;t &quot;source services.&quot; We select partners
                who can carry our foundation and protect our standard.
              </p>
            </div>

            {/* BOTTOM: Partner Qualities */}
            <div className="reveal-up">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-10 font-semibold">
                We work with partners who:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 border-t border-white/10">
                {PARTNERSHIP_PRINCIPLES.map((principle, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-8 py-7 border-b border-white/5 hover:pl-4 transition-all duration-500"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                    <p className="text-xl lg:text-2xl font-light text-white/70 group-hover:text-white transition-colors duration-500">
                      {principle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: WHO WE'RE LOOKING FOR ── */}
        <section className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold mb-6">
                Who We&apos;re Looking For
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
                OUTSTANDING COMPANIES —<br />
                <span className="font-serif italic text-white/40 normal-case tracking-normal text-[clamp(1.8rem,3.5vw,4rem)]">
                  proven in action, not in slides.
                </span>
              </h2>
              <p className="text-xl text-white/50 font-light max-w-2xl">
                We select five partnership archetypes.
              </p>
            </div>

            {(() => {
              const bentoClasses = [
                "md:col-span-7 min-h-[380px] lg:min-h-[440px]",
                "md:col-span-5 min-h-[380px] lg:min-h-[440px]",
                "md:col-span-4 min-h-[320px] lg:min-h-[360px]",
                "md:col-span-4 min-h-[320px] lg:min-h-[360px]",
                "md:col-span-4 min-h-[320px] lg:min-h-[360px]",
              ];
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-12 w-full">
                  {PARTNERSHIP_ARCHETYPES.map((arch, i) => (
                    <div
                      key={i}
                      className={`arch-card group relative bg-[#080808] p-8 lg:p-10 rounded-2xl border border-white/8 overflow-hidden flex flex-col justify-between cursor-default transition-[border-color,box-shadow] duration-700 ${bentoClasses[i]}`}
                      onMouseMove={(e) => {
                        const el = e.currentTarget;
                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        requestAnimationFrame(() => {
                          el.style.setProperty("--x", `${x}px`);
                          el.style.setProperty("--y", `${y}px`);
                        });
                      }}
                    >
                      {/* Solid opaque bg to block fluid bg bleed */}
                      <div className="absolute inset-0 bg-[#080808] rounded-2xl z-0" />

                      {/* Spotlight Glow Background */}
                      <div
                        className="pointer-events-none absolute inset-0 z-1 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(600px circle at var(--x) var(--y), rgba(212,175,55,0.07), transparent 50%)`,
                        }}
                      />

                      {/* Spotlight Border */}
                      <div
                        className="pointer-events-none absolute inset-0 z-2 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 ring-1 ring-inset ring-gold/50"
                        style={{
                          maskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
                          WebkitMaskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
                        }}
                      />

                      {/* Giant Watermark Number */}
                      <div className="absolute -bottom-8 -right-4 text-[10rem] lg:text-[13rem] font-black leading-none text-white/2 group-hover:-translate-y-3 group-hover:text-gold/4 transition-[transform,color] duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] select-none pointer-events-none z-3">
                        0{i + 1}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        {/* Top Header */}
                        <div className="flex items-center justify-between mb-auto">
                          <span className="text-gold/50 font-mono text-sm tracking-[0.4em] font-medium">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="w-12 h-px bg-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                          </div>
                        </div>

                        {/* Bottom Text */}
                        <div className="mt-8 pt-4 border-t border-white/5 group-hover:border-gold/15 transition-colors duration-700">
                          <h3 className={`font-black text-white/80 group-hover:text-white transition-colors duration-500 leading-[0.9] mb-3 tracking-tighter uppercase ${i === 0 ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"}`}>
                            {arch.title}
                          </h3>
                          <p className="text-white/35 text-base font-light leading-relaxed group-hover:text-white/60 transition-colors duration-700">
                            {arch.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── SECTION 6: NON-NEGOTIABLES (HORIZONTAL SCROLL) ── */}
        <section
          id="standards-section"
          className="bg-[#020202] relative z-10 isolate"
        >
          <div className="standards-pin-container">
            {/* Section Title Row */}
            <div className="flex justify-between items-end px-gutter pt-[12vh] pb-10 lg:pb-14 reveal-up">
              <h2 className="text-[clamp(3rem,max(5vw,6vh),8rem)] font-black tracking-tighter leading-[0.85] uppercase text-white drop-shadow-xl">
                OUR
                <br />
                PARTNERSHIP
                <br />
                STANDARD
              </h2>
              <div className="hidden lg:flex flex-col items-end pb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-gold mb-5" />
                <p className="text-xs lg:text-sm tracking-[0.4em] text-white/50 uppercase font-bold">
                  Non-Negotiables
                </p>
              </div>
            </div>

            {/* Scroll Wrapper */}
            <div className="standards-scroll-wrapper flex flex-row w-max reveal-up border-t border-white/10 will-change-transform">
              {NON_NEGOTIABLES.map((item, i) => (
                <div
                  key={i}
                  className="relative group flex flex-col justify-between w-[85vw] md:w-[50vw] lg:w-[35vw] h-[55vh] lg:h-[65vh] border-r border-white/10 p-10 lg:p-14 overflow-hidden cursor-pointer shrink-0 bg-[#060606]"
                >
                  {/* Image Background - Always slightly visible, brightens on hover */}
                  <div className="absolute inset-0 z-0 opacity-20 grayscale mix-blend-luminosity group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <Image
                      src={`/images/futuristic_standard_${(i % 3) + 1}.png`}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 35vw"
                      quality={50}
                      loading="lazy"
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-2000 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#060606] via-[#060606]/60 to-[#060606]/30" />
                  </div>

                  {/* Ambient Hover Glow */}
                  <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  {/* Huge Watermark Number */}
                  <div className="absolute -bottom-10 -right-6 text-[12rem] lg:text-[16rem] font-black leading-none text-white/2 transform group-hover:-translate-y-4 group-hover:text-gold/4 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] select-none pointer-events-none z-1">
                    0{i + 1}
                  </div>

                  {/* Top — index + gold dot */}
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-500" />
                    <span className="font-mono text-white/30 group-hover:text-gold text-sm tracking-[0.4em] uppercase font-bold transition-colors duration-700">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Bottom — title + divider + desc */}
                  <div className="relative z-10 flex flex-col justify-end h-full mt-auto pb-4">
                    <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-6 text-white/80 group-hover:text-white leading-[0.9] transition-colors duration-700 uppercase drop-shadow-lg w-[90%]">
                      {item.title}
                    </h3>

                    <div className="w-full h-px bg-white/5 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-full bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    </div>

                    <p className="text-lg lg:text-xl text-white/40 font-light leading-relaxed group-hover:text-white/70 transition-colors duration-700 pr-4">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom spacing */}
            <div className="pb-[10vh]" />
          </div>
        </section>

        {/* ── SECTION 7: WHAT PARTNERS GET + WHAT WE EXPECT ── */}
        <section className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-24">
            {/* What Partners Get */}
            <div className="reveal-up">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-10">
                What Partners Get
              </h3>
              <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-12 leading-[1.1]">
                A premium ecosystem.
                <br />
                <span className="text-white/40">Clean projects.</span>
              </h4>
              <ul className="flex flex-col gap-6 mb-16">
                {PARTNER_BENEFITS.map((benefit, i) => (
                  <li
                    key={i}
                    className="benefit-item flex gap-5 items-start text-white/70 text-xl"
                  >
                    <span className="mt-2.5 w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-serif italic text-white/80 border-l-2 border-gold pl-8 leading-tight">
                We keep the frame stable.
                <br />
                You deliver excellence.
              </p>
            </div>

            {/* What We Expect */}
            <div className="reveal-up">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-10">
                What We Expect
              </h3>
              <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-12 leading-[1.1]">
                Professionalism that
                <br />
                <span className="text-white/40">
                  doesn&apos;t require supervision.
                </span>
              </h4>
              <ul className="flex flex-col gap-6">
                {PARTNER_EXPECTATIONS.map((expectation, i) => (
                  <li
                    key={i}
                    className="benefit-item flex gap-5 items-start text-white/70 text-xl"
                  >
                    <span className="mt-2.5 w-1.5 h-1.5 bg-white/30 rounded-full shrink-0" />
                    {expectation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: DOMAINS ACCORDION ── */}
        <section className="px-gutter py-[20vh] bg-transparent relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 reveal-up">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-8 sticky top-[20vh]">
                Partnership <span className="text-white/40">Domains</span>
              </h2>
              <p className="text-white/70 text-xl lg:text-2xl leading-relaxed font-light mb-8 max-w-md sticky top-[30vh]">
                Full transparency across all our operating pillars. We integrate
                partners natively into our architecture.
              </p>
            </div>

            <div
              className="lg:w-2/3 flex flex-col border-t border-white/10"
              ref={accordionWrapperRef}
            >
              {PARTNERSHIP_DOMAINS.map((domain) => {
                const isActive = activeAccordion === domain.id;
                return (
                  <div
                    key={domain.id}
                    className="accordion-item border-b border-white/10 group"
                  >
                    <button
                      onClick={() => toggleAccordion(domain.id)}
                      className="w-full py-10 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-6 lg:gap-8">
                        <span
                          className={`text-base font-mono transition-colors ${isActive ? "text-gold" : "text-white/50"}`}
                        >
                          {domain.id}
                        </span>
                        <h3
                          className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
                        >
                          {domain.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-xl font-light text-white/50">
                          {isActive ? "-" : "+"}
                        </span>
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
                      style={{
                        maxHeight: isActive ? "800px" : "0px",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div className="pb-10 pl-14">
                        <ul className="flex flex-col gap-4">
                          {domain.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-xl text-white/70 flex items-start gap-4"
                            >
                              <span className="text-gold mt-3 leading-none shrink-0 border-t border-gold w-4" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: SELECTION PROCESS ── */}
        <section className="px-gutter py-[18vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold mb-6">
                How It Works
              </p>
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
                SHORT. CLEAR.
                <br />
                <span className="text-white/30">NO THEATRE.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5">
              {PARTNERSHIP_SELECTION_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="process-step group bg-[#060606] p-8 lg:p-10 hover:bg-[#0e0e0e] transition-colors duration-500 flex flex-col gap-6"
                >
                  <span className="text-gold font-mono text-3xl font-light tracking-tighter group-hover:text-white transition-colors duration-500">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white/80 group-hover:text-white transition-colors duration-500 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 10: APPLICATION FORM ── */}
        <section
          id="apply"
          className="form-section px-gutter py-[20vh] bg-[#050505] relative z-10 border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto">
            <div className="form-reveal mb-20">
              <p className="text-xs tracking-[0.45em] uppercase text-gold/60 font-bold mb-6">
                Partnership Application
              </p>
              <h2 className="text-[clamp(3rem,6.5vw,7rem)] font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                GOTT WALD
                <br />
                <span className="text-white/30">APPLICATION</span>
              </h2>
              <p className="text-xl lg:text-2xl text-white/60 font-light leading-relaxed max-w-2xl">
                If foundation and proof are real — you&apos;re welcome. If not —
                honesty is better.{" "}
                <em className="text-white/80 font-serif">
                  That&apos;s how we operate.
                </em>
              </p>
              <p className="mt-4 text-white/40 text-lg font-light">
                Please keep it clear and proof-based. We review every serious
                application.
              </p>
            </div>

            <form
              ref={formRef}
              className="form-reveal flex flex-col gap-12"
              onSubmit={handleFormSubmit}
            >
              {/* Group 1: Company + Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="company"
                    name="company"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Company Name"
                  />
                  <label
                    htmlFor="company"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Company Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="url"
                    id="website"
                    name="website"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Website URL"
                  />
                  <label
                    htmlFor="website"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Website
                  </label>
                </div>
              </div>

              {/* Group 2: Country + Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="country"
                    name="country"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Country / Region"
                  />
                  <label
                    htmlFor="country"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Country / Region
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="contact"
                    name="contact"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Main Contact (Name, Email, Phone)"
                  />
                  <label
                    htmlFor="contact"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Main Contact
                  </label>
                </div>
              </div>

              {/* Group 3: Type + Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative mt-2">
                  <label
                    htmlFor="partnership_type"
                    className="absolute left-0 -top-4 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50"
                  >
                    Partnership Type
                  </label>
                  <select
                    required
                    id="partnership_type"
                    name="partnership_type"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white/80 focus:text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-black">
                      Select Partnership Type
                    </option>
                    <option value="strategic" className="text-black">
                      Strategic PARTNERSHIP
                    </option>
                    <option value="delivery" className="text-black">
                      Delivery PARTNERSHIP
                    </option>
                    <option value="tech" className="text-black">
                      Technology PARTNERSHIP
                    </option>
                    <option value="creative" className="text-black">
                      Creative &amp; Media PARTNERSHIP
                    </option>
                    <option value="local" className="text-black">
                      Local Operations PARTNERSHIP
                    </option>
                  </select>
                  <div className="absolute right-0 bottom-6 pointer-events-none">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="pillars"
                    name="pillars"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Relevant Pillars (A, B, C...)"
                  />
                  <label
                    htmlFor="pillars"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Relevant Pillars
                  </label>
                </div>
              </div>

              {/* Group 4: What you do */}
              <div className="relative">
                <textarea
                  required
                  id="description"
                  name="description"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                  placeholder="What you do (1–3 sentences)"
                />
                <label
                  htmlFor="description"
                  className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                >
                  What you do
                </label>
              </div>

              {/* Group 5: Capabilities + Proof */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <textarea
                    required
                    id="capabilities"
                    name="capabilities"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                    placeholder="Top 3 capabilities (bullet points)"
                  />
                  <label
                    htmlFor="capabilities"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Top 3 capabilities
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    required
                    id="proof"
                    name="proof"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                    placeholder="Proof of work (links / portfolio / cases)"
                  />
                  <label
                    htmlFor="proof"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Proof of work
                  </label>
                </div>
              </div>

              {/* Group 5.1: References, Capacity, Budget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="relative">
                  <input
                    type="text"
                    id="references"
                    name="references"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="References (optional)"
                  />
                  <label
                    htmlFor="references"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    References (optional)
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="capacity"
                    name="capacity"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Capacity (project slots / hours)"
                  />
                  <label
                    htmlFor="capacity"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Capacity
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="budget"
                    name="budget"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Typical project range (budget/scope)"
                  />
                  <label
                    htmlFor="budget"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Typical project range
                  </label>
                </div>
              </div>

              {/* Group 6: Values Fit */}
              <div className="relative">
                <textarea
                  required
                  id="values"
                  name="values"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                  placeholder="Values Fit (required): 2–3 sentences on responsibility, integrity, excellence, discretion"
                />
                <label
                  htmlFor="values"
                  className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                >
                  Values Fit (Required)
                </label>
              </div>

              {/* Group 7: Why GOTT WALD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <textarea
                    id="why"
                    name="why"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                    placeholder="Why GOTT WALD? (short)"
                  />
                  <label
                    htmlFor="why"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Why GOTT WALD?
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="constraints"
                    name="constraints"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                    placeholder="Anything we must know? (timing, constraints, risks)"
                  />
                  <label
                    htmlFor="constraints"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Anything we must know?
                  </label>
                </div>
              </div>

              {/* NDA Checkbox */}
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex items-center shrink-0">
                  <input
                    type="checkbox"
                    id="nda"
                    name="nda"
                    className="peer w-6 h-6 appearance-none border border-white/30 rounded-sm checked:bg-gold checked:border-gold cursor-pointer transition-colors"
                  />
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <label
                  htmlFor="nda"
                  className="text-white/60 cursor-pointer text-lg md:text-xl font-light hover:text-white transition-colors"
                >
                  We are NDA-ready and operate with strict discretion.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-magnetic
                className="group relative flex items-center justify-center gap-4 bg-white px-12 py-6 overflow-hidden w-full md:w-max mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 font-bold uppercase tracking-[0.15em] text-sm text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </span>
                <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[60] transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </button>

              {submitStatus === "success" && (
                <p className="text-green-500/90 text-lg font-light mt-2 border border-green-500/20 bg-green-500/10 p-4 rounded-sm">
                  Application submitted successfully. If there&apos;s a fit,
                  we&apos;ll reach out with next steps.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm">
                  Failed to submit application. Please try again later or
                  contact us directly.
                </p>
              )}
              {submitStatus === "idle" && (
                <p className="text-white/40 text-md font-light mt-2">
                  All transmissions are secured and treated with strict
                  confidentiality.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ── NEXT CHAPTER ── */}
        <NextChapterTransition nextTitle="CAREERS" nextHref="/careers" />

        {/* ── FOOTER ── */}
        <section className="relative z-10 bg-[#0a0a0a]">
          <FooterSection />
        </section>
      </main>
    </div>
  );
}
