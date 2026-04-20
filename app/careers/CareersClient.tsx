"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

// ── Floating Particles Data (CSS-only, no JS overhead) ──
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  left: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 30 + Math.random() * 30,
  opacity: 0.08 + Math.random() * 0.15,
  color: i % 3 === 0 ? "turquoise" : i % 3 === 1 ? "gold" : "white",
  sway: 20 + Math.random() * 40,
}));

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

export default function CareersClient() {
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const [openPillar, setOpenPillar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".reveal-text", {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
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
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black relative"
    >
      {/* #1 — Dark overlay for content readability — lets fluid bleed through edges */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(6,6,6,0.88) 0%, rgba(6,6,6,0.7) 50%, rgba(6,6,6,0.5) 100%)",
        }}
      />

      {/* #2 — CSS Floating Particles */}
      <div className="fixed inset-0 pointer-events-none -z-[5] overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: "-5%",
              opacity: p.opacity,
              backgroundColor:
                p.color === "turquoise"
                  ? "rgba(18,168,172,0.6)"
                  : p.color === "gold"
                    ? "rgba(212,175,55,0.5)"
                    : "rgba(255,255,255,0.4)",
              boxShadow:
                p.color === "turquoise"
                  ? "0 0 6px rgba(18,168,172,0.3)"
                  : p.color === "gold"
                    ? "0 0 6px rgba(212,175,55,0.2)"
                    : "none",
              animation: `floatUp ${p.duration}s linear ${p.delay}s infinite, sway${p.id % 3} ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="pt-[25vh]">
        {/* ── HERO ── */}
        <section className="px-gutter pb-[20vh] flex flex-col gap-16 relative">
          {/* Layered ambient depth — petrol + turquoise (#4) */}
          <div
            className="absolute right-[-5vw] top-[-15vh] w-[60vw] h-[60vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(0,109,132,0.06) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute left-[-10vw] bottom-[-10vh] w-[50vw] h-[50vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(18,168,172,0.04) 0%, transparent 60%)",
            }}
          />

          <div className="max-w-6xl z-10">
            {/* #4 — Gold Eyebrow */}
            <p
              className="careers-eyebrow text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase mb-8"
              style={{ color: "rgba(212,175,55,0.85)", opacity: 0 }}
            >
              PEOPLE &amp; CULTURE // GLOBAL TALENT
            </p>

            {/* #3 + #5 + #6 — Gradient text + breathing ref + full opacity */}
            <h1
              ref={heroRef}
              className="reveal-text text-[clamp(4rem,9vw,10rem)] leading-[0.85] font-extrabold tracking-tighter uppercase mb-12"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, rgba(18,168,172,0.7) 50%, #ffffff 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CAREERS AT <br />
              GOTT WALD
            </h1>

            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <div className="flex-1 flex flex-col gap-6 text-white font-light leading-relaxed tracking-wide reveal-text">
                <p className="text-2xl md:text-3xl font-medium tracking-tight">
                  We recruit intentionally worldwide — and we mean it.
                </p>
                <p className="text-white max-w-md text-lg">
                  GOTT WALD is a human family: different cultures, traditions, languages, life paths — wanted. Because diversity increases our intelligence. 
                  <br /><br />
                  Our axis of impact: NATURE — ANIMALS — HUMANS.
                </p>
              </div>

              <div className="flex-1 flex flex-col items-start gap-8 justify-center reveal-text">
                {/* #10 — CTA buttons with turquoise hover glow */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#apply"
                    className="h-12.5 rounded-full bg-white text-black flex items-center justify-center px-8 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(18,168,172,0.2)] transition-all duration-300 uppercase text-xs tracking-widest font-bold"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#apply"
                    className="h-12.5 rounded-full border border-white/20 text-white flex items-center justify-center px-8 hover:bg-white/10 hover:border-turquoise/40 hover:shadow-[0_0_20px_rgba(18,168,172,0.12)] transition-all duration-300 uppercase text-xs tracking-widest font-bold"
                  >
                    Specialist Pool
                  </a>
                </div>

                {/* Hero metadata — stagger entrance (#12) */}
                <div className="flex gap-4 items-center pl-2 reveal-text">
                  <div className="w-px h-12 bg-white/20" />
                  <div className="flex flex-col gap-1">
                    <span className="text-white/80 text-md tracking-widest uppercase font-medium">
                      Global-first. Remote-friendly. Confidential.
                    </span>
                    <span className="text-gold text-md tracking-widest uppercase font-medium">
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
                "linear-gradient(90deg, rgba(18,168,172,0.4) 0%, rgba(212,175,55,0.3) 50%, rgba(18,168,172,0.1) 100%)",
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
              {/* Card hover: lift + glow (#5), stray ƒ removed (#1) */}
              <div className="stagger-item border border-white/10 p-10 hover:border-turquoise/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(18,168,172,0.08)] transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-white/60 mb-6 font-bold">
                  Path 01
                </div>
                <h3 className="text-2xl font-bold mb-4">Employee</h3>
                <p className="text-white font-light leading-relaxed text-lg">
                  For people who want to build long-term and carry responsibility.
                </p>
              </div>

              <div className="stagger-item border border-white/10 p-10 hover:border-turquoise/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(18,168,172,0.08)] transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-white/60 mb-6 font-bold">
                  Path 02
                </div>
                <h3 className="text-2xl font-bold mb-4">Freelancer / Interim</h3>
                <p className="text-white font-light leading-relaxed text-lg">
                  For professionals who deliver at a high level for defined scopes — clean standards, clear ownership.
                </p>
              </div>

              <div className="stagger-item border border-white/10 p-10 hover:border-turquoise/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(18,168,172,0.08)] transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-gold/80 mb-6 font-bold">
                  Path 03
                </div>
                <h3 className="text-2xl font-bold mb-4">Specialist Pool</h3>
                <p className="text-white font-light leading-relaxed text-lg">
                  For selected experts we activate on demand (project-based, NDA-ready).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO WE'RE LOOKING FOR ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 reveal-text">
              <h2 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-tighter font-bold uppercase mb-8">
                WHO WE&apos;RE <br /> LOOKING FOR
              </h2>
              <p className="text-white/80 italic text-lg border-l border-gold pl-6 mt-12">
                &quot;If this feels &apos;normal&apos; to you, you&apos;re
                probably in the right room.&quot;
              </p>
            </div>

            {/* Turquoise bullets (#6) */}
            <div className="flex-1 border border-white/10 p-10 md:p-16 bg-white/[0.02] stagger-group">
              <ul className="flex flex-col gap-6 text-lg md:text-xl font-light text-white/80 tracking-wide">
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  think in outcomes (not tasks)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  communicate cleanly (no fog, no ego)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  document properly (transferable, auditable)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  keep quality under pressure
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  live discretion as a reflex
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-2 h-2 bg-turquoise/50 rounded-full shrink-0" />
                  can be different — without losing foundation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ROLES BY PILLAR (ACCORDION) ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 reveal-text text-center">
              <span className="text-md tracking-[0.5em] uppercase text-gold/80 font-medium block mb-4">
                ARCHITECTURE
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
                ROLES BY PILLAR
              </h2>
            </div>

            <div className="flex flex-col border-t border-white/10 stagger-group">
              {PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className={`stagger-item border-b border-white/10 group transition-all duration-500 ${
                    openPillar === i
                      ? "border-l-2 border-l-gold bg-white/[0.02]"
                      : "border-l-2 border-l-transparent"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenPillar(openPillar === i ? null : i)
                    }
                    className="w-full py-8 md:py-12 flex items-center justify-between text-left focus:outline-none pl-4 md:pl-6"
                  >
                    <div className="flex items-start md:items-center pr-4 md:pr-8 flex-1">
                      <span className={`text-2xl md:text-4xl font-light transition-colors w-12 md:w-20 shrink-0 ${openPillar === i ? "text-gold" : "text-white/20 group-hover:text-gold"}`}>
                        {pillar.letter}
                      </span>
                      <h3 className="text-xl md:text-3xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-500 leading-tight">
                        {pillar.title}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0
                       ${openPillar === i ? "border-white bg-white text-black -rotate-180" : "border-white/20 text-white/50 group-hover:border-white/60"}
                     `}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
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

                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${openPillar === i ? "max-h-250 opacity-100 mb-12" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-4 md:pl-20 flex flex-col md:flex-row gap-12 pt-4">
                      <div className="flex-1">
                        <h4 className="text-md tracking-[0.2em] text-gold uppercase mb-6 font-bold">
                          Role Profiles
                        </h4>
                        <ul className="flex flex-col gap-3 font-light text-white/60 leading-relaxed">
                          {pillar.roles.map((role, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="text-turquoise/40 mt-1.5">•</span>
                              {role}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full md:w-1/3 p-8 border border-white/10 bg-white/5 rounded-2xl h-fit pr-4">
                        <h4 className="text-md tracking-[0.2em] text-gold/80 uppercase mb-4 font-bold">
                          Impact Profile
                        </h4>
                        <p className="text-white font-medium tracking-wide">
                          &quot;{pillar.impact}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS & WHAT YOU'LL FIND ── */}
        <section className="px-gutter py-[15vh] border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* What you'll find — double space fixed (#8) */}
            {/* #8 — Glassmorphic "What You'll Find" wrapper */}
            <div className="reveal-text p-10 md:p-14 border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-sm relative overflow-hidden">
              {/* Subtle turquoise edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(18,168,172,0.3), transparent)",
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
                  <span className="text-gold">a global human family</span>
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
                <div className="absolute left-3.75 top-6 bottom-4 w-0.5 bg-white/10" />

                {[
                  { n: "1", t: "Submit", d: "Role interest + proof" },
                  { n: "2", t: "Screening", d: "Fit, foundation, delivery" },
                  { n: "3", t: "Short call", d: "If relevant" },
                  { n: "4", t: "Case / pilot", d: "Small, real, measurable" },
                  { n: "5", t: "Start", d: "Employee, interim, or pool" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0 mt-1">
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

        {/* ── APPLICATION FORM ── (#9 — gold border + glow) */}
        {/* #7 — Application form — transparent bg, let fluid show through */}
        <section id="apply" className="px-gutter py-[15vh] relative border-t border-gold/20">
          {/* Ambient glow above form */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center top, rgba(212,175,55,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="max-w-3xl mx-auto reveal-text relative z-10">
            <div className="mb-16">
              <span className="text-md tracking-[0.5em] uppercase text-gold font-medium block mb-4">
                INITIATE
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">
                APPLICATION
              </h2>
              <p className="text-white/80 font-light text-lg">
                Keep it clear and proof-based. If there&apos;s a fit, we&apos;ll
                reach out.
              </p>
            </div>

            <form
              ref={formRef}
              className="flex flex-col gap-10"
              onSubmit={handleFormSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="name" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    First &amp; Last Name *
                  </label>
                  <input required id="name" name="name"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="contact" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Email / Phone *
                  </label>
                  <input required id="contact" name="contact"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="location" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Country / City / Time Zone
                  </label>
                  <input id="location" name="location"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="region" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Continent / Region
                  </label>
                  <input id="region" name="region"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="languages" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  Languages (Select / Free text)
                </label>
                <input id="languages" name="languages"
                  type="text"
                  placeholder="e.g. English (Native), German (Fluent)"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/20 focus:border-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="work_model" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Work Model
                  </label>
                  <select id="work_model" name="work_model"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
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
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
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
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue="employee"
                  >
                    <option value="employee" className="text-black">Employee</option>
                    <option value="freelancer" className="text-black">Freelancer / Interim</option>
                    <option value="specialist" className="text-black">Specialist Pool</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="roles" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  Pillars of Interest (Multi-select) &amp; Desired Role(s)
                </label>
                <input id="roles" name="roles"
                  type="text"
                  placeholder="e.g. Pillar G - Copywriter"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/20 focus:border-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="linkedin" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    LinkedIn / Website
                  </label>
                  <input id="linkedin" name="linkedin"
                    type="url"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="portfolio" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Portfolio / Proof Links (Max 3)
                  </label>
                  <input id="portfolio" name="portfolio"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="cv" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  CV / Resume Upload (PDF, DOC — max 5MB)
                </label>
                <input id="cv" name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-lg font-medium text-white/80 file:mr-4 file:py-2 file:px-6 file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white/80 file:cursor-pointer file:rounded-none hover:file:bg-gold/20 hover:file:text-gold transition-colors focus:border-gold"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="availability" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Availability (Start date / Hrs per week)
                  </label>
                  <input id="availability" name="availability"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="salary" className="text-md uppercase tracking-wider text-white/70 font-medium">
                    Salary range or Day rate (Optional)
                  </label>
                  <input id="salary" name="salary"
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="foundation" className="text-md uppercase tracking-widest text-gold font-bold">
                  Foundation Fit (Required) *
                </label>
                <p className="text-md text-white/80 mb-2">
                  2–3 sentences on truth, responsibility, justice, compassion,
                  discretion, and excellence.
                </p>
                <textarea required id="foundation" name="foundation"
                  rows={4}
                  className="w-full bg-transparent border-b border-gold/30 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-md uppercase tracking-wider text-white/70 font-medium">
                  Short Message (Optional)
                </label>
                <textarea id="message" name="message"
                  rows={2}
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors resize-none"
                />
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center sm:items-start gap-6">
                {/* Submit button — turquoise expansion (#11) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-magnetic
                  className="group relative flex items-center justify-center gap-4 bg-white px-10 py-5 overflow-hidden w-full md:w-max mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-md text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </span>
                  <span className="relative z-0 w-2 h-2 rounded-full bg-[#0a9396] group-hover:scale-[60] transition-transform duration-500 ease-out origin-center pointer-events-none" />
                </button>
                
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
        </section>
      </main>

      <FooterSection />

      {/* ── Particle Keyframes (injected once) ── */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: var(--particle-opacity, 0.12);
          }
          90% {
            opacity: var(--particle-opacity, 0.12);
          }
          100% {
            transform: translateY(-110vh) translateX(0);
            opacity: 0;
          }
        }
        @keyframes sway0 {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }
        @keyframes sway1 {
          0% { transform: translateX(-30px); }
          100% { transform: translateX(35px); }
        }
        @keyframes sway2 {
          0% { transform: translateX(-15px); }
          100% { transform: translateX(25px); }
        }
      `}</style>
    </div>
  );
}
