"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  const handleStrategicClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const textSpan = btn.querySelector("span");
    const goldBg = btn.querySelector("div.bg-gold");

    // 1. Kill all ScrollTriggers immediately to free up layouts
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const tl = gsap.timeline({
      onComplete: () => {
        window.scrollTo(0, 0);
        router.push("/contact");
      },
    });

    // Morph the button into a circle
    tl.to(btn, {
      width: btn.offsetHeight,
      px: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Fade out text
    if (textSpan) {
      tl.to(
        textSpan,
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
        },
        "<"
      );
    }

    // Force gold background to fill the circle
    if (goldBg) {
      tl.to(
        goldBg,
        {
          y: 0,
          yPercent: 0,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
    }

    // Create the "Curtain" overlay programmatically
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:100vh;left:0;width:100vw;height:100vh;background:#050505;z-index:99999;pointer-events:none;";
    
    // Add gold radial glow to the overlay to match the theme
    const glow = document.createElement("div");
    glow.style.cssText =
      "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:90vw;height:90vw;background:radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);mix-blend-mode:screen;";
    overlay.appendChild(glow);
    document.body.appendChild(overlay);

    // Sweep overlay up
    tl.to(overlay, {
      top: 0,
      duration: 0.6,
      ease: "expo.inOut",
    });

    // Cleanup overlay right after navigation gives way
    setTimeout(() => {
      gsap.to(overlay, {
        top: "-100vh",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        },
      });
    }, 1200);
  };
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance animation
      if (heroTextRef.current) {
        const heroChildren =
          heroTextRef.current.querySelectorAll(".hero-reveal");
        gsap.set(heroChildren, { opacity: 0, y: 40 });
        const heroRule = document.getElementById("about-hero-rule");

        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(heroChildren, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out",
        });
        if (heroRule)
          tl.to(
            heroRule,
            { width: "100%", duration: 0.8, ease: "expo.out" },
            "-=0.4",
          );

        // Scroll-out parallax
        gsap.to(heroTextRef.current, {
          scale: 0.85,
          opacity: 0,
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: heroTextRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
          },
        });
      }

      // 2. Horizontal Scroll Section
      if (horizontalRef.current && horizontalWrapperRef.current) {
        const sections = gsap.utils.toArray(".hz-panel");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${horizontalWrapperRef.current?.offsetWidth || 0}`,
          },
        });
      }

      // 3. Reveal Y up
      const reveals = gsap.utils.toArray(
        ".reveal-up",
        pageRef.current!,
      ) as HTMLElement[];
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, rotationX: 10, transformOrigin: "0% 50%" },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 4. Parallax glow spheres
      const glows = gsap.utils.toArray(
        ".float-glow",
        pageRef.current!,
      ) as HTMLElement[];
      glows.forEach((glow, i) => {
        gsap.to(glow, {
          y: -200 - i * 50,
          rotate: 45,
          ease: "none",
          scrollTrigger: {
            trigger: glow.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-base min-h-screen text-white font-sans overflow-hidden selection:bg-white selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* ── 1. HERO — SPLIT EDITORIAL ── */}
        <section className="h-screen w-full flex items-end relative bg-base overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="float-glow absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 60%)",
              }}
            />
            <div
              className="float-glow absolute bottom-[-20%] right-[-5%] w-[50vw] h-[50vw] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
              }}
            />
          </div>

          <div
            ref={heroTextRef}
            className="relative w-full px-gutter pb-16 will-change-transform"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 lg:gap-20 items-end">
              <div className="hero-reveal">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-gold text-[11px] font-bold tracking-[0.4em] uppercase">
                    03/
                  </span>
                  <span className="w-12 h-px bg-white/15" />
                  <span className="text-[10px] tracking-[0.35em] text-white/30 uppercase font-bold">
                    About Us
                  </span>
                </div>

                <h1 className="text-[clamp(2.8rem,8vw,9rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-white">
                  WE TURN
                  <br />
                  COM
                  <span className="text-gold/80 italic font-serif font-normal px-2">
                    PLEXI
                  </span>
                  TY
                  <br />
                  <span className="text-[clamp(2rem,5vw,6rem)] text-gold/60 italic font-serif font-normal tracking-tight block mt-4">
                    into inevitability.
                  </span>
                </h1>
              </div>

              <div className="hero-reveal hidden lg:flex flex-col gap-6 self-end bg-black/40 backdrop-blur-sm rounded-sm p-8 -m-8 border border-white/5">
                <div className="flex items-center gap-3 pb-4 border-b border-gold/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gold/70 font-bold">
                    The Mandate
                  </p>
                </div>

                <p className="text-white/70 text-base font-light leading-[1.75]">
                  We don&apos;t manage complexity. We architect around it. One
                  system. One standard. Built for outcomes that remain.
                </p>

                <div
                  id="about-hero-rule"
                  className="w-0 h-px bg-gold origin-left mt-2 mb-2"
                />

                <a
                  href="#intro"
                  className="group inline-flex items-center gap-3 text-white/40 hover:text-gold transition-colors duration-300 w-max"
                >
                  <span className="w-6 h-px bg-white/30 group-hover:bg-gold group-hover:w-10 transition-all duration-300" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold">
                    Scroll to read
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. THE INTRO ── */}
        <section
          id="intro"
          className="px-gutter py-[18vh] bg-base relative z-10 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto flex flex-col gap-16 reveal-up">
            <p className="text-3xl md:text-5xl font-light leading-[1.4] text-white/60">
              If you&apos;re a CEO, founder, executive — or you run an SME that
              must grow — you know this moment: <br />
              <br />
              <span className="text-white">
                You can feel there&apos;s more possible&hellip; yet something in
                the system keeps draining energy.
              </span>
            </p>
            <div className="flex flex-col md:flex-row gap-12 pt-16 border-t border-white/10">
              <div className="flex-1 text-xl text-white/40 font-light leading-[1.8]">
                Too many topics, not enough sequence. Too much noise, not enough
                truth.
                <br />
                And even though everyone is smart, it doesn&apos;t get lighter —
                it just gets fuller.
              </div>
              <div className="flex-1 text-4xl text-gold font-serif italic">
                That&apos;s where our work begins.
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. THE AXIS ── */}
        <section className="px-gutter pt-[12vh] pb-[18vh] bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10vw] max-w-7xl mx-auto items-center">
            <div className="reveal-up">
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-bold tracking-tighter uppercase leading-[0.9]">
                NOT A TRADITIONAL <br />
                <span className="text-white/20">SERVICE PROVIDER.</span>
              </h2>
            </div>
            <div className="reveal-up text-xl md:text-2xl text-white/50 font-light leading-[1.6]">
              <p className="mb-12">
                We are an execution standard: strategy, structure, technology,
                communication, and human performance — built as one integrated
                system that reduces complexity and makes outcomes inevitable.
              </p>
              <div className="p-12 border border-gold/20 rounded-3xl bg-gold/2">
                <span className="text-xs uppercase tracking-[0.5em] text-gold font-bold block mb-6">
                  The Axis you feel
                </span>
                <p className="text-4xl text-white font-serif italic mb-4">
                  Nature
                </p>
                <p className="text-4xl text-white/60 font-serif italic mb-4 pl-8">
                  Animals
                </p>
                <p className="text-4xl text-white/30 font-serif italic pl-16">
                  Humans
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. WHAT WE DO DIFFERENTLY (HORIZONTAL SCROLL) ── */}
        <div
          ref={horizontalRef}
          className="bg-base h-screen w-full flex overflow-hidden border-t border-white/5 relative"
        >
          <div className="absolute top-[10%] left-[5vw] z-10 pointer-events-none">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block">
              WHAT WE DO DIFFERENTLY
            </span>
            <p className="text-xl font-serif italic text-white/50 mt-4">
              We build architecture — for clarity.
            </p>
          </div>

          <div
            ref={horizontalWrapperRef}
            className="flex h-full w-[max-content] will-change-transform"
          >
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  01
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Remove noise until only truth remains
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Most problems aren&apos;t complex — they&apos;re just
                    hidden. We reveal what truly drives the system: root cause,
                    leverage, sequence.
                  </p>
                </div>
              </div>
            </div>
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  02
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Make decisions light again
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    When a system becomes clear, decisions almost make
                    themselves. Not because it&apos;s &ldquo;easy,&rdquo; but
                    because it is finally ordered.
                  </p>
                </div>
              </div>
            </div>
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-gold/20 italic font-serif">
                  03
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 text-gold">
                    Build signal, not volume
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Marketing is Trust &amp; Demand Infrastructure: positioning,
                    proof architecture, messaging, conversion — built so premium
                    clients take you seriously instantly.
                  </p>
                </div>
              </div>
            </div>
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  04
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Technology as infrastructure
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Websites are not business cards. They are discovery, trust,
                    conversion, scale — including SEO and AI indexing.
                  </p>
                </div>
              </div>
            </div>
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  05
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Strengthen the human behind the system
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Because the best strategy fails when the human is burning
                    out. Coaching &amp; Mentoring means regulation, focus,
                    identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. WHAT WE STAND FOR ── */}
        <section className="px-gutter py-[16vh] bg-base">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24">
            <div className="flex-1 reveal-up">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block mb-8">
                WHAT WE STAND FOR
              </span>
              <p className="text-4xl md:text-6xl text-white font-light leading-[1.2]">
                We believe in something{" "}
                <span className="italic font-serif text-gold">radical</span> —
                and practical.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-12 reveal-up text-xl md:text-2xl text-white/50 font-light pt-4 border-t border-white/10 md:border-none md:pt-0">
              <p className="text-white/90 font-medium text-3xl">
                When structure becomes visible, the right solution becomes
                inevitable.
              </p>
              <p>
                Not &ldquo;someday.&rdquo; Not &ldquo;when there&apos;s
                time.&rdquo;
                <br />
                But in a way that lets a CEO breathe again.
                <br />
                In a way that helps founders know what comes first.
                <br />
                In a way that lets teams deliver with focus.
              </p>
              <div className="p-8 bg-white/5 rounded-2xl">
                <strong className="text-white text-sm uppercase tracking-[0.3em] block mb-4">
                  Solved means solved.
                </strong>
                <p className="text-lg">
                  &ldquo;Solved&rdquo; means you feel it on Monday morning, not
                  in a pitch: Less friction. Clearer decisions. Higher speed.
                  More calm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. MINI CASE STORIES (STICKY STACK — 3 cards) ── */}
        <section className="px-gutter py-[16vh] bg-base">
          <div className="reveal-up text-center mb-32">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block mb-6">
              MINI CASE STORIES
            </span>
            <p className="text-5xl font-serif italic text-white/80">
              You&apos;ll recognize yourself.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative space-y-32">
            {/* Card 1 — CEO */}
            <div className="sticky top-[15vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#111] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (CEO / Founder / Entrepreneur)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 1 — &ldquo;Too many moving parts&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      Everything matters, nothing is ordered. Decisions are
                      heavy.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gold mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-gold/80">
                      SolutionFinder → root cause visible → sequence + SSOT.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      fewer open loops, a clear line, noticeably more calm.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 — SME */}
            <div className="sticky top-[18vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#141414] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (SME / Premium Offer)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 2 — &ldquo;We&apos;re great — but invisible&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      High quality, unclear external signal. Inconsistent leads.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gold mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-gold/80">
                      messaging architecture + proof structure + trust system.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      the market understands you immediately. Trust forms faster.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 — Entrepreneur (Georgia) */}
            <div className="sticky top-[21vh] transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#1a1a1a] p-12 rounded-3xl border border-gold/20 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (Entrepreneur / Holding)
                  </span>
                  <h3 className="text-4xl font-bold text-gold mb-12">
                    Case 3 — &ldquo;Structure Deployment (Georgia)&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-gold/20 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      You want structure, but risk chaos, wrong sequence.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gold mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-gold/80">
                      defensible setup → clean coordination (compliant,
                      bankable).
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      structure stands. operations are clear. less stress.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. THE PATRON ── */}
        <section className="px-gutter py-[20vh] bg-base relative overflow-hidden">
          <div
            className="float-glow absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] opacity-50 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(15,10,0,1) 0%, transparent 70%)",
            }}
          />

          {/* Huge background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
            <h2 className="text-[clamp(10rem,25vw,30rem)] font-black tracking-tighter text-white/3 uppercase whitespace-nowrap">
              THE PATRON
            </h2>
          </div>

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            <h2 className="reveal-up text-[clamp(4rem,7vw,8rem)] font-extrabold tracking-tighter leading-[0.8] uppercase mb-16 mix-blend-screen text-white/90">
              THE PATRON <br />
              <span className="text-gold italic font-serif lowercase text-[clamp(3rem,5vw,6rem)] font-light">
                of gott wald
              </span>
            </h2>

            <div className="text-3xl md:text-5xl text-white font-light leading-[1.6] max-w-4xl space-y-12 reveal-up">
              <p>
                In the fabric of GOTT WALD, the PATRON is not the
                &ldquo;single maker&rdquo; — and not the lone specialist.
              </p>
              <p className="font-serif italic text-white/50 text-2xl md:text-4xl">
                The PATRON is a philosophical anchor.
              </p>
              <p className="text-xl md:text-2xl text-white/40 border-l border-gold/20 pl-8 text-left">
                Ensuring the human core remains present in every system — and
                enabling a diverse, global network of handpicked specialists to
                move as one aligned force.
              </p>
              <p className="font-serif italic text-gold pt-8 text-4xl md:text-6xl">
                The PATRON is not the face — <br />
                the PATRON is the conscience.
              </p>
            </div>
          </div>
        </section>

        {/* ── THE PATRON ROLE (Grid layout) ── */}
        <section className="px-gutter py-[18vh] bg-transparent">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="reveal-up">
              <h4 className="text-gold text-sm uppercase tracking-[0.3em] font-bold mb-8">
                What the PATRON is truly exceptional at
              </h4>
              <p className="text-3xl text-white font-light leading-relaxed mb-8">
                A reader of people. A feeler. A gatherer — in the best sense.
              </p>
              <div className="text-white/50 text-xl font-light space-y-6">
                <p>
                  The PATRON sees you before you&apos;ve fully organized
                  yourself. Hears between your sentences. Feels what you mean.
                </p>
                <p>
                  The PATRON is the communicator. The living word. The one who
                  touches — without touching.
                </p>
                <div className="p-8 border border-white/10 rounded-2xl mt-8">
                  <p className="text-white font-bold mb-4 uppercase tracking-widest text-xs">
                    Proof without show
                  </p>
                  <p>
                    People open up. Conflict becomes clear. Disorder becomes
                    direction. Pressure becomes purpose.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-16 reveal-up">
              <div>
                <h4 className="text-gold text-sm uppercase tracking-[0.3em] font-bold mb-8">
                  The role of the PATRON
                </h4>
                <p className="text-xl text-white/50 font-light mb-8">
                  The PATRON doesn&apos;t protect &ldquo;a company.&rdquo; The
                  PATRON protects what makes GOTT WALD possible:
                </p>
                <p className="text-3xl font-serif italic text-white/80 border-l border-gold/30 pl-8">
                  Values. Alignment. Integrity. Humanity.
                </p>
              </div>
              <div className="bg-[#111] p-12 rounded-3xl mt-auto">
                <p className="uppercase tracking-[0.2em] font-bold text-white/40 text-sm mb-6">
                  So GOTT WALD remains:
                </p>
                <ul className="text-4xl md:text-5xl font-serif italic text-gold space-y-4">
                  <li>A framework that carries.</li>
                  <li>A system that protects.</li>
                  <li>A force that unites.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="px-gutter py-[18vh] border-t border-gold/20 relative overflow-hidden bg-base">
          <div
            className="float-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] rounded-full pointer-events-none mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto flex flex-col gap-24 relative z-10">
            <div className="text-center reveal-up">
              <span className="text-xs tracking-[0.5em] uppercase text-gold font-bold block mb-8">
                HOW TO START (NO GAMES)
              </span>
              <h2 className="text-[clamp(4rem,8vw,7rem)] font-black tracking-tighter leading-[0.9] uppercase mb-8 text-white">
                IF YOU WANT IT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-white italic font-serif font-light tracking-normal lowercase">
                  cleanly solved
                </span>
              </h2>
              <button 
                onClick={handleStrategicClick}
                className="h-20 rounded-full bg-white text-black inline-flex items-center justify-center px-16 hover:scale-105 transition-all duration-500 uppercase text-sm tracking-[0.3em] font-extrabold shadow-[0_0_80px_rgba(212,175,55,0.4)] mb-12 relative overflow-hidden group"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500 will-change-transform">
                  Request Strategic Conversation
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out will-change-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
      <NextChapterTransition nextTitle="PARTNERSHIP" nextHref="/partnership" />
    </div>
  );
}
