"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";

gsap.registerPlugin(ScrollTrigger);

import AboutWaveCanvas from "@/components/AboutWaveCanvas";
import ShiftCanvas from "@/components/ShiftCanvas";

// color that matches its inner state (per client manifesto): gold = positive /
// stability, silver = neutral / space, petrol = depth / structure, turquoise =
// signal / clarity, copper = warmth / human presence. Distributes the full
// 5-color brand across the 8 sub-frequencies — each business "sounds" distinct.
type FrequencyTone = "gold" | "silver" | "petrol" | "copper" | "turquoise";

const FREQUENCY_TONE_CLASSES: Record<FrequencyTone, string> = {
  gold: "text-gold/55 group-hover:text-gold",
  silver: "text-silver/55 group-hover:text-silver",
  petrol: "text-petrol/80 group-hover:text-petrol",
  copper: "text-copper/55 group-hover:text-copper",
  turquoise: "text-turquoise/65 group-hover:text-turquoise",
};

const ECOSYSTEM_FREQUENCIES: ReadonlyArray<{
  name: string;
  frequency: string;
  desc: string;
  tone: FrequencyTone;
  image: string;
}> = [
  {
    name: "SolutionFinder / Solution Management",
    frequency: "Clarity",
    desc: "Find the cause, lead the solution, lock stability.",
    tone: "turquoise", // signal — clarity / leadership
    image: "/images/orchestra/clarity.png",
  },
  {
    name: "Consulting",
    frequency: "Structure",
    desc: "Executive-grade strategy, decision systems, and growth.",
    tone: "petrol", // depth — structural strategy
    image: "/images/orchestra/structure.png",
  },
  {
    name: "Marketing & Communication",
    frequency: "Signal",
    desc: "Trust and demand infrastructure.",
    tone: "gold", // positive — trust / signal
    image: "/images/orchestra/signal.png",
  },
  {
    name: "IT Solutions 2030",
    frequency: "Momentum",
    desc: "Websites as high-performance, indexable infrastructure.",
    tone: "silver", // neutral metallic — infrastructure
    image: "/images/orchestra/momentum.png",
  },
  {
    name: "Coaching & Mentoring",
    frequency: "Presence",
    desc: "A human operating system for high responsibility.",
    tone: "copper", // warmth — empathy / human presence
    image: "/images/orchestra/presence.png",
  },
  {
    name: "Structure Deployment (Georgia)",
    frequency: "Stability",
    desc: "Defensible setup for entrepreneurs and holdings.",
    tone: "petrol", // depth — defensible structure
    image: "/images/orchestra/stability.png",
  },
  {
    name: "YIG.CARE",
    frequency: "Expansion",
    desc: "Platform and movement. Launch 2026.",
    tone: "silver", // space / awareness / expansion
    image: "/images/orchestra/expansion.png",
  },
  {
    name: "PLHH_Coin",
    frequency: "Harmony",
    desc: "RWA and Governance DAO for real-world regeneration.",
    tone: "gold", // stability / trust / reliability
    image: "/images/orchestra/harmony.png",
  },
];

const PILLARS_DATA= [
              {
                num: "01",
                principle: "CLARITY",
                title: "We remove noise until only truth remains",
                desc: "Most problems aren't complex — they're just hidden. We reveal what truly drives the system: root cause, leverage, sequence.",
                image: "/about/pillar_clarity_premium_1781530185774.png",
              },
              {
                num: "02",
                principle: "LIGHTNESS",
                title: "We make decisions light again",
                desc: 'When a system becomes clear, decisions almost make themselves. Not because it\'s "easy," but because it is finally ordered.',
                image: "/about/pillar_lightness_premium_1781530200059.png",
              },
              {
                num: "03",
                principle: "SIGNAL",
                title: "We build signal, not volume",
                desc: "Marketing is not a campaign. It's Trust & Demand Infrastructure: positioning, proof architecture, messaging, conversion — built so premium clients and top talent take you seriously immediately.",
                image: "/about/pillar_signal_premium_1781530213416.png",
              },
              {
                num: "04",
                principle: "INFRASTRUCTURE",
                title: "We treat technology as infrastructure",
                desc: "Websites are not business cards. They are discovery, trust, conversion, scale — including SEO and AI indexing. With IT Solutions 2030, we transform outdated presences into future-ready digital infrastructure.",
                image: "/about/pillar_infrastructure_premium_1781530227488.png",
              },
              {
                num: "05",
                principle: "PRESENCE",
                title: "We strengthen the human behind the system",
                desc: "Because the best strategy fails when the person behind it is burning out or drifting. Coaching & Mentoring with us means regulation, focus, clarity, identity — so performance becomes sustainable.",
                image: "/about/pillar_presence_premium_1781530240970.png",
              },
            ]

export default function AboutClient() {
  // Page-scoped namespace: t("hero.line1"), t("manifesto.title"), etc.
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeProofPhase, setActiveProofPhase] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeShiftIndex, setActiveShiftIndex] = useState<number>(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const [hoveredEcoIndex, setHoveredEcoIndex] = useState<number | null>(null);
  const ecoCursorRef = useRef<HTMLDivElement>(null);

  // Smooth cursor follow for the orchestra image reveal
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredEcoIndex !== null && ecoCursorRef.current) {
        gsap.to(ecoCursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power3.out",
        });
        
        // Inner image parallax
        const px = (e.clientX / window.innerWidth) - 0.5;
        const py = (e.clientY / window.innerHeight) - 0.5;
        const imgs = ecoCursorRef.current.querySelectorAll('img');
        gsap.to(imgs, {
          x: px * -100, // Opposite direction parallax
          y: py * -100,
          scale: 1.15, // Extra scale to hide edges during parallax
          duration: 0.8,
          ease: "power2.out",
        });
      }
    };
    
    if (hoveredEcoIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      // Reset parallax on mouse leave
      if (ecoCursorRef.current) {
        const imgs = ecoCursorRef.current.querySelectorAll('img');
        gsap.to(imgs, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
      }
    }
    
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredEcoIndex]);

  // Observer for "What shifts" section scrolling using ScrollTrigger
  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>(".shift-article");
    const triggers = elements.map((el) => {
      const idx = Number(el.getAttribute("data-shift-index"));
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveShiftIndex(idx),
        onEnterBack: () => setActiveShiftIndex(idx),
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Living Environment behaviors (time-of-day, dwell, scroll-pace, seed) +
  // FrequencyEngine + orchestration aside are now mounted site-wide via
  // <LivingEnvironment /> in app/layout.tsx. About-specific local copies
  // removed to avoid double-mounting and keep behavior in one place.

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
    // Magnetic-button handler is registered outside the gsap.context so we
    // can detach the window listener cleanly on unmount; ctx.revert() only
    // tears down GSAP-managed tweens.
    let magneticHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          gsap.set(".journey-progress", { scaleY: progress });
        },
      });

      // 1. Hero "Tuning Sequence" — letter-by-letter oscillation arrival.
      // Each character arrives with elastic ease as if tuning into its
      // final frequency position. Award-caliber kinetic typography signature.
      const tuningLines = gsap.utils.toArray<HTMLElement>(".tuning-line");
      tuningLines.forEach((line, idx) => {
        const text = line.textContent || "";
        line.innerHTML = "";
        for (const char of text) {
          const span = document.createElement("span");
          span.textContent = char === " " ? " " : char;
          span.style.display = "inline-block";
          span.style.willChange = "transform, opacity";
          span.classList.add("tuning-char");
          line.appendChild(span);
        }
        const chars = line.querySelectorAll(".tuning-char");
        if (reducedMotion) {
          gsap.set(chars, { yPercent: 0, opacity: 1, scaleY: 1 });
        } else {
          gsap.fromTo(
            chars,
            { yPercent: 105, opacity: 0, scaleY: 0.6 },
            {
              yPercent: 0,
              opacity: 1,
              scaleY: 1,
              duration: 1.5,
              stagger: 0.015,
              ease: "elastic.out(1, 0.65)",
              delay: 0.15 + idx * 0.16,
              force3D: true,
              clearProps: "willChange",
            },
          );
        }
      });

      // Frame elements (top track marker + bottom data row) fade in after
      // letters settle — restraint-first composition.
      gsap.to(".hero-frame", {
        opacity: 1,
        duration: 1.4,
        delay: 0.5,
        ease: "power2.out",
        stagger: 0.2,
      });

      // Frequency wave draws in — literal visualization of the brand's
      // "frequency" language sitting between the two display lines.
      const wavePath = document.querySelector(".frequency-wave") as SVGPathElement | null;
      if (wavePath) {
        const len = wavePath.getTotalLength();
        gsap.set(wavePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(wavePath, {
          strokeDashoffset: 0,
          duration: 2.8,
          delay: 1.0,
          ease: "power3.inOut",
        });
      }
      const echoPath = document.querySelector(".frequency-wave-echo") as SVGPathElement | null;
      if (echoPath) {
        const len = echoPath.getTotalLength();
        gsap.set(echoPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(echoPath, {
          strokeDashoffset: 0,
          duration: 3.4,
          delay: 1.3,
          ease: "power3.inOut",
        });
      }

      // Ongoing subtle frequency breathing — entire headline pulses softly
      // as if continuously resonating at its tuned frequency.
      if (!reducedMotion) {
        gsap.to(".tuning-headline", {
          scale: 1.005,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Hero scroll parallax — headline drifts up, frame stays close.
      if (!reducedMotion) {
        gsap.to(".tuning-headline", {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-frame", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Brand Assets — Cinematic Ken-Burns + Counter-Drift Parallax.
        // The image starts slightly zoomed-in and drifts upward while
        // continuing to grow — the classic award-site signature for
        // imagery that "breathes" with the scroll. Combined with the
        // headline parallax above (drifts up), the eye gets two opposing
        // motion vectors that create cinematic depth.
        gsap.fromTo(".hero-bg-image",
          { yPercent: -8, scale: 1.05 },
          {
            yPercent: 14,
            scale: 1.22,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(".patron-craft-img",
          { yPercent: -8, scale: 1.06 },
          {
            yPercent: 10,
            scale: 1.18,
            ease: "none",
            scrollTrigger: {
              trigger: ".patron-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );

        gsap.fromTo(".living-system-img",
          { yPercent: -4, scale: 1.04 },
          {
            yPercent: 4,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: ".living-system-visual",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );

      }

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

      // 3.5 PILLARS — One timeline mapped to the sticky element's actual
      // scrollable range (`top top` → `bottom bottom`). Using percentage-based
      // triggers on the full outer wrapper previously delayed the final
      // handoffs until after the sticky stage had started leaving the viewport.
      const pillarSection = document.querySelector<HTMLElement>(
        ".about-pillars-pin",
      );
      if (pillarSection && !reducedMotion) {
        const frames = gsap.utils.toArray<HTMLElement>(
          pillarSection.querySelectorAll(".pillar-stage-frame"),
        );
        const dots = gsap.utils.toArray<HTMLElement>(
          pillarSection.querySelectorAll(".pillar-dot"),
        );
        const counter =
          pillarSection.querySelector<HTMLElement>(".pillar-counter");
        const total = frames.length;

        // Reset frames so GSAP drives them from a clean baseline.
        gsap.set(frames.slice(1), { opacity: 0, y: 40 });
        gsap.set(frames[0], { opacity: 1, y: 0 });

        const updatePillarChrome = (index: number) => {
          if (counter)
            counter.textContent = String(index + 1).padStart(2, "0");
          dots.forEach((dot, dotIndex) => {
            dot.style.backgroundColor =
              dotIndex <= index
                ? "rgb(18, 168, 172)"
                : "rgba(255, 255, 255, 0.12)";
          });
        };

        const pillarTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pillarSection,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.0,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              updatePillarChrome(
                Math.min(total - 1, Math.round(progress * (total - 1))),
              );
              // Animate vertical progress bar: grows from 20% → 100% as all pillars scroll through
              const progressBar = pillarSection.querySelector<HTMLElement>(".pillar-progress-bar");
              if (progressBar) {
                progressBar.style.height = `${20 + progress * 80}%`;
              }
            },
          },
        });

        // Hold every frame before its transition. Each pillar gets ~100vh of scroll dwell.
        for (let i = 1; i < total; i++) {
          const transitionAt = i - 0.5;
          pillarTimeline.to(
            frames[i - 1],
            {
              opacity: 0,
              y: -32,
              duration: 0.22,
              ease: "power2.inOut",
            },
            transitionAt,
          );
          pillarTimeline.fromTo(
            frames[i],
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.inOut",
            },
            transitionAt,
          );
        }

        // Give the final frame a comfortable reading hold before releasing the pin.
        pillarTimeline.to({}, { duration: 0.5 });
      }

      // 3.8 SHIFTS WATERMARK PARALLAX
      const proofSection = document.querySelector('section[data-journey="proof"]');
      if (proofSection && !reducedMotion) {
        const shiftsWatermark = proofSection.querySelector(".about-shifts-watermark");
        if (shiftsWatermark) {
          gsap.fromTo(
            shiftsWatermark,
            { y: 60 },
            {
              y: -100,
              ease: "none",
              scrollTrigger: {
                trigger: proofSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      }

      // 4. CTA Section — cinematic entrance
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

      }

      // 5. Magnetic CTA — pulls toward the cursor within a 220px radius.
      const magneticBtn =
        pageRef.current?.querySelector<HTMLElement>(".magnetic-cta");
      if (magneticBtn && !reducedMotion) {
        magneticHandler = (e: MouseEvent) => {
          const rect = magneticBtn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            const strength = Math.max(0, 1 - dist / 220);
            gsap.to(magneticBtn, {
              x: dx * 0.24 * strength,
              y: dy * 0.24 * strength,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(magneticBtn, {
              x: 0,
              y: 0,
              duration: 0.85,
              ease: "elastic.out(1, 0.55)",
              overwrite: "auto",
            });
          }
        };
        window.addEventListener("mousemove", magneticHandler);
      }

      // 6. Awwwards Premium Mouse Parallax for Background Elements (Independent of Magnetic CTA)
      let parallaxHandler: ((e: MouseEvent) => void) | null = null;
      if (!reducedMotion) {
        parallaxHandler = (e: MouseEvent) => {
          const px = (e.clientX / window.innerWidth - 0.5);
          const py = (e.clientY / window.innerHeight - 0.5);
          
          gsap.to(".about-parallax-target", {
            x: px * 120, // Increased movement so it's very obvious
            y: py * 120,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto"
          });
          
          gsap.to(".about-liquid-aurora", {
            x: px * -200, // Counter-movement
            y: py * -200,
            duration: 2.5,
            ease: "power3.out",
            overwrite: "auto"
          });
        };
        window.addEventListener("mousemove", parallaxHandler);
      }
    }, pageRef);

    return () => {
      ctx.revert();
      if (magneticHandler) window.removeEventListener("mousemove", magneticHandler);
      // Clean up parallax handler
      const ph = (window as any)._parallaxHandler;
      if (ph) window.removeEventListener("mousemove", ph);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-[#070c14] min-h-screen text-white/80 font-sans overflow-x-clip selection:bg-gold/20 selection:text-white"
    >
      <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 pointer-events-auto ${
        headerScrolled
          ? "bg-[#070c14]/85 backdrop-blur-md border-b border-white/[0.04]"
          : "bg-transparent"
      }`}>
        <div className="px-gutter">
          <Header />
        </div>
      </div>

      <main>
        {/* ── HERO ── Editorial statement: tension–release typography on a void.
            Strip every decorative "premium signal" (track numbers, tech labels,
            tick marks, dashboard stats). Let the typography carry it. */}
        <section
          data-journey="perception"
          className="hero-section about-hero-material relative w-full min-h-[100svh] bg-[#070c14] overflow-hidden flex flex-col"
        >
          {/* Ambient frequency-field anchor — sits at the lowest z layer,
              dimmed and screened so the typography stays the focal point.
              This is the section's bespoke visual signature. */}
          <div className="about-visual about-visual--hero pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <AboutWaveCanvas />
          </div>

          {/* Top: minimal brand mark — earns its place because it tells you where you are. */}
          <div className="hero-frame relative z-10 px-gutter pt-28 md:pt-[7.5rem] lg:pt-32 opacity-0">
            <div className="flex items-center gap-4">
            
            </div>
          </div>

          {/* Center — three-line editorial cascade with tension–release rhythm.
              Line 1 (setup) light + small, Line 2 (subject) massive + black,
              Line 3 (resolution) italic + medium. The hierarchy is the design. */}
          <div className="relative z-10 flex-1 flex flex-col justify-start px-gutter pt-[clamp(3.5rem,9vh,7rem)] pb-12 lg:pb-16">
            <h1
              translate="no"
              className="tuning-headline notranslate w-full max-w-[1600px]"
              aria-label="We Turn Complexity into Inevitability"
            >
              <div className="overflow-hidden mb-1 lg:mb-2">
                <span
                  className="tuning-line block font-light uppercase text-white/60 leading-[1.05] tracking-[-0.015em] whitespace-nowrap"
                  style={{ fontSize: "calc(clamp(2.2rem, 6.5vw, 92px) * var(--heading-scale))" }}
                  data-line="1"
                >
                  {t("hero.line1")}
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className="tuning-line hero-complexity block font-black uppercase leading-[0.86] tracking-[-0.045em] whitespace-nowrap"
                  style={{ fontSize: "calc(clamp(3.5rem, 11.5vw, 168px) * var(--heading-scale))" }}
                  data-line="2"
                >
                  {t("hero.line2")}
                </span>
              </div>

              {/* Single quiet resonance line — the only decorative element,
                  earned because it visualizes the brand's literal frequency word. */}
              <div className="my-5 lg:my-7 max-w-[22rem] lg:max-w-md pointer-events-none">
                <svg
                  viewBox="0 0 400 12"
                  preserveAspectRatio="none"
                  className="w-full h-3 overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    className="frequency-wave"
                    d="M0,6 Q50,2 100,6 T200,6 T300,6 T400,6"
                    fill="none"
                    stroke="rgba(18,168,172,0.6)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div className="overflow-hidden">
                <span
                  className="tuning-line block font-light italic text-white/85 leading-[1.0] tracking-[-0.005em] whitespace-nowrap"
                  style={{ fontSize: "calc(clamp(1.8rem, 4.8vw, 70px) * var(--heading-scale))" }}
                  data-line="3"
                >
                  {t("hero.line3")}
                </span>
              </div>
            </h1>
          </div>

          {/* Bottom: single positioning sentence. No stats, no dashboard widget. */}
          <div className="hero-frame relative z-10 px-gutter pb-10 lg:pb-12 opacity-0">
            <div className="border-t border-white/[0.05] pt-6 max-w-2xl">
              <p className="text-[16px]   font-light text-white/80 leading-[1.7]">
                If you&apos;re a CEO, founder, or executive — or you run an SME
                that must grow,{" "}
                <span className="text-white">you know this moment.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── NARRATIVE — Diagnostic Cadence ──
            Editorial rhythm: each block earns its own position on the page.
            No template blur orbs, no centered gradient moments. Variations in
            alignment, scale, and italic emphasis create the visual journey
            from observation → assessment → weight → turn. */}
        <section
          data-journey="openness"
          className="about-atmosphere bg-[#070c14] relative z-10 py-[14vh] lg:py-[18vh] overflow-hidden"
        >
          <div className="max-w-[1400px] mx-auto px-gutter relative z-10 w-full">

            {/* Block 1 — The Observation. Left, sets the scene. */}
            <div className="reveal-text max-w-4xl mb-[11vh] lg:mb-[13vh]">
              <p
                className="font-light leading-[1.2] tracking-[-0.015em]"
                style={{ fontSize: "calc(clamp(1.75rem, 3.6vw, 3.4rem) * var(--heading-scale))" }}
              >
                <span className="text-white/55">You can feel there&apos;s more possible</span>
                <span className="text-white/40">…</span>
                <span className="block mt-3 text-white/95 italic font-light">
                  yet something in the system keeps draining energy.
                </span>
              </p>
            </div>

            {/* Block 2 — The Assessment. Indented right, compressed dialog. */}
            <div className="reveal-text max-w-3xl ml-auto mr-0 mb-[11vh] lg:mb-[13vh] pr-0 lg:pr-12">
              <p
                className="font-light leading-[1.3] tracking-[-0.012em] text-white/55"
                style={{ fontSize: "calc(clamp(1.45rem, 2.8vw, 2.6rem) * var(--heading-scale))" }}
              >
                Too many topics,{" "}
                <span className="text-white/95 font-normal">not enough sequence.</span>
                <br />
                Too much noise,{" "}
                <span className="text-white/95 font-normal">not enough truth.</span>
              </p>
            </div>

            {/* Block 3 — The Weight. Left, largest moment, building tension. */}
            <div className="reveal-text max-w-4xl mb-[10vh] lg:mb-[12vh]">
              <p
                className="font-light leading-[1.18] tracking-[-0.018em] text-white/55"
                style={{ fontSize: "calc(clamp(1.85rem, 3.9vw, 3.6rem) * var(--heading-scale))" }}
              >
                And even though everyone is smart,
                <span className="block mt-2">
                  it doesn&apos;t get lighter —{" "}
                  <span className="text-white/95 font-normal">it just gets fuller.</span>
                </span>
              </p>
            </div>

            {/* Block 4 — The Turn. Right-aligned italic resolution.
                The small resonance line connects back to the hero's frequency
                language — visual through-line across sections. */}
            <div className="reveal-text max-w-3xl ml-auto mr-0">
              <div className="mb-6 max-w-[14rem] ml-auto pointer-events-none">
                <svg
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                  className="w-full h-2 overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    d="M0,4 Q25,1 50,4 T100,4 T150,4 T200,4"
                    fill="none"
                    stroke="rgba(18,168,172,0.55)"
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <p
                className="font-light italic text-white/95 text-right leading-[1.05] tracking-[-0.018em]"
                style={{ fontSize: "calc(clamp(1.85rem, 4.2vw, 3.4rem) * var(--heading-scale))" }}
              >
                That&apos;s where our work begins.
              </p>
            </div>

          </div>
        </section>

        {/* ── THE DIFFERENCE — Manifesto cadence ──
            Strip the bg axis image + mix-blend gradient overlay (template).
            Strip the centered values triplet (cliché). Build a three-movement
            editorial flow: foundation statement → axis as orchestral movements
            → standalone right-aligned anchor. */}
        <section
          data-journey="trust"
          className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14] overflow-hidden"
        >
          {/* German copy is owned by next-intl (about.manifesto.*) so GT must
              skip the manifesto + axis block to avoid double-translation. */}
          <div translate="no" className="notranslate max-w-[1400px] mx-auto relative z-10">

            {/* Block 1 — Foundation Statement. Left-aligned title with
                right-indented elaboration body. Creates editorial dialogue. */}
            <div className="reveal-text mb-[12vh] lg:mb-[14vh]">
              <h2
                className="font-light text-white leading-[1.15] tracking-[-0.018em] max-w-4xl"
                style={{ fontSize: "calc(clamp(1.8rem, 3.6vw, 3.2rem) * var(--heading-scale))" }}
              >
                {t("manifesto.title")}
              </h2>
              <div className="mt-10 lg:mt-14 ml-auto max-w-2xl pl-0 lg:pl-8">
                <p
                  className="font-light text-white/65 leading-[1.55] tracking-[-0.005em]"
                  style={{ fontSize: "calc(clamp(1.05rem, 1.5vw, 1.45rem) * var(--heading-scale))" }}
                >
                  {t("manifesto.body")}
                </p>
              </div>
            </div>

            {/* Block 2 — The Axis as orchestral movements. Three lines,
                Roman-numeral marked, descending divider, editorial precision.
                The three concentric ellipses literalize Nature / Animals /
                Humans — anchor diagram sits to the right of the text. */}
            <div className="reveal-text mb-[12vh] lg:mb-[14vh] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative">
              <div className="relative z-10 lg:col-span-7">
                <p className="text-[11px] tracking-[0.42em] text-white/45 font-light uppercase mb-10 lg:mb-12 max-w-md">
                  {t("manifesto.axisLead")}
                </p>
                <div className="w-full">
                  {[
                    { word: t("manifesto.nature"),  num: "I" },
                    { word: t("manifesto.animals"), num: "II" },
                    { word: t("manifesto.humans"),  num: "III" },
                  ].map((it) => (
                    <div
                      key={it.num}
                      className="flex items-baseline gap-6 lg:gap-10 border-b border-white/[0.07] py-3 lg:py-5"
                    >
                      <span className="text-[10px] tracking-[0.4em] text-gold/55 font-mono uppercase shrink-0 w-8">
                        {it.num}
                      </span>
                      <span
                        className="font-light text-white/95 tracking-[-0.022em] leading-none whitespace-nowrap"
                        style={{ fontSize: "calc(clamp(2rem, 5vw, 4.4rem) * var(--heading-scale))" }}
                      >
                        {it.word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="living-system-visual about-visual about-visual--living pointer-events-none hidden lg:block lg:col-span-5 relative aspect-[4/5] overflow-hidden"
              >
                <Image
                  src="/images/about_axis_abstract_ci.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="living-system-img about-visual-image object-cover"
                />
              </div>
            </div>

            {/* Block 3 — Standalone right-aligned anchor. Resonance line
                connects back to hero/narrative through-line. No eyebrow tag,
                no border-top, no card. */}
            <div className="reveal-text max-w-5xl ml-auto mr-0 text-right border-y border-white/[0.08] py-10 md:py-14">
              <div className="mb-6 max-w-[14rem] ml-auto pointer-events-none">
                <svg
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                  className="w-full h-2 overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    d="M0,4 Q25,1 50,4 T100,4 T150,4 T200,4"
                    fill="none"
                    stroke="rgba(18,168,172,0.55)"
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <h3
                className="font-black text-white leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: "calc(clamp(2.3rem, 6.2vw, 90px) * var(--heading-scale))" }}
              >
                We don&apos;t optimize parts.
              </h3>
              <p
                className="mt-6 lg:mt-8 font-light italic text-white/75 leading-[1.3] tracking-[-0.01em]"
                style={{ fontSize: "calc(clamp(1.2rem, 2.2vw, 2rem) * var(--heading-scale))" }}
              >
                We redesign the system — until &quot;solved&quot; is felt in real life.
              </p>
            </div>

          </div>
        </section>

        {/* WHAT WE STAND FOR */}
        <section className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14] border-y border-white/[0.04]">
          <div className="max-w-[1400px] mx-auto relative z-10">
            <p className="reveal-text text-[10px] tracking-[0.42em] uppercase text-turquoise/75 font-light mb-14">
              What we stand for
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-start">
              
              <div className="reveal-text space-y-10 lg:col-span-8">
                <h3 className="text-[clamp(2.5rem,5vw,5.5rem)] font-light leading-[1.02] tracking-[-0.035em] text-white/90">
                  We believe in something radical — <br className="hidden md:block" />
                  <span className="font-light italic tracking-[-0.02em] text-turquoise/80 mt-2 block">
                    and practical:
                  </span>
                </h3>
                <p className="text-[clamp(1.2rem,2vw,1.5rem)] text-white/80 leading-relaxed font-light max-w-xl">
                  When structure becomes visible, the right solution becomes
                  inevitable. Not &quot;someday.&quot; Not &quot;when
                  there&apos;s time.&quot;
                </p>
                
                <ul className="pt-4 max-w-4xl border-t border-white/[0.08]">
                  {[
                    "But in a way that lets a CEO breathe again.",
                    "In a way that helps founders know what comes first.",
                    "In a way that lets teams deliver with focus — and systems carry instead of pull."
                  ].map((text, idx) => (
                    <li key={idx} className="flex gap-5 items-start py-5 border-b border-white/[0.07]">
                      <span className="font-mono text-[10px] tracking-[0.25em] text-gold/55 mt-1.5 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-lg text-white/75 font-light leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal-text lg:col-span-4 lg:mt-[8vh] lg:border-l border-white/[0.08] lg:pl-10 flex flex-col justify-center relative">
                <h4 className="text-[clamp(3.5rem,6vw,7rem)] font-light text-white/55 mb-10 leading-[0.86] tracking-[-0.055em]">
                  Solved
                  <span className="block text-[0.42em] leading-[1.1] tracking-[-0.02em] text-white/35 mt-4">
                    means
                  </span>
                  <strong className="text-white font-semibold block">
                    solved.
                  </strong>
                </h4>
                
                <div className="border-t border-turquoise/45 pt-6 mb-8 max-w-md">
                  <p className="text-xl md:text-2xl font-light tracking-[0.02em] text-white/90 leading-[1.4]">
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
        <section
          data-journey="pillars"
          className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14]"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="reveal-text mb-24 lg:mb-28 max-w-5xl">
              <div className="flex items-center gap-6 mb-12">
                <span className="w-16 h-px bg-turquoise/50 origin-left" />
                <p className="text-[10px] tracking-[0.38em] uppercase text-turquoise/75 font-light">
                  What we do differently
                </p>
              </div>

              <h3 className="text-[clamp(3rem,5vw,6rem)] font-light leading-[1.05] tracking-tight text-white/80 space-y-1">
                <div className="overflow-hidden">
                  <span className="block">
                    The world is full of
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-4 text-white">
                    “optimizations.”
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-8 text-white/80">
                    We build{" "}
                    <span className="font-semibold uppercase tracking-[0.04em] text-turquoise">
                      architecture
                    </span>{" "}
                    —
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block md:pl-16 text-white/70 text-[clamp(2rem,3.5vw,4rem)] py-2">
                    so growth doesn&apos;t mean “more pressure,”
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="block font-medium text-white pt-2">
                    but more clarity.
                  </span>
                </div>
              </h3>
            </div>

          </div>
        </section>

        {/* PILLARS — Pinned cinematic showcase. The signature SOTD move.
            Outer wrapper is 500vh tall (5 frames × 100vh); inner stage is
            position:sticky to hold each frame in the viewport while the
            reader scrolls. Each pillar gets the entire viewport: massive
            Playfair numeral, massive title, descriptive body. GSAP scrubs
            opacity crossfades + y-shift between frames as scroll progresses.

            Reduced motion: pin/scrub disabled (fall-through to stacked view). */}
        <section
          className="about-pillars-pin relative bg-[#070c14]"
          style={{ height: "500vh" }}
        >
          <div className="about-pillars-stage sticky top-0 h-screen overflow-hidden">

            {/* Vertical turquoise progress bar — left edge signature */}
            <div className="absolute left-0 top-0 bottom-0 w-px z-30 pointer-events-none">
              <div
                className="pillar-progress-bar absolute top-0 left-0 w-full bg-turquoise/60"
                style={{ height: "20%" }}
              />
            </div>

            {/* Top banner — section label + counter */}
            <div className="absolute top-[5vh] left-0 right-0 px-8 lg:px-16 z-20">
              <div className="flex items-center gap-5">
                <span className="w-8 h-px bg-turquoise/55" />
                <p className="text-[10px] tracking-[0.42em] uppercase text-turquoise/75 font-light">
                  5 Principles
                </p>
                <span className="hidden md:block flex-1 h-px bg-gradient-to-r from-turquoise/12 to-transparent" />
                <p className="text-[11px] tracking-[0.32em] uppercase text-white/30 font-mono">
                  <span className="text-turquoise pillar-counter">01</span>
                  <span className="opacity-40"> / 05</span>
                </p>
              </div>
            </div>

            {/* Stage — all 5 frames stacked, GSAP fades between them */}
            {PILLARS_DATA.map((pillar, i) => (
              <div
                key={i}
                className="pillar-stage-frame absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Full-height image — left 50% of viewport. Bleeds edge-to-edge vertically. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-[50vw] lg:w-[46vw] z-[1] overflow-hidden"
                >
                  {/* Turquoise scan-line image — screen blend keeps it luminous */}
                  <Image
                    src={pillar.image}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-contain object-center"
                    style={{
                      mixBlendMode: "screen",
                      opacity: 0.92,
                      filter: "brightness(1.08) saturate(1.12)",
                    }}
                    priority={i === 0}
                  />
                  {/* Right edge fade — bleeds image into text zone */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#070c14]" />
                  {/* Subtle vignette top + bottom */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#070c14]/40 via-transparent to-[#070c14]/40" />
                </div>

                {/* Right half — editorial typography, centered in readable zone */}
                <div className="absolute right-0 top-0 bottom-0 w-[54vw] lg:w-[56vw] flex flex-col justify-center pl-8 lg:pl-16 pr-8 lg:pr-24 z-10 pt-[10vh] pb-[14vh]">

                  {/* Principle number + name */}
                  <div className="flex items-center gap-4 mb-10 lg:mb-14">
                    <span
                      className="font-mono text-[10px] tracking-[0.4em] text-turquoise/60"
                    >
                      {pillar.num}
                    </span>
                    <span className="w-12 h-px bg-turquoise/30" />
                    <span className="font-mono text-[10px] tracking-[0.36em] uppercase text-white/35">
                      {pillar.principle}
                    </span>
                  </div>

                  {/* Main title — massive, editorial */}
                  <h4
                    className="font-light leading-[0.95] tracking-[-0.034em] text-white mb-10 lg:mb-14"
                    style={{
                      fontSize: "calc(clamp(2.8rem, 6.2vw, 6.4rem) * var(--heading-scale))",
                    }}
                  >
                    {pillar.title}.
                  </h4>

                  {/* Divider */}
                  <div className="w-16 h-px bg-turquoise/35 mb-8 lg:mb-10" />

                  {/* Description */}
                  <p className="text-[clamp(1.05rem,1.3vw,1.4rem)] text-white/65 font-light leading-[1.65] max-w-[36rem]">
                    {pillar.desc}
                  </p>
                </div>
              </div>



            ))}

            {/* Bottom — chapter progress bar, one segment per pillar */}
            <div className="absolute bottom-[7vh] left-0 right-0 px-8 lg:px-16 z-20">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    data-pillar-dot={i}
                    className={`pillar-dot h-px flex-1 transition-all duration-700 ${
                      i === 0 ? "bg-turquoise" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sentinel — closes the visual "What we do differently" section.
            The pinned showcase above provided its own structural wrapping; this
            is just a hairline that re-establishes vertical rhythm before the
            next major section (PROOF) begins. */}
        <div className="bg-[#070c14] border-t border-white/[0.04]" />

        {/* OUTCOMES & TIME TO VALUE */}
        <section
          data-journey="proof"
          className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14] border-y border-white/[0.04]"
        >
          {/* Atmospheric depth — Replaced static image with Awwwards Premium Liquid Aurora */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {/* Dramatically increased opacity and size so it's impossible to miss */}
            <div className="about-liquid-aurora absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.28] blur-[120px] z-0 will-change-transform">
              <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_15s_linear_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-copper to-petrol rounded-full animate-[spin_20s_linear_infinite_reverse] mix-blend-overlay" />
            </div>
            
            <div className="absolute inset-0 proof-grain opacity-[0.22]" />
            {/* Corner index mark — Swiss editorial tick that establishes
                "measured section" tone before the eye reaches the headline. */}
            <div className="absolute top-8 right-[5vw] hidden md:flex items-center gap-3 text-[9px] font-mono tracking-[0.4em] uppercase text-white/25">
              <span>03 · Proof</span>
              <span className="w-8 h-px bg-white/15" />
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto relative z-10">
            {/* PROOF header — editorial confidence over equal-grid label.
                "Discreetly" gets italic emphasis; the disclaimer about
                numbers becomes a small right-column whisper bound to the
                headline by a vertical hairline. */}
            <div className="reveal-text mb-24 lg:mb-32">
              <div className="flex items-center gap-6 mb-10 md:mb-12">
                <span className="w-12 h-px bg-gold/40" />
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold/80 font-bold">
                  Proof
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
                <div className="lg:col-span-8">
                  <h3
                    className="text-white font-light leading-[0.96] tracking-[-0.038em]"
                    style={{
                      fontSize:
                        "calc(clamp(2.6rem, 5.2vw, 5.8rem) * var(--heading-scale))",
                    }}
                  >
                    Quietly.
                    <span className="block italic text-white/55 font-light">
                      Methodically.
                    </span>
                  </h3>
                </div>
                <div className="lg:col-span-4 lg:pl-10 lg:border-l border-white/[0.08] pb-2">
                  <p className="text-[clamp(1rem,1.2vw,1.2rem)] font-light text-white/60 leading-[1.6] max-w-md">
                    Outcomes — not loudness. Numbers when they measure
                    something real.
                  </p>
                </div>
              </div>
            </div>

            {/* OPERATING TIMELINE — horizontal scroll-driven journey.
                Massive Playfair numerals as stations, a continuous connector
                line passing through nodes, animated progress fill that scales
                left→right, glowing active node, and a single cross-fading
                description region below. Killing the equal-row table grid —
                this is the section's distinct visual signature. */}
            <div className="reveal-text mb-[12vh] lg:mb-[14vh]">
              <div className="flex items-center gap-6 mb-16 md:mb-20">
                <span className="w-12 h-px bg-petrol/70" />
                <p className="text-[10px] tracking-[0.36em] uppercase text-petrol font-light">
                  Days to feel it
                </p>
              </div>

              {(() => {
                const phases = [
                  {
                    days: "7–14",
                    title: "Read",
                    descriptor: "Diagnostic",
                    desc: "Root cause, leverage, sequence — visible. Not opinions, structure.",
                  },
                  {
                    days: "30",
                    title: "Move",
                    descriptor: "Intervention",
                    desc: "Less friction. A clearer line. Relief across the system.",
                  },
                  {
                    days: "60–90",
                    title: "Hold",
                    descriptor: "Stabilization",
                    desc: "Standards hold. Signal stands. Execution becomes stable.",
                  },
                ];
                return (
                  <div className="relative">
                    {/* Resonance signature — drifting waveform that runs the
                        full content width above the numerals. Single, restrained
                        motion moment that literalizes the brand's "signal not
                        loudness" line without distracting from typography. */}
                    <svg
                      aria-hidden="true"
                      className="absolute -top-14 md:-top-20 left-0 right-0 w-full h-12 md:h-16 pointer-events-none proof-signal-glow"
                      viewBox="0 0 1400 60"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,30 Q116,8 233,30 T466,30 T700,30 T933,30 T1166,30 T1400,30"
                        stroke="rgba(18,168,172,0.7)"
                        strokeWidth="0.9"
                        fill="none"
                        className="proof-signal"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d="M0,30 Q116,8 233,30 T466,30 T700,30 T933,30 T1166,30 T1400,30"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {/* Three stations — massive numerals as visual anchors */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      {phases.map((phase, idx) => {
                        const isActive = activeProofPhase === idx;
                        const isPast = activeProofPhase >= idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            aria-pressed={isActive}
                            aria-label={`Phase ${idx + 1}: ${phase.days} days — ${phase.title}`}
                            onClick={() => setActiveProofPhase(idx)}
                            onMouseEnter={() => setActiveProofPhase(idx)}
                            onFocus={() => setActiveProofPhase(idx)}
                            className="group flex flex-col items-start text-left pb-8 md:pb-12 outline-none focus-visible:outline-1 focus-visible:outline-turquoise/50 focus-visible:outline-offset-8 cursor-pointer"
                          >
                            <span
                              className={`block font-light leading-[0.78] tracking-[-0.05em] mb-5 md:mb-7 transition-colors duration-1000 whitespace-nowrap ${
                                isActive
                                  ? "text-white"
                                  : isPast
                                    ? "text-white/45"
                                    : "text-white/15"
                              }`}
                              style={{
                                fontFamily: "var(--font-playfair)",
                                fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
                              }}
                            >
                              {phase.days}
                            </span>
                            <span
                              className={`text-[10px] font-mono tracking-[0.36em] uppercase transition-colors duration-700 ${
                                isActive ? "text-turquoise" : "text-white/30"
                              }`}
                            >
                              {phase.title}
                            </span>
                            {/* Micro-descriptor — adds an information layer
                                without breaking the editorial restraint;
                                italic serif pairs with the Playfair numerals. */}
                            <span
                              className={`mt-2 text-[11px] md:text-[12px] italic font-light leading-[1.3] transition-colors duration-700 ${
                                isActive ? "text-white/55" : "text-white/22"
                              }`}
                              style={{
                                fontFamily: "var(--font-playfair)",
                              }}
                            >
                              {phase.descriptor}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Connector line passing through node centers (16.67% / 50% / 83.33%).
                        Base hairline, progress fill scales 0→1, and three nodes float on the line. */}
                    <div className="relative h-px">
                      <div className="absolute top-0 left-[16.67%] right-[16.67%] h-px bg-white/[0.10]" />
                      <div
                        className="absolute top-0 left-[16.67%] h-px bg-turquoise origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          width: "66.67%",
                          transform: `scaleX(${activeProofPhase / 2})`,
                        }}
                      />
                      {[16.67, 50, 83.33].map((pos, idx) => {
                        const isActive = activeProofPhase === idx;
                        const isPast = activeProofPhase >= idx;
                        return (
                          <span
                            key={idx}
                            aria-hidden="true"
                            className={`absolute top-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border transition-all duration-700 ${
                              isPast
                                ? "bg-turquoise border-turquoise"
                                : "bg-[#070c14] border-white/25"
                            } ${
                              isActive
                                ? "scale-125 shadow-[0_0_22px_rgba(18,168,172,0.55)]"
                                : "scale-100"
                            }`}
                            style={{ left: `${pos}%` }}
                          />
                        );
                      })}
                    </div>

                    {/* Active phase description — cross-fades between phases.
                        Fixed-height container prevents layout shift on switch. */}
                    <div className="relative mt-14 md:mt-20 h-32 md:h-28">
                      {phases.map((phase, idx) => {
                        const isActive = activeProofPhase === idx;
                        return (
                          <p
                            key={idx}
                            aria-hidden={!isActive}
                            className={`absolute inset-0 text-[clamp(1.1rem,1.4vw,1.4rem)] font-light leading-[1.55] max-w-2xl text-white/80 transition-all duration-700 ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                          >
                            {phase.desc}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Outcomes — performative editorial readings.
                The verbs ARE the shifts: subject sets the scene in sans,
                the verb drops on its own line in italic Playfair at a
                larger scale — the typographic "shift" literalizes the
                section title. Roman numeral marginalia, no bars, no glow,
                no hover decoration. A single massive italic anchor word
                floats behind the column as architecture.
                Composition does the work; restraint is the design. */}
            <div className="reveal-text relative">
              <div className="flex items-center gap-6 mb-16 md:mb-24">
                <span className="w-12 h-px bg-gold/40" />
                <p className="text-xs tracking-[0.3em] uppercase text-gold/80 font-bold">
                  What shifts
                </p>
              </div>

              {/* Architectural anchor — colossal italic "shifts." floats
                  behind the column. Sits at <4% opacity so it reads as
                  ghost material, not headline. Off-grid right alignment
                  introduces deliberate asymmetry to break the section's
                  rigid container. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[14%] right-[-6vw] z-0 select-none about-shifts-watermark"
              >
                <span
                  className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(11rem, 22vw, 26rem)",
                  }}
                >
                  shifts.
                </span>
              </div>


              {(() => {
                const shifts = [
                  {
                    subject: "Decision gridlock",
                    verb: "dissolves.",
                    context: "Clear priorities, clear ownership, fewer open loops.",
                    image: "/images/shifts/decision.png",
                  },
                  {
                    subject: "Execution becomes",
                    verb: "predictable.",
                    context: 'Projects are not "felt." They are led with SSOT, sequence, and standards.',
                    image: "/images/shifts/execution.png",
                  },
                  {
                    subject: "Visibility becomes",
                    verb: "plan-able.",
                    context: "Messaging locks in. Proof is structured. Conversion rises because trust forms faster.",
                    image: "/images/shifts/visibility.png",
                  },
                  {
                    subject: "Digital presence becomes",
                    verb: "powerful.",
                    context: "Performance, indexability, structure. Website as operating system, not brochure.",
                    image: "/images/shifts/digital.png",
                  },
                  {
                    subject: "Leadership state",
                    verb: "stabilizes.",
                    context: "More calm, more focus, better decisions — without self-loss.",
                    image: "/images/shifts/leadership.png",
                  },
                ];
                const romans = ["i", "ii", "iii", "iv", "v"];
                return (
                  <div className="relative z-10 max-w-[1400px] grid lg:grid-cols-12 gap-8 lg:gap-20">     
                    
                    {/* Left Sticky Image Column */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                      <div className="sticky top-[15vh] w-[80%] mx-auto aspect-square flex items-center justify-center pointer-events-none">
                        <ShiftCanvas activeIndex={activeShiftIndex} />
                      </div>
                    </div>

                    {/* Right Scrolling List */}
                    <div className="lg:col-span-7 pb-[15vh]">
                      {shifts.map((item, idx) => {
                        const isActive = activeShiftIndex === idx;
                        return (
                          <article
                            key={idx}
                            data-shift-index={idx}
                            className={`shift-article group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start py-16 lg:py-24 border-t border-white/[0.08] transition-all duration-700 cursor-default ${
                              isActive ? "opacity-100" : "opacity-30 hover:opacity-50"
                            }`}
                          >
                            {/* Interactive sliding line indicator */}
                            <div 
                              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-turquoise/40 to-transparent transition-transform duration-1000 origin-left" 
                              style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                            />

                            {/* Marginalia */}
                            <div className={`lg:col-span-1 pt-2 lg:pt-[0.6em] transition-transform duration-700 ${isActive ? "translate-x-2" : "translate-x-0"}`}>
                              <span
                                className={`block italic text-lg transition-colors duration-500 leading-none ${isActive ? "text-turquoise" : "text-white/30"}`}
                                style={{ fontFamily: "var(--font-playfair)" }}
                              >
                                {romans[idx]}.
                              </span>
                            </div>

                            {/* Statement */}
                            <div className={`lg:col-span-11 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "translate-x-4" : "translate-x-0"}`}>
                              <h4 className="font-light text-white mb-6">
                                <span className={`block text-3xl lg:text-[2.5rem] leading-[1.1] tracking-[-0.02em] transition-colors duration-500 ${isActive ? "text-white" : "text-white/60"}`}>
                                  {item.subject}
                                </span>
                                <span className={`block italic text-5xl lg:text-[4.5rem] leading-[1.0] tracking-[-0.035em] mt-3 lg:mt-4 transition-colors duration-500 ${isActive ? "text-turquoise" : "text-white/40"}`}
                                  style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                  {item.verb}
                                </span>
                              </h4>

                              {/* Context */}
                              <div className="max-w-md pt-4">
                                <p className="text-lg lg:text-xl font-light leading-[1.6] text-white/50 transition-colors duration-500 group-hover:text-white/80">
                                  {item.context}
                                </p>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
            
          </div>
        </section>

        {/* MINI CASES — editorial proof sequence.
            Restructure: section header + table-of-contents index at the top,
            then each case as a dense editorial spread with marginalia (roman
            numeral + italic Playfair audience tag) in the left rail and the
            three-phase narrative tight against the title. Ghost-numeral
            trope killed; alternating L/R killed; magazine-spread density
            in. Reads like a manuscript, not a generic AI portfolio. */}
        {(() => {
          // `mark` paths are wired but kept null until images are generated.
          // Drop generated PNGs at the noted paths and replace null → string
          // to activate the case mark in the marginalia rail.
          const cases: Array<{
            tag: string;
            title: string;
            before: string;
            intervention: string;
            after: string;
            mark: string | null;
            pull: string;
          }> = [
            {
              tag: "CEO / Founder / Entrepreneur",
              title: "Case 1 — Too many moving parts",
              before:
                "Everything matters, nothing is ordered. Decisions are heavy. Team pressure rises.",
              intervention:
                "SolutionFinder → root cause visible → sequence + SSOT → execution standard.",
              after:
                "Fewer open loops, a clear line, noticeably more calm. Decision-making becomes light again.",
              mark: "/about/case-mark-i.webp",
              pull: "Decision-making becomes light again.",
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
              mark: "/about/case-mark-ii.webp",
              pull: "Trust forms faster. Demand becomes predictable.",
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
              mark: "/about/case-mark-iii.webp",
              pull: "Website becomes a growth engine.",
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
              mark: "/about/case-mark-iv.webp",
              pull: "Stronger impact — without drama.",
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
              mark: "/about/case-mark-v.webp",
              pull: "Structure stands. Less stress, more safety.",
            },
          ];
          const romans = ["i", "ii", "iii", "iv", "v"];
          return (
            <>
              {/* Header + Editorial Index. The TOC replaces the lone
                  "You will know one." floating page — readers now see the
                  full table of contents and can jump to any case. */}
              <section
                data-journey="cases"
                className="about-atmosphere bg-[#070c14] relative pt-[14vh] lg:pt-[18vh] pb-[8vh] lg:pb-[10vh] px-gutter overflow-hidden"
              >
                {/* Architectural anchor — colossal italic "mirrors." floats
                    behind the header. Same restraint as the "shifts." anchor
                    in What Shifts: <4% opacity, off-grid right-aligned, gives
                    the section its own ghost-material signature without
                    competing with the headline. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[12%] right-[-7vw] z-0 select-none"
                >
                  <span
                    className="block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(11rem, 22vw, 26rem)",
                    }}
                  >
                    mirrors.
                  </span>
                </div>
                <div className="reveal-text max-w-[1400px] mx-auto relative z-10">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-px bg-gold/40" />
                    <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-bold">
Mini Case Stories                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 lg:mb-20">
                    <div className="lg:col-span-7">
                      <h3
                        className="text-white font-light leading-[0.98] tracking-[-0.032em]"
                        style={{
                          fontSize:
                            "calc(clamp(2.4rem, 4.6vw, 4.8rem) * var(--heading-scale))",
                        }}
                      >
                        You will know
                        {/* Typographic cascade — indented italic continuation
                            performs the "one of them" as a drop, not a flat
                            second line. */}
                        <span className="block italic text-white/55 font-light lg:pl-[10%]">
                          one of them.
                        </span>
                      </h3>
                    </div>
                    <div className="lg:col-span-4 lg:col-start-9 lg:pl-10 lg:border-l border-silver/15">
                      <p
                        className="italic font-light text-silver/65 leading-[1.55]"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "clamp(1rem, 1.2vw, 1.2rem)",
                        }}
                      >
                        Five short readings — not case studies dressed up
                        as proof. Each is a mirror.
                      </p>
                    </div>
                  </div>

                  {/* True Awwwards-Winning Editorial Carousel */}
                  <div className="w-full flex items-stretch justify-center gap-4 md:gap-8 mt-16 mb-12 h-full">
                    
                    {/* Left Navigation Pill */}
                    <button
                      onClick={() => setActiveCaseIndex((prev) => (prev === 0 ? cases.length - 1 : prev - 1))}
                      className="group w-12 md:w-16 h-auto min-h-[300px] border border-white/10 rounded-full flex flex-col items-center justify-center hover:bg-white/[0.03] hover:border-white/30 transition-all duration-500 focus-visible:outline-1 focus-visible:outline-turquoise"
                      aria-label="Previous Case"
                    >
                      <span className="text-white/40 text-2xl font-light group-hover:text-white group-hover:-translate-x-1 transition-all duration-500">←</span>
                    </button>

                    {/* Main Content Glass Card */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/10 relative bg-white/[0.02] backdrop-blur-2xl">
                      
                      {/* Subtle Internal Ambient Glow */}
                      <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-turquoise/5 via-transparent to-transparent pointer-events-none" />

                      {/* Left Column - Image & Meta (Editorial Profile) */}
                      <div className="md:col-span-5 lg:col-span-4 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10">
                        <div className="flex-1 flex items-center justify-center md:justify-start mb-8 md:mb-0">
                          {cases[activeCaseIndex].mark ? (
                            <div className="relative w-full max-w-[220px] aspect-square opacity-90 drop-shadow-lg mix-blend-screen transition-all duration-700">
                              <Image 
                                src={cases[activeCaseIndex].mark!} 
                                alt={cases[activeCaseIndex].title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                              <span className="text-white/20 font-playfair italic text-2xl">{romans[activeCaseIndex]}.</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-auto">
                          <p className="text-white font-sans text-xl font-light tracking-wide">
                            {cases[activeCaseIndex].title.split(" — ")[1]}
                          </p>
                          <p className="text-turquoise/80 text-xs font-mono uppercase tracking-[0.2em]">
                            {cases[activeCaseIndex].tag}
                          </p>
                        </div>
                      </div>

                      {/* Right Column - The Story / Pull Quote */}
                      <div className="md:col-span-7 lg:col-span-8 p-8 md:p-16 lg:p-20 flex items-center relative z-10">
                        <div className="relative">
                          {/* Elegant editorial quote mark */}
                          <span className="absolute -top-12 -left-8 text-white/10 font-playfair text-[8rem] leading-none select-none pointer-events-none">"</span>
                          
                          <p className="font-playfair text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.7] text-white/60 relative z-10">
                            <span className="text-white/90">"{cases[activeCaseIndex].before} </span>
                            <span className="text-turquoise italic">{cases[activeCaseIndex].intervention} </span>
                            <span className="text-white/90">{cases[activeCaseIndex].after}"</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Navigation Pill */}
                    <button
                      onClick={() => setActiveCaseIndex((prev) => (prev === cases.length - 1 ? 0 : prev + 1))}
                      className="group w-12 md:w-16 h-auto min-h-[300px] border border-white/10 rounded-full flex flex-col items-center justify-center hover:bg-white/[0.03] hover:border-white/30 transition-all duration-500 focus-visible:outline-1 focus-visible:outline-turquoise"
                      aria-label="Next Case"
                    >
                      <span className="text-white/40 text-2xl font-light group-hover:text-white group-hover:translate-x-1 transition-all duration-500">→</span>
                    </button>

                  </div>
                </div>
              </section>

              {/* Case spreads — manuscript layout: marginalia rail
                  (roman + tag) on the left, dense title+body in the
                  right column. No ghost numerals, no alternating
                  flip-flop, no turquoise eyebrow rules. Hairline
                  divider between cases is the only separator. */}
                  {/* [REMOVED] Original list format is gone. Replaced by the carousel above. */}
              
            </>
          );
        })()}

        {/* -----------------------------------------------------------------
            RADICAL & PRACTICAL SECTION (As per screenshot design)
            ----------------------------------------------------------------- */}
        <section className="about-atmosphere bg-[#070c14] relative px-gutter py-[12vh] lg:py-[18vh]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Side: Radical & Practical */}
            <div className="lg:col-span-7">
              <h2 className="text-white leading-[0.95] tracking-tight mb-8 md:mb-12">
                <span className="block font-light text-[clamp(2.8rem,4.5vw,4.8rem)]">We believe in something</span>
                <span className="block font-light text-[clamp(2.8rem,4.5vw,4.8rem)]">radical —</span>
                <span className="block italic text-turquoise font-light mt-2 text-[clamp(3.2rem,5vw,5.2rem)] tracking-tight">and practical:</span>
              </h2>
              
              <p className="text-silver/60 font-light text-[clamp(1.1rem,1.3vw,1.25rem)] leading-[1.6] max-w-[48ch] mb-16 lg:mb-20">
                When structure becomes visible, the right solution becomes inevitable. Not "someday." Not "when there's time."
              </p>

              {/* Numbered Points (Only inner dividers, no outer borders) */}
              <div className="flex flex-col mt-12">
                {[
                  "But in a way that lets a CEO breathe again.",
                  "In a way that helps founders know what comes first.",
                  "In a way that lets teams deliver with focus — and systems carry instead of pull."
                ].map((text, i, arr) => (
                  <div key={i} className={`flex items-center gap-8 py-6 group ${i !== arr.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                    <span className="text-[#c09e50] font-mono text-[11px] tracking-[0.2em] font-bold">0{i + 1}</span>
                    <span className="text-silver/60 font-light text-[clamp(0.95rem,1.1vw,1.1rem)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Solved means solved */}
            <div className="lg:col-span-5 lg:pl-16 lg:border-l border-white/[0.06] pt-4 lg:pt-0">
              <div className="flex flex-col mb-10 md:mb-12">
                <span className="text-silver/50 font-extralight leading-[0.9] tracking-tight text-[clamp(4rem,6vw,6.5rem)]">Solved</span>
                <span className="text-silver/30 font-light leading-none text-xl md:text-2xl mt-5 mb-3">means</span>
                <span className="text-white font-black leading-[0.85] tracking-tighter text-[clamp(4.5rem,7vw,8rem)]">solved.</span>
              </div>

              {/* Faint turquoise gradient divider */}
              <div className="w-full max-w-[85%] h-[1px] bg-gradient-to-r from-turquoise/30 via-turquoise/10 to-transparent mb-10" />

              <div className="flex flex-col gap-8 pr-4">
                <p className="text-silver/60 font-light text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6]">
                  "Solved" means you feel it on Monday morning, not in a pitch.
                </p>
                <p className="text-silver/40 font-light text-[clamp(0.95rem,1.1vw,1.05rem)] leading-[1.6]">
                  Less friction. Clearer decisions. Higher speed. More calm in the system.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ECOSYSTEM — distinct frequencies, one orchestration */}
        <section
          data-journey="depth"
          className="about-atmosphere pt-[14vh] pb-[18vh] px-gutter relative bg-[#070c14] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute left-[8vw] top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-turquoise/20 to-transparent"
          />
          <div className="max-w-[1400px] mx-auto">
            <div className="reveal-text grid lg:grid-cols-12 gap-10 lg:gap-20 mb-[10vh]">
              <div className="lg:col-span-7">
                <p className="text-[10px] tracking-[0.42em] uppercase text-turquoise/75 mb-8">
                  The orchestra
                </p>
                <h2
                  className="font-light text-white leading-[0.98] tracking-[-0.035em]"
                  style={{
                    fontSize:
                      "calc(clamp(3rem, 7vw, 7.5rem) * var(--heading-scale))",
                  }}
                >
                  Different frequencies.
                  <span className="block italic text-white/45">
                    One coherent sound.
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 flex items-end">
                <p className="text-lg md:text-xl text-white/55 font-light leading-[1.65]">
                  Each business area creates a distinct inner state. Together,
                  they move people from uncertainty toward trust and action.
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.08] relative">
              {/* Image Reveal Cursor Block */}
              <div
                ref={ecoCursorRef}
                className="fixed top-0 left-0 w-[24vw] aspect-[4/3] pointer-events-none z-50 rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 transition-all duration-500 ease-out will-change-transform shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10"
                style={{
                  opacity: hoveredEcoIndex !== null ? 1 : 0,
                  transform: hoveredEcoIndex !== null ? "scale(1)" : "scale(0.95)",
                  visibility: hoveredEcoIndex !== null ? "visible" : "hidden",
                }}
              >
                {ECOSYSTEM_FREQUENCIES.map((eco, index) => (
                  <img
                    key={`img-${index}`}
                    src={eco.image}
                    alt={eco.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{
                      opacity: hoveredEcoIndex === index ? 1 : 0,
                    }}
                  />
                ))}
              </div>

              {ECOSYSTEM_FREQUENCIES.map((eco, index) => {
                const isHovered = hoveredEcoIndex === index;
                const isSiblingHovered = hoveredEcoIndex !== null && hoveredEcoIndex !== index;
                
                return (
                  <article
                    key={eco.name}
                    onMouseEnter={(e) => {
                      setHoveredEcoIndex(index);
                      if (ecoCursorRef.current) {
                        // Instantly snap to mouse position to prevent top-left corner flash on scroll-hover
                        gsap.set(ecoCursorRef.current, {
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredEcoIndex(null)}
                    className={`reveal-text group relative grid grid-cols-[3rem_1fr] md:grid-cols-12 gap-x-4 md:gap-x-8 py-7 md:py-9 border-b cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      isHovered ? "border-white/20" : "border-white/[0.07]"
                    } ${isSiblingHovered ? "opacity-20 grayscale" : "opacity-100"}`}
                  >
                    <span className={`md:col-span-1 font-mono text-[10px] tracking-[0.25em] pt-2 transition-colors duration-500 relative z-20 mix-blend-difference ${isHovered ? "text-white/60" : "text-white/25"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 
                      className={`md:col-span-5 text-[clamp(1.5rem,2.6vw,2.8rem)] leading-[1.05] tracking-[-0.025em] font-light relative z-20 mix-blend-difference transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                        isHovered ? "text-white translate-x-4" : "text-white/90 translate-x-0"
                      }`}
                    >
                      {eco.name}
                    </h3>
                    <p
                      className={`col-start-2 md:col-start-auto md:col-span-2 mt-3 md:mt-2 text-[10px] uppercase transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] relative z-20 mix-blend-difference ${FREQUENCY_TONE_CLASSES[eco.tone]} ${
                        isHovered ? "tracking-[0.5em] font-medium" : "tracking-[0.3em]"
                      }`}
                    >
                      {eco.frequency}
                    </p>
                    <p 
                      className={`col-start-2 md:col-start-auto md:col-span-4 mt-3 md:mt-1 text-base md:text-lg font-light leading-[1.55] relative z-20 mix-blend-difference transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                        isHovered ? "text-white/95 translate-x-2" : "text-white/70 translate-x-0"
                      }`}
                    >
                      {eco.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* THE PATRON OF GOTT WALD */}
        <section
          data-journey="patron"
          className="patron-section about-atmosphere py-[16vh] lg:py-[20vh] px-gutter relative flex items-center justify-center bg-[#070c14] border-y border-white/[0.04] overflow-hidden"
        >
          {/* Craft anchor — drafting compass on blueprint. Literalizes the
              PATRON as the careful drafter of the framework. Sits as
              a tall portrait-format presence on the right edge. */}
          <div
            aria-hidden="true"
            className="about-visual about-visual--portrait pointer-events-none hidden lg:block absolute right-0 top-0 bottom-0 w-[32vw] max-w-[520px] z-0 overflow-hidden"
          >
            <Image
              src="/about/patron-craft.webp"
              alt=""
              fill
              sizes="32vw"
              className="patron-craft-img about-visual-image object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#070c14]/40 to-[#070c14] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070c14]/45 via-transparent to-[#070c14]/65 z-10 pointer-events-none" />
          </div>

          <div className="max-w-[1400px] mx-auto text-center relative z-10 space-y-24">
            <div className="reveal-text space-y-8">
              <h2 className="text-[clamp(3rem,6vw,6rem)] font-light leading-[1.1] uppercase tracking-tighter">
                THE PATRON <br />
                <span className="font-mono text-turquoise/80 block text-[clamp(1.4rem,2.4vw,2.6rem)] uppercase tracking-[0.35em] mt-4">
                  of gott wald
                </span>
              </h2>
              <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
                In the fabric of GOTT WALD, the PATRON is not the &quot;single
                maker&quot; — and not the lone specialist. The PATRON is the
                protective framework.
              </p>
            </div>

            <div className="reveal-text grid grid-cols-1 md:grid-cols-2 text-left border-y border-white/[0.09] py-12 md:py-16 mx-auto w-full relative">
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
                      <span className="font-semibold uppercase tracking-[0.04em] text-2xl md:text-3xl text-white group-hover:text-turquoise transition-colors duration-500">
                        {val.core}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] font-light text-white group-hover:text-white transition-colors duration-500">
                        {val.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-l border-turquoise/40 pl-6 py-2">
                  <p className="text-lg font-light text-white/90">
                    This is not a slogan.
                    <strong className="block font-normal text-turquoise mt-1">This is lived reality.</strong>
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

                <div className="relative py-10 lg:py-14 border-y border-turquoise/25 overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-white/95 font-light leading-[1.25] text-2xl md:text-4xl tracking-tight mb-10">
                      &quot;Nothing here is performed, <br className="hidden lg:block"/>
                      <span className="text-turquoise/85">everything here is held.&quot;</span>
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
        <section
          data-journey="decision"
          className="cta-section about-atmosphere min-h-[78svh] py-[14vh] px-gutter relative flex items-center justify-center bg-[#070c14] overflow-hidden"
        >
          <div className="relative z-10 text-center flex flex-col items-center max-w-4xl space-y-16">
            <div className="cta-reveal">
              <p className="text-lg tracking-[0.3em] uppercase text-white/90 font-bold mb-6">
                For whom
              </p>
              <h3 className="text-3xl md:text-5xl font-light leading-[1.3] text-white/90">
                For CEOs, founders, executives, and SMEs who don&apos;t want to
                &quot;do more&quot; — but to do the right thing, the right way.
              </h3>
            </div>

            <p className="cta-reveal text-2xl font-light tracking-[0.04em] uppercase text-white/80">
              If you want it cleanly solved — we are.
            </p>

            <div className="cta-reveal pt-8 pb-4">
              <button
                onClick={handleStrategicClick}
                translate="no"
                className="magnetic-cta notranslate group relative cursor-pointer px-9 md:px-12 py-5 md:py-6 overflow-hidden border border-turquoise/35 hover:border-turquoise/80 transition-colors duration-700"
              >
                {/* Sweep animation background */}
                <div className="absolute inset-0 bg-turquoise translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                {/* Button text — terse editorial CTA, no SaaS jargon. */}
                <span className="relative z-10 text-[12px] md:text-sm tracking-[0.22em] uppercase font-bold text-turquoise group-hover:text-[#030303] transition-colors duration-500">
                  {t("ctas.strategicConversation")}
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
        nextTitle={tNav("partnerships")}
        nextHref="/partnerships"
        prevHref="/"
      />
    </div>
  );
}
