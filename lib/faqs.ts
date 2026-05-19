// Centralized FAQ source for the static (non-pillar) pages. Imported by
// page components (for FAQPage JSON-LD and on-page render) and by
// /llms-full.txt (so AI crawlers can retrieve the full Q&A set in one
// request without crawling every page).
//
// Per-pillar FAQs live in lib/pillarFaqs.ts. The Faq type is owned there
// and re-exported here so callers have a single import surface.

import type { Faq } from "./pillarFaqs";
export type { Faq };

export const aboutFaqs: Faq[] = [
  {
    question: "What is GOTT WALD Holding?",
    answer:
      "GOTT WALD Holding LLC is a standards-led holding company headquartered in Tbilisi, Georgia. It operates as a unified architecture of modular service pillars — including IT Solutions, Consulting, SolutionFinder, Coaching, Marketing, and Relocation — designed to turn complexity into clarity and decisions into measurable impact.",
  },
  {
    question: "Where is GOTT WALD headquartered?",
    answer:
      "GOTT WALD Holding LLC is headquartered in Tbilisi, Georgia — a strategic midpoint between East and West, offering international accessibility with pragmatic speed.",
  },
  {
    question: "What services does GOTT WALD provide?",
    answer:
      "GOTT WALD offers nine structural pillars: IT Solutions 2030 (digital infrastructure), SolutionFinder (structured analysis), Consulting (strategy & scale), Coaching & Mentoring (executive performance), Marketing & Communication (visibility & demand), Relocation (Georgia deployment), Digital IT Architect (AI consultation), YIG.CARE (frequency wellness), and PLHH Coin (RWA governance).",
  },
  {
    question: "What does 'standards-led' mean at GOTT WALD?",
    answer:
      "Standards-led means every service pillar follows a single governance framework — one standard, one language of delivery. Components evolve and markets shift, but the execution standard remains. This ensures repeatability, defensibility, and compounding performance.",
  },
  {
    question: "What is the GOTT WALD approach to solving business complexity?",
    answer:
      "GOTT WALD removes noise until only truth remains, then sequences decisions so they become self-evident. The approach: reveal root cause, define leverage, establish sequence. Solved means solved — felt in real life, not just in a pitch deck.",
  },
];

export const careersFaqs: Faq[] = [
  {
    question: "What kind of roles does GOTT WALD hire for?",
    answer:
      "GOTT WALD recruits across 9 structural pillars: Corporate Services, SolutionFinder, Consulting, Coaching & Mentoring, Relocation, IT Solutions 2030, Marketing & Communication, YIG.CARE, and PLHH. Each pillar needs operators — people who build resilient systems and treat trust, discipline, and delivery as non-negotiable.",
  },
  {
    question: "Where are GOTT WALD jobs located?",
    answer:
      "GOTT WALD is headquartered in Tbilisi, Georgia. Roles may be based in Tbilisi or remote depending on the pillar and function.",
  },
  {
    question: "What is the hiring philosophy at GOTT WALD?",
    answer:
      "Skill matters. Character decides. GOTT WALD selects for alignment with its core values — Peace, Love, Harmony for more Humanity — and its non-negotiable execution standards. Money is not the driver; money is the result of alignment, responsibility, and clean execution.",
  },
];

export const partnershipFaqs: Faq[] = [
  {
    question: "How do I become a partner with GOTT WALD?",
    answer:
      "GOTT WALD selects a limited number of values-aligned partners for its 2030 infrastructure cycles. Apply through the strategic inquiry form on the partnerships page. The process is confidential by default and standards-led by design.",
  },
  {
    question: "What are the partnership requirements?",
    answer:
      "GOTT WALD partners are principals and operators who build resilient systems and treat trust, discipline, and delivery as non-negotiable. The selection is values-first — character over credentials, alignment over volume.",
  },
  {
    question: "Is the partnership process confidential?",
    answer:
      "Yes. GOTT WALD operates discreet by default. Confidentiality is engineered into the framework — not a promise, but a structural guarantee. No public theatrics, clean interfaces, controlled access.",
  },
];
