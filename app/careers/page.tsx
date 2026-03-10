"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import CinematicImage from "@/components/CinematicImage";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    letter: "A",
    title: "GOTT WALD Holding / Corporate Services",
    roles: [
      "CFO Office / Finance Manager / Controller / FP&A Analyst",
      "Accounting & Operations Accounting (interfaces with tax/legal)",
      "Legal & Contracts Manager (corporate, IP, contracts, compliance)",
      "Tax Coordination / Structuring Support (operational, clean, reliable)",
      "PMO / Operations / Quality Management (SOPs, governance, standards)",
      "Executive Assistant / Office Management (high-trust, high-precision)",
    ],
    impact: "precise, discreet, process-driven, “no drama”",
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
      "Technical Writer / Documentation Excellence (SSOT, handbooks, playbooks)",
    ],
    impact:
      "systems thinker, stakeholder-strong, structured, excellent handovers",
  },
  {
    letter: "C",
    title: "CONSULTING",
    roles: [
      "Strategy Consultant / Senior Consultant",
      "Org & Performance Consultant (KPIs, execution frameworks)",
      "Growth / Go-to-Market Consultant",
      "Complexity / Turnaround (prioritization, decision architecture)",
      "Executive Advisor / C-level sparring (retained/interim)",
    ],
    impact: "clear, analytical, decisive, premium communication",
  },
  {
    letter: "D",
    title: "COACHING & MENTORING",
    roles: [
      "Executive Coach (leadership, responsibility, decision-making)",
      "Facilitator (workshops, offsites, retreat formats)",
      "Performance Coach (serious, stable, evidence-near)",
      "Program Designer (curricula, learning paths, practice design)",
      "Client Experience / Program Operations (flow, quality, care)",
    ],
    impact: "present, calm, discreet — effectiveness over show",
  },
  {
    letter: "E",
    title: "RELOCATION / STRUCTURE DEPLOYMENT (Georgia Hub)",
    roles: [
      "Relocation Manager / Client Onboarding Lead",
      "Operations Coordinator (logistics, settling-in, vendor network)",
      "Legal/Immigration Coordinator (process-strong, detail-precise)",
      "Tax Coordination Associate (compliance-first, clean execution)",
      "Client Concierge (premium care, high-trust communication)",
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
      "UX/UI Designer / Product Designer (design systems, prototyping)",
      "QA / Release Manager (testing, releases, quality)",
    ],
    impact: "performance-obsessed, clean, security-aware, documentation-strong",
  },
  {
    letter: "G",
    title: "MARKETING & COMMUNICATION",
    roles: [
      "Brand Strategist / Creative Director (systems thinking, premium)",
      "Copywriter / Editor (precision, tone, conversion)",
      "Content Producer (video, reels, YouTube, motion)",
      "Performance Marketer (funnels, CRO, paid, retargeting)",
      "PR / Partnerships (positioning, media, collaborations)",
      "Social Media Ops (publishing, calendars, processes, reporting)",
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
      "Compliance & Privacy (GDPR, consent, data governance)",
      "Content & Education Lead (programs, experts, knowledge base)",
      "Operations Manager (flow, quality, scaling)",
    ],
    impact: "service-excellent, quality-driven, process-clean, human-clear",
  },
  {
    letter: "I",
    title: "PLHH (Coin / Community / Real-World Impact)",
    roles: [
      "Community Lead / Community Care",
      "Partnerships & Ecosystem Builder",
      "Governance / DAO Operations (processes, transparency)",
      "Blockchain Engineer (Sui) / Smart Contract Engineer",
      "Security & Trust (risk controls, scam prevention, comms)",
      "Impact Operations (projects, verification, reporting)",
    ],
    impact: "responsible, transparent, security-conscious, people-first",
  },
];

export default function CareersPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // General Reveal Animations for texts
      const reveals = document.querySelectorAll(".reveal-text");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Staggered reveal for rows/lists
      const staggerGroups = document.querySelectorAll(".stagger-group");
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
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black"
    >
      {/* ── HEADER ── */}
      <div className="fixed top-0 left-0 w-full z-50 px-[5vw] mix-blend-difference pointer-events-auto">
        <Header />
      </div>

      <main className="pt-[25vh]">
        {/* ── HERO SECTION ── */}
        <section className="px-[5vw] pb-[20vh] flex flex-col gap-16 relative">
          <div
            className="absolute right-[5vw] top-[-5vh] w-[40vw] h-[40vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-6xl z-10">
            <h1 className="reveal-text text-[clamp(4rem,9vw,10rem)] leading-[0.85] font-extrabold tracking-tighter uppercase mb-12">
              CAREERS AT <br />
              <span className="text-white/60">GOTT WALD</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <div className="flex-1 flex flex-col gap-6 text-white/80 font-light leading-relaxed tracking-wide reveal-text">
                <p className="text-2xl md:text-3xl font-medium tracking-tight">
                  We don&apos;t hire &quot;staff&quot;. We select people with
                  foundation.
                </p>
                <p className="text-base text-white/50 max-w-md">
                  GOTT WALD is a global ecosystem built on standards,
                  responsibility, and real execution. Remote by default.
                  Discreet by design.
                </p>
              </div>

              <div className="flex-1 flex flex-col items-start gap-8 justify-center reveal-text">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#apply"
                    className="h-[50px] rounded-full bg-white text-black flex items-center justify-center px-8 hover:bg-white/90 transition-colors uppercase text-xs tracking-widest font-bold"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#apply"
                    className="h-[50px] rounded-full border border-white/20 text-white flex items-center justify-center px-8 hover:bg-white/10 hover:border-white/40 transition-colors uppercase text-xs tracking-widest font-bold"
                  >
                    Specialist Pool
                  </a>
                </div>

                <div className="flex gap-4 items-center pl-2">
                  <div className="w-[1px] h-12 bg-white/20" />
                  <div className="flex flex-col gap-1">
                    <span className="text-white/50 text-[10px] tracking-widest uppercase font-medium">
                      Global-first. Remote-friendly. Confidential by default.
                    </span>
                    <span className="text-[#d4af37] text-[10px] tracking-widest uppercase font-medium">
                      Headquarter: Georgia.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ATMOSPHERIC WORKSPACE IMAGE ── */}
        <section className="px-[5vw] pb-[15vh] bg-transparent">
          <div className="max-w-7xl mx-auto">
            <CinematicImage
              src="/images/careers_workspace.png"
              alt="Gott Wald Atmospheric Workspace"
              priority
              overlay
              className="w-full aspect-[16/9] md:aspect-[21/9] rounded-none filter contrast-125 brightness-90 border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
            />
          </div>
        </section>

        {/* ── 7-LINE MANIFESTO ── */}
        <section className="px-[5vw] py-[15vh] border-t border-white/10 bg-white/[0.01]">
          <div className="flex flex-col lg:flex-row gap-16 justify-between items-start max-w-7xl mx-auto">
            <div className="lg:w-1/3 reveal-text">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium mb-4 block">
                01 — THE FOUNDATION
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
                A 7-LINE <br /> MANIFESTO
              </h2>
            </div>

            <div className="lg:w-2/3 stagger-group flex flex-col gap-6 text-xl md:text-3xl font-light tracking-tight text-white/80">
              <p className="stagger-item">
                We act in truth —{" "}
                <span className="text-white/40">clear, without fog.</span>
              </p>
              <p className="stagger-item">
                We serve what is good —{" "}
                <span className="text-white/40">not the ego.</span>
              </p>
              <p className="stagger-item">
                We carry responsibility —{" "}
                <span className="text-white/40">even when it costs.</span>
              </p>
              <p className="stagger-item">
                We practice justice —{" "}
                <span className="text-white/40">fair, reliable, clean.</span>
              </p>
              <p className="stagger-item">
                We live compassion —{" "}
                <span className="text-white/40">
                  without performing weakness.
                </span>
              </p>
              <p className="stagger-item text-[#d4af37]">
                We protect dignity and life — NATURE — ANIMALS — HUMANS.
              </p>
              <p className="stagger-item">
                We keep our word —{" "}
                <span className="text-white/40">and we stand behind it.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── GLOBAL PEOPLE-FAMILY ── */}
        <section className="px-[5vw] py-[20vh]">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-12 reveal-text">
            <span className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37] font-medium block">
              02 — OUR CULTURE
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter leading-[1.1]">
              GLOBAL <br /> PEOPLE-FAMILY
            </h2>
            <div className="text-lg md:text-xl text-white/50 font-light leading-[1.8] flex flex-col gap-6">
              <p>
                We recruit intentionally worldwide — and we mean it. GOTT WALD
                is a human family: different cultures, traditions, languages,
                life paths — wanted. Not as marketing. Because diversity
                increases our intelligence.
              </p>
              <p className="text-white">
                Our goal is simple: We want to be equally present across all
                continents.
              </p>
              <p>
                What connects us is not origin — it’s foundation: truth,
                responsibility, justice, compassion, discretion, excellence.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3 WAYS TO JOIN ── */}
        <section className="px-[5vw] py-[15vh] bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal-text">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
                3 WAYS TO JOIN
              </h2>
              <p className="text-white/40 mt-4 tracking-widest text-[10px] uppercase">
                We don’t decide by titles — we decide by proof, foundation, and
                execution quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-group">
              {/* 1 */}
              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 01
                </div>
                <h3 className="text-2xl font-bold mb-4">Employee</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  For people who want to build long-term and carry
                  responsibility.
                </p>
              </div>

              {/* 2 */}
              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 02
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Freelancer / Interim
                </h3>
                <p className="text-white/50 font-light leading-relaxed">
                  For professionals who deliver at a high level for defined
                  scopes — clean standards, clear ownership.
                </p>
              </div>

              {/* 3 */}
              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 03
                </div>
                <h3 className="text-2xl font-bold mb-4">Specialist Pool</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  For selected experts we activate on demand (project-based,
                  NDA-ready).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-gutter py-[15vh]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 reveal-text">
              <h2 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-tighter font-bold uppercase mb-8">
                WHO WE&apos;RE <br /> LOOKING FOR
              </h2>
              <p className="text-white/50 italic text-lg border-l border-gold pl-6 mt-12">
                &quot;If this feels &apos;normal&apos; to you, you&apos;re
                probably in the right room.&quot;
              </p>
            </div>

            <div className="flex-1 border border-white/10 p-10 md:p-16 bg-white/[0.01] stagger-group">
              <ul className="flex flex-col gap-6 text-lg md:text-xl font-light text-white/80 tracking-wide">
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />{" "}
                  think in outcomes (not tasks)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />{" "}
                  communicate cleanly (no fog, no ego)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />{" "}
                  document properly (transferable, auditable)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" /> keep
                  quality under pressure
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" /> live
                  discretion as a reflex
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" /> can
                  be different — without losing foundation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ROLES BY PILLAR (ACCORDION) ── */}
        <section className="px-[5vw] py-[15vh]">
          <div className="max-w-5xl mx-auto min-h-screen">
            <div className="mb-20 reveal-text text-center">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium block mb-4">
                03 — ARCHITECTURE
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
                ROLES BY PILLAR
              </h2>
            </div>

            <div className="flex flex-col border-t border-white/10 stagger-group">
              {PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className="stagger-item border-b border-white/10 group"
                >
                  <button
                    onClick={() => toggleAccordion(i)}
                    className="w-full py-8 md:py-12 flex items-center justify-between text-left focus:outline-none"
                  >
                    <div className="flex items-start md:items-center pr-4 md:pr-8 flex-1">
                      <span className="text-2xl md:text-4xl font-light text-white/20 group-hover:text-[#d4af37] transition-colors w-12 md:w-20 shrink-0">
                        {pillar.letter}
                      </span>
                      <h3 className="text-xl md:text-3xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-500 leading-tight">
                        {pillar.title}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0
                       ${openAccordion === i ? "border-white bg-white text-black -rotate-180" : "border-white/20 text-white/50 group-hover:border-white/60"}
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
                          d={openAccordion === i ? "M1 7h12" : "M7 1v12M1 7h12"}
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${openAccordion === i ? "max-h-[1000px] opacity-100 mb-12" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-0 md:pl-20 flex flex-col md:flex-row gap-12 pt-4">
                      <div className="flex-1">
                        <h4 className="text-[10px] tracking-[0.2em] text-[#d4af37] uppercase mb-6 font-bold">
                          Role Profiles
                        </h4>
                        <ul className="flex flex-col gap-3 font-light text-white/60 leading-relaxed">
                          {pillar.roles.map((role, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="text-white/20 mt-1.5">•</span>
                              {role}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full md:w-1/3 p-8 border border-white/10 bg-white/5 rounded-2xl h-fit">
                        <h4 className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4 font-bold">
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
        <section className="px-[5vw] py-[15vh]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* What you'll find */}
            <div className="reveal-text">
              <h2 className="text-3xl font-bold mb-10 tracking-tight">
                WHAT YOU&apos;LL FIND HERE
              </h2>
              <ul className="flex flex-col gap-6 font-light text-xl text-white/70">
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span>standards</span>
                  <span className="text-white/30 italic text-sm">
                    instead of chaos
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span>responsibility</span>
                  <span className="text-white/30 italic text-sm">
                    instead of excuses
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span>strong people</span>
                  <span className="text-white/30 italic text-sm">
                    instead of political noise
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span>clean documentation</span>
                  <span className="text-white/30 italic text-sm">
                    instead of knowledge islands
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-4">
                  <span>discretion</span>
                  <span className="text-white/30 italic text-sm">
                    as culture
                  </span>
                </li>
                <li className="flex justify-between pt-2">
                  <span className="text-[#d4af37]">a global human family</span>
                  <span className="text-white/30 italic text-sm text-right">
                    diversity is wanted
                    <br />
                    foundation is required
                  </span>
                </li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="reveal-text p-10 md:p-14 bg-white text-black">
              <h2 className="text-3xl font-bold mb-10 tracking-tight">
                APPLICATION PROCESS
              </h2>

              <div className="flex flex-col gap-10 relative">
                <div className="absolute left-[15px] top-6 bottom-4 w-[2px] bg-black/10" />

                {[
                  { n: "1", t: "Submit", d: "Role interest + proof" },
                  { n: "2", t: "Screening", d: "Fit, foundation, delivery" },
                  { n: "3", t: "Short call", d: "If relevant" },
                  { n: "4", t: "Case / pilot", d: "Small, real, measurable" },
                  { n: "5", t: "Start", d: "Employee, interim, or pool" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                      {step.n}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-tighter">
                        {step.t}
                      </h4>
                      <p className="text-black/60 font-medium text-sm mt-1">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-black/5 p-6 text-xs font-bold uppercase tracking-widest text-black/40">
                Note: Global means time zones are manageable — the standard
                stays the same.
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA / PRE-FORM ── */}
        <section className="px-[5vw] py-[20vh] text-center border-t border-white/10 relative overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 relative z-10 reveal-text">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter leading-[1] uppercase">
              If you love standards and can carry responsibility, apply.
            </h2>
            <p className="text-xl md:text-2xl text-white/50 tracking-wide font-light">
              If you value diversity and can hold the foundation — even more so.
            </p>

            <div className="flex flex-col items-center gap-8 mt-4">
              <a
                href="#apply"
                className="h-[60px] rounded-full bg-white text-black flex items-center justify-center px-12 hover:scale-105 transition-transform uppercase text-sm tracking-[0.2em] font-bold"
              >
                Apply Now
              </a>
              <div className="flex gap-8">
                <a
                  href="#apply"
                  className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white"
                >
                  Freelancer / Specialist Pool
                </a>
                <a
                  href="#apply"
                  className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white"
                >
                  Send Portfolio / LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── APPLICATION FORM (Static) ── */}
        <section id="apply" className="px-[5vw] py-[15vh] bg-[#050505]">
          <div className="max-w-3xl mx-auto reveal-text">
            <div className="mb-16">
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37] font-medium block mb-4">
                04 — INITIATE
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">
                APPLICATION
              </h2>
              <p className="text-white/50 font-light text-lg">
                Keep it clear and proof-based. If there’s a fit, we’ll reach
                out.
              </p>
            </div>

            <form
              className="flex flex-col gap-10"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    First & Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Email / Phone *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="Contact Info"
                  />
                </div>
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Country / City / Time Zone
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="Location"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="Languages"
                  />
                </div>
              </div>

              {/* Selection Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Work Model
                  </label>
                  <select
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue="remote"
                  >
                    <option value="remote" className="text-black">
                      Remote
                    </option>
                    <option value="hybrid" className="text-black">
                      Hybrid
                    </option>
                    <option value="onsite" className="text-black">
                      On-site
                    </option>
                    <option value="travel" className="text-black">
                      Travel-ready
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Entry Path
                  </label>
                  <select
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue="employee"
                  >
                    <option value="employee" className="text-black">
                      Employee
                    </option>
                    <option value="freelancer" className="text-black">
                      Freelancer / Interim
                    </option>
                    <option value="specialist" className="text-black">
                      Specialist Pool
                    </option>
                  </select>
                </div>
              </div>

              {/* Roles */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                  Desired Role(s) & Pillars of Interest
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pillar F - Frontend Engineer"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/30 focus:border-gold transition-colors"
                />
              </div>

              {/* Proof */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    LinkedIn / Website
                  </label>
                  <input
                    type="url"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="URL"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                    Portfolio / Proof Links (Max 3)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                    placeholder="URLs"
                  />
                </div>
              </div>

              {/* Text Areas */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                  Foundation Fit (Required) *
                </label>
                <p className="text-[10px] text-white/30 mb-2">
                  2–3 sentences on truth, responsibility, justice, compassion,
                  discretion, and excellence.
                </p>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-[#d4af37]/30 pb-4 pt-6 outline-none text-xl font-medium focus:border-[#d4af37] transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                  Short Message (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col items-center sm:items-start gap-6">
                <button
                  type="button"
                  data-magnetic
                  className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 overflow-hidden w-max mt-8"
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors duration-300">
                    Submit Application
                  </span>
                  <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[30] transition-transform duration-500 ease-out origin-center" />
                </button>
                <span className="text-[10px] text-white/30 tracking-widest uppercase">
                  Your submisson is confidential.
                </span>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <FooterSection />
    </div>
  );
}
