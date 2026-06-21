"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";
import Honeypot from "@/components/Honeypot";
import CareersCanvas from "./_components/CareersCanvas";
import { usePageColorShift } from "@/lib/usePageColorShift";

gsap.registerPlugin(ScrollTrigger);


const PILLARS = [
  {
    letter: "A",
    title: "GOTT WALD Holding / Corporate Services",
    roles: [
      "CFO Office / Finance Manager / Controller / FP&A Analyst",
      "Accounting & Operations Accounting",
      "Legal & Contracts Manager",
      "Tax Coordination / Structuring Support",
      "PMO / Operations / Quality Management",
      "Executive Assistant / Office Management",
    ],
    impact: "precise, discreet, process-driven, 'no drama'",
  },
  {
    letter: "B",
    title: "SOLUTIONFINDER / SOLUTION MANAGEMENT",
    roles: [
      "Solution Manager / Delivery Lead",
      "Senior Project Manager / Program Manager / PMO Lead",
      "Business Analyst / Requirements Engineer",
      "Process Designer / Operating Model Specialist",
      "Change & Adoption Lead / Enablement",
      "Technical Writer / Documentation Excellence",
    ],
    impact: "systems thinker, stakeholder-strong, structured, excellent handovers",
  },
  {
    letter: "C",
    title: "CONSULTING",
    roles: [
      "Strategy Consultant / Senior Consultant",
      "Org & Performance Consultant",
      "Growth / Go-to-Market Consultant",
      "Complexity / Turnaround",
      "Executive Advisor / C-level sparring",
    ],
    impact: "clear, analytical, decisive, premium communication",
  },
  {
    letter: "D",
    title: "COACHING & MENTORING",
    roles: [
      "Executive Coach",
      "Facilitator",
      "Performance Coach",
      "Program Designer",
      "Client Experience / Program Operations",
    ],
    impact: "present, calm, discreet — effectiveness over show",
  },
  {
    letter: "E",
    title: "RELOCATION / STRUCTURE DEPLOYMENT (Georgia Hub)",
    roles: [
      "Relocation Manager / Client Onboarding Lead",
      "Operations Coordinator",
      "Legal/Immigration Coordinator",
      "Tax Coordination Associate",
      "Client Concierge",
    ],
    impact: "reliable, structured, service-excellent, solution-driven",
  },
  {
    letter: "F",
    title: "IT SOLUTIONS 2030 (Web / Apps / AI / Automation)",
    roles: [
      "Tech Lead / Full-Stack Engineer (web)",
      "Frontend Engineer (Next.js/SSR, performance, SEO/geo)",
      "Backend Engineer (APIs, DB design, integrations)",
      "DevOps / Cloud Engineer (CI/CD, monitoring, hardening)",
      "Security Specialist (pen-testing, risk, policies)",
      "AI / Automation Engineer (agents, workflows, pipelines)",
      "UX/UI Designer / Product Designer",
      "QA / Release Manager",
    ],
    impact: "performance-obsessed, clean, security-aware, documentation-strong",
  },
  {
    letter: "G",
    title: "MARKETING & COMMUNICATION",
    roles: [
      "Brand Strategist / Creative Director",
      "Copywriter / Editor",
      "Content Producer (video, reels, YouTube, motion)",
      "Performance Marketer (funnels, CRO, paid, retargeting)",
      "PR / Partnerships",
      "Social Media Ops",
    ],
    impact: "quietly powerful, measurably effective, no empty hype",
  },
  {
    letter: "H",
    title: "YIG.CARE (Platform / Ecosystem)",
    roles: [
      "Product Manager / Platform Lead",
      "Partner Onboarding & Quality Manager",
      "Customer Success / Partner Success",
      "Compliance & Privacy",
      "Content & Education Lead",
      "Operations Manager",
    ],
    impact: "service-excellent, quality-driven, process-clean, human-clear",
  },
  {
    letter: "I",
    title: "PLHH (Coin / Community / Real-World Impact)",
    roles: [
      "Community Lead / Community Care",
      "Partnerships & Ecosystem Builder",
      "Governance / DAO Operations",
      "Blockchain Engineer (Sui) / Smart Contract Engineer",
      "Security & Trust",
      "Impact Operations",
    ],
    impact: "responsible, transparent, security-conscious, people-first",
  },
];

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

function MagneticButton({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-10 transition-all duration-500 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(184,192,204,0.06)] stagger-item ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(184,192,204,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">{children}</div>
    </div>
  );
}

export default function CareersClient() {
  const t = useTranslations("careers.hero");
  const tCtas = useTranslations("careers.ctas");
  const tNav = useTranslations("nav");
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const [openPillar, setOpenPillar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Careers page shifts the GlobalCanvas to Turquoise
  usePageColorShift("#0f8b8d");



  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData(formRef.current);
      formData.append("type", "careers");

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
      console.error("Careers form submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let parallaxHandler: ((e: MouseEvent) => void) | null = null;
    const ctx = gsap.context(() => {
      // WeakSet guards against re-firing: Google Translate mutates text nodes
      // when the user switches language, which can trigger ScrollTrigger
      // re-evaluation and re-run `onEnter` for elements already animated,
      // snapping them back to opacity: 0 and causing a flicker.
      const animated = new WeakSet<Element>();
      ScrollTrigger.batch(".reveal-text", {
        start: "top 85%",
        onEnter: (batch) => {
          const fresh = batch.filter((el) => !animated.has(el));
          if (fresh.length === 0) return;
          fresh.forEach((el) => animated.add(el));
          gsap.fromTo(
            fresh,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.1,
              force3D: true,
            }
          );
        },
      });

      const staggerGroups = gsap.utils.toArray(
        ".stagger-group",
        pageRef.current!,
      ) as HTMLElement[];
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll(".stagger-item");
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // #5 — Hero breathing pulse
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 1.008,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "left center",
        });
      }

      // #9 — Animated separator line
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

      // #10 — Scroll-fill Typography
      gsap.to(".scroll-fill-text", {
        backgroundPosition: "0% 0",
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-fill-text",
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
        }
      });

      // Eyebrow reveal
      gsap.fromTo(
        ".careers-eyebrow",
        { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.3,
        },
      );
      // 11. Awwwards Premium Mouse Parallax for Background Elements
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reducedMotion) {
        parallaxHandler = (e: MouseEvent) => {
          const px = (e.clientX / window.innerWidth - 0.5);
          const py = (e.clientY / window.innerHeight - 0.5);
          
          gsap.to(".about-parallax-target", {
            x: px * 160,
            y: py * 160,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto"
          });
          
          gsap.to(".about-liquid-aurora", {
            x: px * -250,
            y: py * -250,
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
      if (parallaxHandler) window.removeEventListener("mousemove", parallaxHandler);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black relative bg-[#050505]"
    >

      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        <section className="relative h-[100svh] w-full overflow-hidden flex items-end justify-center bg-[#070c14]">

          {/* ── INTERACTIVE CANVAS BACKGROUND ── */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <CareersCanvas />
            
            {/* Subtle gradients to blend into the UI without obscuring the canvas */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070c14]/90" />
            <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#070c14] to-transparent" />
          </div>



          {/* AWWWARDS Ghost echo — massive italic "careers." floats behind the headline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[20%] right-[-5vw] z-20 select-none opacity-50"
          >
            <span
              className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(12rem, 24vw, 30rem)",
              }}
            >
              careers.
            </span>
          </div>

          {/* ── CONTENT — Original Layout over Mountain Background ── */}
          <div className="relative z-30 w-full max-w-7xl mx-auto px-gutter pb-[15vh]">
            
            {/* Signature phrase — The Standard motif */}
            <div className="flex items-center gap-3 mb-8 opacity-80 reveal-text">
              <div className="inline-flex items-center gap-4 opacity-80">
                <div className="w-8 h-[1px] bg-[#0f8b8d]" />
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
                  JOIN THE PEOPLE WHO HOLD THE STANDARD
                </span>
              </div>
            </div>

            {/* Hero headline — left aligned */}
              <h1
              ref={heroRef}
              translate="no"
              className="notranslate reveal-text leading-[0.85] font-light tracking-[-0.015em] mb-16 uppercase text-white/90"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "calc(clamp(3.5rem, 7vw, 9rem) * var(--heading-scale))",
              }}
            >
              {t("line1")} <br />
              {t("line2")}
            </h1>

            <div className="flex flex-col md:flex-row gap-16 md:gap-24">
              <div className="flex-1 flex flex-col gap-8 text-white font-light leading-relaxed tracking-wide reveal-text">
                <p className="text-2xl md:text-3xl font-medium tracking-tight">
                  We recruit intentionally worldwide — <br className="hidden md:block"/>and we mean it.
                </p>
                <div className="text-white/70 max-w-md text-lg space-y-6">
                  <p>
                    GOTT WALD is a human family: different cultures, traditions, languages, life paths — wanted. Because diversity increases our intelligence. 
                  </p>
                  <p className="text-white/50 text-base">
                    Our axis of impact: NATURE — ANIMALS — HUMANS.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-start gap-10 justify-center reveal-text">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#apply"
                    translate="no"
                    className="notranslate h-14 rounded-full bg-white text-black flex items-center justify-center px-10 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(192,120,64,0.15)] transition-all duration-300 uppercase text-xs tracking-[0.2em] font-bold"
                  >
                    {tCtas("applyNow")}
                  </a>
                  <a
                    href="#apply"
                    translate="no"
                    className="notranslate h-14 rounded-full border border-white/20 text-white flex items-center justify-center px-10 hover:bg-white/10 hover:border-silver/40 hover:shadow-[0_0_20px_rgba(184,192,204,0.1)] transition-all duration-300 uppercase text-xs tracking-[0.2em] font-bold"
                  >
                    {tCtas("specialistPool")}
                  </a>
                </div>

                {/* Hero metadata */}
                <div className="flex gap-5 items-center pl-2">
                  <div className="w-px h-14 bg-white/20" />
                  <div className="flex flex-col gap-2">
                    <span className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-bold">
                      Global-first. Remote-friendly. Confidential.
                    </span>
                    <span className="text-copper text-[10px] tracking-[0.25em] uppercase font-bold">
                      HQ: Georgia.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* #9 — Animated Separator */}
        <div className="px-gutter mb-4">
          <div
            ref={separatorRef}
            className="h-px w-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(184,192,204,0.4) 0%, rgba(192,120,64,0.3) 50%, rgba(184,192,204,0.1) 100%)",
            }}
          />
        </div>

        {/* ── 3 WAYS TO JOIN ── */}
        <section className="px-gutter py-[15vh] bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal-text">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
                3 WAYS TO JOIN
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-group">
              <SpotlightCard className="group backdrop-blur-md">
                <div className="text-md tracking-[0.2em] uppercase text-white/60 mb-6 font-bold transition-colors group-hover:text-silver">
                  Path 01
                </div>
                <h3 className="text-2xl font-bold mb-4">Employee</h3>
                <p className="text-white/80 font-light leading-relaxed text-lg">
                  For people who want to build long-term and carry responsibility.
                </p>
              </SpotlightCard>

              <SpotlightCard className="group backdrop-blur-md">
                <div className="text-md tracking-[0.2em] uppercase text-white/60 mb-6 font-bold transition-colors group-hover:text-silver">
                  Path 02
                </div>
                <h3 className="text-2xl font-bold mb-4">Freelancer / Interim</h3>
                <p className="text-white/80 font-light leading-relaxed text-lg">
                  For professionals who deliver at a high level for defined scopes — clean standards, clear ownership.
                </p>
              </SpotlightCard>

              <SpotlightCard className="group backdrop-blur-md">
                <div className="text-md tracking-[0.2em] uppercase text-copper/80 mb-6 font-bold transition-colors group-hover:text-copper">
                  Path 03
                </div>
                <h3 className="text-2xl font-bold mb-4">Specialist Pool</h3>
                <p className="text-white/80 font-light leading-relaxed text-lg">
                  For selected experts we activate on demand (project-based, NDA-ready).
                </p>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ── WHO WE'RE LOOKING FOR ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5 relative overflow-hidden bg-[#050505]">
          
          {/* AWWWARDS Ghost Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[30%] left-[-5vw] z-0 select-none opacity-40 mix-blend-overlay"
          >
            <span
              className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(8rem, 20vw, 24rem)",
              }}
            >
              culture.
            </span>
          </div>

          {/* AWWWARDS Premium Liquid Aurora Background (Copper & Silver) */}
          {/* Opacity drastically reduced to prevent radioactive glow */}
          <div className="about-liquid-aurora absolute top-[20%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.06] blur-[120px] z-0 will-change-transform pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#c07840] via-transparent to-[#b8c0cc] rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#b8c0cc] to-[#c07840] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
            <div className="flex-1">
              <h2 
                className="font-black tracking-tighter leading-none uppercase mb-8"
                style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
              >
                <span className="block text-white opacity-95 drop-shadow-2xl">WHO WE&apos;RE</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.2)" }}>
                  LOOKING FOR
                </span>
              </h2>
              <p className="text-white/80 italic text-lg border-l border-copper pl-6 mt-12">
                &quot;If this feels &apos;normal&apos; to you, you&apos;re
                probably in the right room.&quot;
              </p>
            </div>

            {/* Turquoise bullets (#6) */}
            <div className="flex-1 border border-white/10 p-10 md:p-16 bg-white/[0.02] stagger-group">
              <ul className="flex flex-col gap-6 text-lg md:text-xl font-light text-white/80 tracking-wide">
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  think in outcomes (not tasks)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  communicate cleanly (no fog, no ego)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  document properly (transferable, auditable)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  keep quality under pressure
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  live discretion as a reflex
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-6 h-px bg-silver/40 shrink-0" />
                  can be different — without losing foundation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ROLES BY PILLAR (ACCORDION) ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5 bg-[#030508] relative overflow-hidden">
          {/* AWWWARDS Premium Liquid Aurora Background (Copper & Silver) */}
          <div className="about-liquid-aurora absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[70vw] md:h-[70vw] max-w-[1200px] max-h-[1200px] rounded-full mix-blend-screen opacity-[0.05] blur-[120px] z-0 will-change-transform pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#c07840] via-[#b8c0cc] to-transparent rounded-full animate-[spin_18s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#b8c0cc] to-[#c07840] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-16 items-start">
            {/* Left Column: Title */}
            <div className="reveal-text sticky top-[20vh]">
              <div className="inline-flex items-center gap-4 opacity-80 mb-8">
                <div className="w-8 h-[1px] bg-copper" />
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
                  Architecture
                </span>
              </div>
              <h2 
                className="font-black tracking-tighter uppercase flex flex-col relative isolate"
                style={{ fontSize: "clamp(4.5rem, 8vw, 8rem)" }}
              >
                <div className="relative z-[20] leading-[0.85] text-white opacity-95 drop-shadow-2xl">ROLES BY</div>
                <div className="relative z-[10] leading-[0.85] text-transparent -mt-2" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}>PILLAR</div>
              </h2>
              <p className="mt-8 text-white/60 font-light text-xl max-w-md" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                We structure our ecosystem across five distinct pillars. Find where your expertise creates the most impact.
              </p>
            </div>

            {/* Right Column: Glassmorphic Accordion */}
            <div className="flex flex-col gap-4 stagger-group w-full max-w-[850px] ml-auto">
              {PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className={`stagger-item rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    openPillar === i
                      ? "border-copper/40 bg-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                      : "border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenPillar(openPillar === i ? null : i)
                    }
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none group/btn relative"
                  >
                    {/* Active left indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-copper transition-transform duration-500 origin-left ${openPillar === i ? "scale-x-100" : "scale-x-0 group-hover/btn:scale-x-100 group-hover/btn:bg-white/20"}`} />
                    
                    <div className="flex items-center gap-6 md:gap-10 pr-4 flex-1">
                      <span className={`text-2xl md:text-4xl font-light transition-colors duration-500 w-8 md:w-12 shrink-0 ${openPillar === i ? "text-copper" : "text-white/20 group-hover/btn:text-white/60"}`}>
                        {pillar.letter}
                      </span>
                      <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 leading-tight ${openPillar === i ? "text-white" : "text-white/70 group-hover/btn:text-white"}`}>
                        {pillar.title}
                      </h3>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0
                       ${openPillar === i ? "border-copper bg-copper text-black shadow-[0_0_15px_rgba(192,120,64,0.4)] -rotate-180" : "border-white/10 text-white/50 group-hover/btn:border-white/30 group-hover/btn:text-white"}
                     `}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path
                          d={
                            openPillar === i ? "M1 7h12" : "M7 1v12M1 7h12"
                          }
                        />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openPillar === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      >
                        <div className="p-6 pt-0 md:p-8 md:pt-0 flex flex-col md:flex-row gap-10 md:pl-[6.5rem]">
                          <div className="flex-1">
                            <h4 className="text-xs tracking-[0.2em] text-copper uppercase mb-5 font-bold">
                              Role Profiles
                            </h4>
                            <ul className="flex flex-col gap-4 font-light text-white/70">
                              {pillar.roles.map((role, idx) => (
                                <motion.li 
                                  key={idx} 
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -10, opacity: 0 }}
                                  transition={{ delay: 0.05 + (idx * 0.03), duration: 0.4 }}
                                  className="flex items-center gap-4"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-copper/50 shadow-[0_0_8px_rgba(192,120,64,0.6)] shrink-0" />
                                  <span className="text-lg">{role}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="w-full md:w-[45%] p-6 md:p-8 bg-black/40 border border-white/5 rounded-xl h-fit relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 blur-[40px] rounded-full pointer-events-none" />
                            <h4 className="text-xs tracking-[0.2em] text-copper/80 uppercase mb-4 font-bold relative z-10">
                              Impact Profile
                            </h4>
                            <p className="text-white/90 text-lg font-light leading-relaxed relative z-10" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                              &quot;{pillar.impact}&quot;
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS & WHAT YOU'LL FIND ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5 relative overflow-hidden bg-[#050505]">
          
          {/* AWWWARDS Ghost Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[50%] right-[-5vw] -translate-y-1/2 z-0 select-none opacity-30 mix-blend-overlay"
          >
            <span
              className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(8rem, 20vw, 24rem)",
              }}
            >
              impact.
            </span>
          </div>

          {/* AWWWARDS Premium Liquid Aurora Background (Copper & Silver) */}
          <div className="about-liquid-aurora absolute top-[50%] left-[-20%] -translate-y-1/2 w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.06] blur-[120px] z-0 will-change-transform pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#b8c0cc] via-transparent to-[#c07840] rounded-full animate-[spin_22s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#c07840] to-[#b8c0cc] rounded-full animate-[spin_28s_linear_infinite_reverse] mix-blend-overlay" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
            {/* What you'll find — double space fixed (#8) */}
            {/* #8 — Glassmorphic "What You'll Find" wrapper */}
            <div className="reveal-text p-10 md:p-14 border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-sm relative overflow-hidden">
              {/* Subtle silver edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(184,192,204,0.3), transparent)",
                }}
              />
              <h2 className="text-4xl text-white font-bold mb-10 tracking-tight">
                WHAT YOU&apos;LL FIND HERE
              </h2>
              <ul className="flex flex-col gap-6 font-light text-2xl text-white/90">
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span className="font-medium">standards</span>
                  <span className="text-white/70 italic text-md">
                    instead of chaos
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span className="font-medium">responsibility</span>
                  <span className="text-white/70 italic text-md">
                    instead of excuses
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span className="font-medium">strong people</span>
                  <span className="text-white/70 italic text-md">
                    instead of political noise
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span className="font-medium">clean documentation</span>
                  <span className="text-white/70 italic text-md">
                    instead of knowledge islands
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span className="font-medium">discretion</span>
                  <span className="text-white/70 italic text-md">
                    as culture
                  </span>
                </li>
                <li className="flex justify-between pt-2">
                  <span className="text-copper">a global human family</span>
                  <span className="text-white/70 italic text-md text-right">
                    diversity is wanted
                    <br />
                    foundation is required
                  </span>
                </li>
              </ul>
            </div>

            {/* Application Process — dark glassmorphic (#3) */}
            <div className="reveal-text p-10 md:p-14 border border-white/10 bg-white/[0.04] backdrop-blur-sm rounded-sm">
              <h2 className="text-3xl font-bold mb-10 tracking-tight text-white">
                APPLICATION PROCESS
              </h2>

              <div className="flex flex-col gap-10 relative">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-copper via-silver/40 to-transparent shadow-[0_0_15px_rgba(192,120,64,0.8)]" />

                {[
                  { n: "1", t: "Submit", d: "Role interest + proof" },
                  { n: "2", t: "Screening", d: "Fit, foundation, delivery" },
                  { n: "3", t: "Short call", d: "If relevant" },
                  { n: "4", t: "Case / pilot", d: "Small, real, measurable" },
                  { n: "5", t: "Start", d: "Employee, interim, or pool" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 relative z-10">
                    <div className="w-8 h-8 rounded-full border border-silver/40 bg-[#070c14] text-silver shadow-[0_0_10px_rgba(184,192,204,0.2)] flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                      {step.n}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-tighter text-white">
                        {step.t}
                      </h4>
                      <p className="text-white/50 font-medium text-sm mt-1">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── APPLICATION FORM ── (#9 — copper border + glow) */}
        {/* #7 — Application form — Premium Executive Clearance Level */}
        <section id="apply" className="px-gutter py-[15vh] relative border-t border-copper/20 overflow-hidden bg-[#020304]">
          {/* Background Awwwards Parallax Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[20%] right-[-5vw] z-0 select-none opacity-50"
          >
            <span
              className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(6rem, 20vw, 24rem)",
              }}
            >
              apply.
            </span>
          </div>

          {/* Ambient glow above form */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center top, rgba(192,120,64,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="max-w-4xl mx-auto reveal-text relative z-10">
            <div className="mb-16 text-center">
              <span className="text-sm tracking-[0.5em] uppercase text-copper font-medium block mb-4">
                INITIATE
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-xl">
                APPLICATION
              </h2>
              <p className="text-white/70 font-light text-xl">
                Keep it clear and proof-based. If there&apos;s a fit, we&apos;ll
                reach out.
              </p>
            </div>

            <div className="relative p-10 md:p-16 rounded-[2rem] border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Premium Frosted Glass Background */}
              <div className="absolute inset-0 bg-white/[0.015] backdrop-blur-2xl z-0" />
              
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(192,120,64,0.05),_transparent_60%)] pointer-events-none rounded-[2rem]" />
              
              {/* Ultra-subtle Film Grain */}
              <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-[2rem] overflow-hidden" 
                   style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}>
              </div>

            <form
              ref={formRef}
              className="flex flex-col gap-10 relative z-10 form-section"
              onSubmit={handleFormSubmit}
            >
              <Honeypot />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative pt-6">
                  <input required id="name" name="name" type="text" placeholder="First & Last Name *"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="name" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    First &amp; Last Name *
                  </label>
                </div>
                <div className="relative pt-6">
                  <input required id="contact" name="contact" type="text" placeholder="Email / Phone *"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="contact" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Email / Phone *
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative pt-6">
                  <input id="location" name="location" type="text" placeholder="Country / City / Time Zone"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="location" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Country / City / Time Zone
                  </label>
                </div>
                <div className="relative pt-6">
                  <input id="region" name="region" type="text" placeholder="Continent / Region"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="region" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Continent / Region
                  </label>
                </div>
              </div>

              <div className="relative pt-6">
                <input id="languages" name="languages" type="text" placeholder="Languages (Select / Free text) e.g. English (Native), German (Fluent)"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label htmlFor="languages" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                  Languages (Select / Free text)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="work_model" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Work Model
                  </label>
                  <select id="work_model" name="work_model"
                    className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                    defaultValue="remote"
                  >
                    <option value="remote" className="text-black">Remote</option>
                    <option value="hybrid" className="text-black">Hybrid</option>
                    <option value="onsite" className="text-black">On-site</option>
                    <option value="travel" className="text-black">Travel-ready</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="travel" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Travel Readiness
                  </label>
                  <select id="travel" name="travel"
                    className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                    defaultValue="project"
                  >
                    <option value="yes" className="text-black">Yes</option>
                    <option value="no" className="text-black">No</option>
                    <option value="project" className="text-black">Project-dependent</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="entry_path" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Entry Path
                  </label>
                  <select id="entry_path" name="entry_path"
                    className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                    defaultValue="employee"
                  >
                    <option value="employee" className="text-black">Employee</option>
                    <option value="freelancer" className="text-black">Freelancer / Interim</option>
                    <option value="specialist" className="text-black">Specialist Pool</option>
                  </select>
                </div>
              </div>

              <div className="relative pt-6">
                <input id="roles" name="roles" type="text" placeholder="Pillars of Interest (Multi-select) & Desired Role(s)"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label htmlFor="roles" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                  Pillars of Interest &amp; Desired Role(s)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative pt-6">
                  <input id="linkedin" name="linkedin" type="url" placeholder="LinkedIn / Website"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="linkedin" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    LinkedIn / Website
                  </label>
                </div>
                <div className="relative pt-6">
                  <input id="portfolio" name="portfolio" type="text" placeholder="Portfolio / Proof Links (Max 3)"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="portfolio" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Portfolio / Proof Links (Max 3)
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="cv" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  CV / Resume Upload (PDF, DOC — max 5MB)
                </label>
                <input id="cv" name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-lg font-medium text-white/80 file:mr-4 file:py-2 file:px-6 file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white/80 file:cursor-pointer file:rounded-none hover:file:bg-copper/20 hover:file:text-copper transition-colors focus:border-copper"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative pt-6">
                  <input id="availability" name="availability" type="text" placeholder="Availability (Start date / Hrs per week)"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="availability" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Availability (Start date / Hrs per week)
                  </label>
                </div>
                <div className="relative pt-6">
                  <input id="salary" name="salary" type="text" placeholder="Salary range or Day rate (Optional)"
                    className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                  />
                  <label htmlFor="salary" className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text">
                    Salary range or Day rate (Optional)
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="foundation" className="text-md uppercase tracking-widest text-copper font-bold">
                  Foundation Fit (Required) *
                </label>
                <p className="text-md text-white/80 mb-2">
                  2–3 sentences on truth, responsibility, justice, compassion,
                  discretion, and excellence.
                </p>
                <textarea required id="foundation" name="foundation"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  Short Message (Optional)
                </label>
                <textarea id="message" name="message"
                  rows={2}
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors resize-none"
                />
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center sm:items-start gap-6">
                {/* Magnetic Submit button — silver expansion */}
                <div className="relative w-full md:w-max mt-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-copper/20 blur-[30px] pointer-events-none rounded-full" />
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="notranslate group relative flex items-center justify-center gap-4 bg-white px-10 py-5 overflow-hidden w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(184,192,204,0.4)] transition-shadow duration-300"
                  >
                    <span className="relative z-10 font-bold uppercase tracking-widest text-md text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
                      {isSubmitting ? tCtas("submitting") : tCtas("submitApplication")}
                    </span>
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-2 h-2 rounded-full bg-silver group-hover:scale-[60] transition-transform duration-500 ease-out pointer-events-none" />
                  </MagneticButton>
                </div>
                
                {submitStatus === "success" && (
                  <p className="text-green-500/90 text-lg font-light mt-2 border border-green-500/20 bg-green-500/10 p-4 rounded-sm w-full">
                    Application submitted successfully. We&apos;ll reach out with next steps if there is a fit.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm w-full">
                    Failed to submit application. Please try again later.
                  </p>
                )}
                {submitStatus === "idle" && (
                  <span className="text-md text-white/70 tracking-widest uppercase text-center sm:text-left">
                    Your submission is confidential.
                  </span>
                )}
              </div>
            </form>
            </div>
          </div>
        </section>
      </main>

      {/* Journey Conclusion Statement */}
      <section className="relative px-8 md:px-16 pb-32 pt-16 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-turquoise/50 mb-12" />
        <h2 className="font-playfair text-3xl md:text-5xl font-semibold italic text-white/90 mb-6 tracking-wide">
          If this felt normal, you belong here.
        </h2>
        <p className="font-sans text-xl md:text-2xl font-light text-white/60 max-w-2xl leading-relaxed">
          The digital journey concludes here. <br />
          The real-world partnership begins.
        </p>
      </section>

      <FooterSection />

      <NextChapterTransition
        nextTitle={tNav("contact")}
        nextHref="/contact"
        prevHref="/partnerships"
        narrativeLine="If you've read this far — you already understand us."
        accentColor="#c07840"
      />

    </div>
  );
}
