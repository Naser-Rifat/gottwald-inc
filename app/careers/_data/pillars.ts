/**
 * "Roles by Pillar" architecture data for the careers accordion.
 *
 * Each pillar is a strategic area of the holding (A→I) with a list of
 * role profiles we hire into it and a one-liner that captures the
 * personality profile we're looking for. The page renders these into a
 * sticky-title accordion in `RolesByPillarSection`.
 */
export interface Pillar {
  /** Single-letter index ("A".."I") shown in the accordion header. */
  letter: string;
  /** Full title — pillar name + scope. */
  title: string;
  /** Roles we hire into this pillar. */
  roles: string[];
  /** One-line personality / culture fit ("Impact Profile"). */
  impact: string;
}

export const PILLARS: ReadonlyArray<Pillar> = [
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
    impact:
      "systems thinker, stakeholder-strong, structured, excellent handovers",
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
    impact:
      "performance-obsessed, clean, security-aware, documentation-strong",
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
