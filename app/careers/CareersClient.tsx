"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

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
  const [openPillar, setOpenPillar] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray(
        ".reveal-text",
        pageRef.current!,
      ) as HTMLElement[];
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
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
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="pt-[25vh]">
        {/* ── HERO ── */}
        <section className="px-gutter pb-[20vh] flex flex-col gap-16 relative">
          <div
            className="absolute right-gutter top-[-5vh] w-[40vw] h-[40vw] rounded-full pointer-events-none"
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
                  We recruit intentionally worldwide — and we mean it.
                </p>
                <p className="text-white/60 max-w-md text-lg">
                  GOTT WALD is a human family: different cultures, traditions, languages, life paths — wanted. Because diversity increases our intelligence. 
                  <br /><br />
                  Our axis of impact: NATURE — ANIMALS — HUMANS.
                </p>
              </div>

              <div className="flex-1 flex flex-col items-start gap-8 justify-center reveal-text">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#apply"
                    className="h-12.5 rounded-full bg-white text-black flex items-center justify-center px-8 hover:bg-white/90 transition-colors uppercase text-xs tracking-widest font-bold"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#apply"
                    className="h-12.5 rounded-full border border-white/20 text-white flex items-center justify-center px-8 hover:bg-white/10 hover:border-white/40 transition-colors uppercase text-xs tracking-widest font-bold"
                  >
                    Specialist Pool
                  </a>
                </div>

                <div className="flex gap-4 items-center pl-2">
                  <div className="w-px h-12 bg-white/20" />
                  <div className="flex flex-col gap-1">
                    <span className="text-white/50 text-md tracking-widest uppercase font-medium">
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

        {/* ── 3 WAYS TO JOIN ── */}
        <section className="px-gutter py-[15vh] bg-white/2 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal-text">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
                3 WAYS TO JOIN
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-group">
              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 01
                </div>
                <h3 className="text-2xl font-bold mb-4">Employee</h3>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  For people who want to build long-term and carry responsibility.
                </p>
              </div>

              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 02
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Freelancer / Interim
                </h3>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  For professionals who deliver at a high level for defined scopes — clean standards, clear ownership.
                </p>
              </div>

              <div className="stagger-item border border-white/10 p-10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 bg-black/40">
                <div className="text-md tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">
                  Path 03
                </div>
                <h3 className="text-2xl font-bold mb-4">Specialist Pool</h3>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  For selected experts we activate on demand (project-based, NDA-ready).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO WE'RE LOOKING FOR ── */}
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

            <div className="flex-1 border border-white/10 p-10 md:p-16 bg-white/2 stagger-group">
              <ul className="flex flex-col gap-6 text-lg md:text-xl font-light text-white/80 tracking-wide">
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  think in outcomes (not tasks)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  communicate cleanly (no fog, no ego)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  document properly (transferable, auditable)
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  keep quality under pressure
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  live discretion as a reflex
                </li>
                <li className="stagger-item flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  can be different — without losing foundation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── ROLES BY PILLAR (ACCORDION) ── */}
        <section className="px-gutter py-[15vh]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 reveal-text text-center">
              <span className="text-md tracking-[0.5em] uppercase text-white/30 font-medium block mb-4">
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
                  className="stagger-item border-b border-white/10 group"
                >
                  <button
                    onClick={() =>
                      setOpenPillar(openPillar === i ? null : i)
                    }
                    className="w-full py-8 md:py-12 flex items-center justify-between text-left focus:outline-none"
                  >
                    <div className="flex items-start md:items-center pr-4 md:pr-8 flex-1">
                      <span className="text-2xl md:text-4xl font-light text-white/20 group-hover:text-gold transition-colors w-12 md:w-20 shrink-0">
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
                    <div className="pl-0 md:pl-20 flex flex-col md:flex-row gap-12 pt-4">
                      <div className="flex-1">
                        <h4 className="text-md tracking-[0.2em] text-gold uppercase mb-6 font-bold">
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
                        <h4 className="text-md tracking-[0.2em] text-white/40 uppercase mb-4 font-bold">
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
        <section className="px-gutter py-[15vh]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* What you'll find */}
            <div className="reveal-text">
              <h2 className="text-4xl text-white font-bold mb-10 tracking-tight">
                WHAT YOU&apos;LL FIND HERE
              </h2>
              <ul className="flex flex-col gap-6 font-light text-2xl text-white/90">
                <li className="flex justify-between  border-b border-white/10 pb-4">
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

            {/* Application Process */}
            <div className="reveal-text p-10 md:p-14 bg-white text-black">
              <h2 className="text-3xl font-bold mb-10 tracking-tight">
                APPLICATION PROCESS
              </h2>

              <div className="flex flex-col gap-10 relative">
                <div className="absolute left-3.75 top-6 bottom-4 w-0.5 bg-black/10" />

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
            </div>
          </div>
        </section>

        {/* ── APPLICATION FORM ── */}
        <section id="apply" className="px-gutter py-[15vh] bg-[#050505]">
          <div className="max-w-3xl mx-auto reveal-text">
            <div className="mb-16">
              <span className="text-md tracking-[0.5em] uppercase text-gold font-medium block mb-4">
                INITIATE
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">
                APPLICATION
              </h2>
              <p className="text-white/60 font-light text-lg">
                Keep it clear and proof-based. If there&apos;s a fit, we&apos;ll
                reach out.
              </p>
            </div>

            <form
              className="flex flex-col gap-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    First &amp; Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Email / Phone *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Country / City / Time Zone
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Continent / Region
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                  Languages (Select / Free text)
                </label>
                <input
                  type="text"
                  placeholder="e.g. English (Native), German (Fluent)"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/20 focus:border-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Work Model
                  </label>
                  <select
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
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Travel Readiness
                  </label>
                  <select
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue="project"
                  >
                    <option value="yes" className="text-black">Yes</option>
                    <option value="no" className="text-black">No</option>
                    <option value="project" className="text-black">Project-dependent</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
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

              <div className="flex flex-col gap-3">
                <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                  Pillars of Interest (Multi-select) &amp; Desired Role(s)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pillar G - Copywriter"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/20 focus:border-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    LinkedIn / Website
                  </label>
                  <input
                    type="url"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Portfolio / Proof Links (Max 3)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                  CV Upload or Profile Link
                </label>
                <input
                  type="text"
                  placeholder="URL or Upload Link"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-white/20 focus:border-gold transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Availability (Start date / Hrs per week)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                    Salary range or Day rate (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium placeholder-transparent focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-md uppercase tracking-widest text-gold font-bold">
                  Foundation Fit (Required) *
                </label>
                <p className="text-md text-white/30 mb-2">
                  2–3 sentences on truth, responsibility, justice, compassion,
                  discretion, and excellence.
                </p>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-gold/30 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-md uppercase tracking-widest text-white/50 font-bold">
                  Short Message (Optional)
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl font-medium focus:border-gold transition-colors resize-none"
                />
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col items-center sm:items-start gap-6">
                <button
                  type="button"
                  data-magnetic
                  className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 overflow-hidden w-max mt-8"
                  onClick={() => alert("Thank you. If there’s a fit, we’ll reach out with next steps.")}
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-md group-hover:text-white transition-colors duration-300">
                    Submit Application
                  </span>
                  <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[30] transition-transform duration-500 ease-out origin-center" />
                </button>
                <span className="text-md text-white/70 tracking-widest uppercase text-center sm:text-left">
                  Thank you. If there’s a fit, we’ll reach out with next steps. <br />
                  Your submission is confidential.
                </span>
              </div>
            </form>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
