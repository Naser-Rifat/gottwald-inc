export interface ProjectTheme {
  background: string;
  text: string;
  accent: string;
}

/** A single content block that populates one horizontal-scroll panel */
export interface ContentBlock {
  type: "showcase" | "case-study" | "feature" | "stats" | "fullbleed" | "rich-text";
  heading?: string;
  body?: string; // plain text or sanitized HTML from rich text editor
  image?: string; // optional override image for this panel
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
  theme?: "dark" | "light";
  richText?: ContentBlock[];
}

export interface Offer {
  title: string;
  tier: "copper" | "silver" | "gold";
  description: string;
  deliverable: string;
}

export interface Project {
  slug: string;
  title: string;
  tags: string[];
  image: string;
  description: string;
  details: string;
  services: string[];
  recognitions?: string[];
  launchUrl?: string;
  theme: ProjectTheme;
  /** Dynamic content panels (Panels 2–5). Falls back to hardcoded layout if empty. */
  contentBlocks?: ContentBlock[];
  /** Service tier offers to be displayed within the pillar */
  offers?: Offer[];
}

export const projects: Project[] = [
  {
    slug: "it-solutions-2030",
    title: "IT Solutions 2030",
    tags: ["TECHNOLOGY", "SME TRANSFORMATION"],
    image: "/assets/projects/it-solutions-2030-clean.png",
    launchUrl: "https://google.com/",
    description:
      "Transforming Websites into Future-Ready Digital Infrastructure.",
    details:
      "IT Solutions 2030 helps SMEs transition from outdated websites to future-ready digital infrastructure. Core product: Homepage Transformation — supported by automation, AI analysis, and structured project delivery. Digital power should not only belong to global corporations.",
    services: [
      "Homepage Transformation",
      "Performance Optimization",
      "AI-Readable Architecture",
      "Automated Proposals",
    ],
    theme: {
      background: "#040D0F",
      text: "#F5F5F5",
      accent: "#C9A84C",
    },
    offers: [
      {
        title: "Foundation Blueprint",
        tier: "copper",
        description: "Essential architecture for modern web presence. Lean, fast, and structured for future scalability.",
        deliverable: "Digital presence audit + technical roadmap",
      },
      {
        title: "Growth Engine",
        tier: "silver",
        description: "Full implementation of AI-readable architecture with automated proposal systems.",
        deliverable: "Next.js migration + CRM integration + workflow automation",
      },
      {
        title: "Market Dominance",
        tier: "gold",
        description: "High-end engineered platform with maximum performance, bespoke design, and ongoing strategic alignment.",
        deliverable: "Awwwards-level custom build + dedicated strategic advisory",
      },
    ],
  },
  {
    slug: "solution-finder",
    title: "SolutionFinder & Management",
    tags: ["STRATEGY", "CLARITY"],
    image: "/assets/projects/solution-finder-scifi.png",
    launchUrl: "https://google.com/",
    description: "Every Complex Situation Has a Structure.",
    details:
      "When people, processes, technology and decisions interact, complexity becomes inevitable. SolutionFinder creates clarity through structured analysis. Solution Management drives resolution — a situation is solved when it no longer creates operational friction.",
    services: [
      "Structured Analysis",
      "Root Cause Diagnostics",
      "Implementation Support",
      "Systemic Resolution",
    ],
    contentBlocks: [
      {
        type: "rich-text",
        theme: "light",
        heading: "Deconstructing Complexity",
        body: "<p>When people, processes, technology and decisions interact, complexity becomes inevitable. SolutionFinder creates clarity through structured analysis.</p>",
        image: "/assets/projects/solution-finder-scifi.png",
      },
      {
        type: "rich-text",
        theme: "dark",
        heading: "The Framework",
        body: "<h3>Phase 1: Diagnostics</h3><p>We do not treat symptoms. We isolate the exact operational bottlenecks causing friction in your organization.</p><h3>Phase 2: Resolution</h3><p>A structured blueprint is implemented. A situation is truly solved only when it requires zero daily mental energy from ownership.</p>",
      },
      {
        type: "rich-text",
        theme: "dark",
        image: "/assets/projects/solution-finder-scifi.png",
      }
    ],
    theme: {
      background: "#121212",
      text: "#F5F5F5",
      accent: "#A8B4B8",
    },
    offers: [
      {
        title: "Rapid Diagnostics",
        tier: "copper",
        description: "A focused assessment to isolate the root causes of operational friction within 2 weeks.",
        deliverable: "Root cause analysis report + priority matrix",
      },
      {
        title: "Structured Resolution",
        tier: "silver",
        description: "Full diagnostic and implementation of a structured resolution blueprint.",
        deliverable: "End-to-end resolution plan + 90-day implementation support",
      },
      {
        title: "Systemic Transformation",
        tier: "gold",
        description: "Deep organizational redesign eliminating all recurring friction at the system level.",
        deliverable: "Complete restructuring + ongoing advisory for 12 months",
      },
    ],
  },
  {
    slug: "consulting",
    title: "Consulting",
    tags: ["LEADERSHIP", "SCALE"],
    image: "/assets/projects/consulting.png",
    launchUrl: "https://google.com/",
    description: "Strategic roadmap, systems, execution at scale.",
    details:
      "Consulting focuses on future development — strengthening strategy, optimizing structures, and building scalable systems. It is the natural next step after SolutionFinder resolves the immediate situation. Not a service — a partnership.",
    services: [
      "Strategy Architecture",
      "Organizational Design",
      "Executive Alignment",
      "Scalable Systems",
    ],
    contentBlocks: [
      {
        type: "rich-text",
        theme: "dark",
        heading: "Scalable Execution",
        body: "<p>Consulting focuses on future development — strengthening strategy, optimizing structures, and building scalable systems.</p>",
        image: "/assets/projects/consulting-management-hero.png",
      },
      {
        type: "rich-text",
        theme: "light",
        heading: "The Next Step",
        body: "<p>It is the natural next step after SolutionFinder resolves the immediate situation. Not a service — a partnership.</p><ul><li>100% Executive Alignment</li><li>0 Strategic Ambiguity</li></ul>",
      }
    ],
    theme: {
      background: "#0A0A0A",
      text: "#F5F5F5",
      accent: "#C9A84C",
    },
    offers: [
      {
        title: "Strategic Assessment",
        tier: "copper",
        description: "A focused strategy audit with clear recommendations for structural improvement.",
        deliverable: "Strategic assessment report + executive summary",
      },
      {
        title: "Architecture & Alignment",
        tier: "silver",
        description: "Full organizational strategy design with executive alignment workshops.",
        deliverable: "Strategy blueprint + 6-month execution plan",
      },
      {
        title: "Enterprise Partnership",
        tier: "gold",
        description: "Retained strategic advisory with hands-on organizational design and scaling systems.",
        deliverable: "Quarterly strategic reviews + permanent advisory seat",
      },
    ],
  },
  {
    slug: "coaching-mentoring",
    title: "Coaching & Mentoring",
    tags: ["PERFORMANCE", "HOLISTIC"],
    image: "/assets/projects/coaching-mentoring.png",
    launchUrl: "https://google.com/",
    description: "Clarity that lasts. Impact that holds.",
    details:
      "We do not do standard coaching. We build people to a level they can sustain. Holistic. Precise. Deep. Executable. Ancient mastery meets modern methods. State → Identity → Behavior → Impact. That is the order. And that is the difference.",
    services: [
      "Executive Coaching",
      "State & Energy Regulation",
      "Identity & Decision Strength",
      "Performance Integration",
    ],
    theme: {
      background: "#1A0F0A",
      text: "#F5F5F5",
      accent: "#B87333",
    },
  },
  {
    slug: "marketing-communication",
    title: "Marketing & Communication",
    tags: ["VISIBILITY", "DEMAND"],
    image: "/assets/projects/marketing-communication.png",
    launchUrl: "https://google.com/",
    description: "Executive Visibility. Engineered Trust. Predictable Demand.",
    details:
      "We are a Visibility & Demand Infrastructure company. When your signal is unclear, you do not lose attention — you lose the right decisions. We build communication systems, engineer trust, and create automation-ready infrastructure that lasts.",
    services: [
      "Positioning & Messaging",
      "Authority Architecture",
      "SEO & AI Indexing",
      "Content Engine",
    ],
    contentBlocks: [],

    theme: {
      background: "#040D0F",
      text: "#F5F5F5",
      accent: "#00C8D4",
    },
  },
  {
    slug: "relocation",
    title: "Relocation & Strategic Deployment",
    tags: ["STRATEGY", "POSITIONING", "GEORGIA"],
    image: "/assets/projects/relocation.png",
    launchUrl: "https://google.com/",
    description: "Deploy your company structure. Upgrade your operational reality.",
    details:
      "Georgia is the strategic midpoint between East & West — globally connected, execution-friendly, and capable of combining the best of two worlds: international accessibility with pragmatic speed. We engineer a defensible structure for companies, holding setups, and high-responsibility profiles. Delivered under one standard, through one accountable system.",
    services: [
      "Corporate / Holding Setup",
      "Executive Residency",
      "Tax Coordination",
      "Banking Readiness",
      "Operational Continuity",
      "Compliance Hygiene",
    ],
    contentBlocks: [
      {
        type: "rich-text",
        theme: "light",
        heading: "Strategic Deployment",
        body: "<p>Relocation becomes expensive when it's treated like logistics. For companies and executives, this is Strategic Deployment: </p><ul><li>Positioning > Leaving</li><li>Substance > Registering</li><li>Defensibility > Optimization</li><li>Banking Readiness > Opening an account</li></ul><p>Outcome: A structure you can explain, defend, operate — and scale.</p>",
        image: "/assets/projects/relocation.png",
      },
      {
        type: "rich-text",
        theme: "dark",
        heading: "The Midpoint Advantage",
        body: "<h3>Why Georgia?</h3><p>Georgia is a true strategic junction: markets, cultures, and operational realities converge here. This creates true optionality — not just a new address.</p><ul><li><strong>Speed + Pragmatism:</strong> Execution is faster when sequencing is correct.</li><li><strong>Connectivity:</strong> Modern mindset and growling infrastructure.</li><li><strong>Tax Efficiency:</strong> Defensible architecture, not just a rate.</li></ul>",
      },
      {
        type: "rich-text",
        theme: "light",
        heading: "How It Works",
        body: "<h3>1. Structure Deployment Assessment</h3><p>We map current state & target state. You gain clarity on country fit, sequencing, and banking feasibility.</p><h3>2. Blueprint</h3><p>We define the exact execution order: what first, what next, and what never happens out of order.</p><h3>3. Execution + Maintenance</h3><p>Local delivery through licensed partners, orchestrated by us. Clean, consistent, and defensible.</p>",
      },
      {
        type: "rich-text",
        theme: "dark",
        heading: "Built for Outcomes",
        body: "<ul><li><strong>Defensibility > Hype</strong></li><li><strong>Reality > Promises</strong></li><li><strong>Bankability > Theory</strong></li><li><strong>Substance > Paperwork</strong></li></ul><p>Delivered with a network that's already aligned: best-of-the-best, licensed, and delivery-proven.</p>",
        image: "/assets/projects/relocation.png",
      },
    ],
    theme: {
      background: "#08060A",
      text: "#F5F5F5",
      accent: "#C9A84C",
    },
  },
  {
    slug: "digital-it-architect",
    title: "Digital IT Architect",
    tags: ["AI ADVISORY", "CONSULTATION"],
    image: "/assets/projects/digital-it-architect.png",
    launchUrl: "https://google.com/",
    description: "AI-guided consultation. Your digital intention, structured.",
    details:
      "An AI-guided consultation interface — the entry point for IT Solutions 2030. Captures business goals, digital challenges, target audiences, and growth plans. Produces a Digital Intention Profile describing what your company actually needs from its digital presence.",
    services: [
      "AI Consultation Interface",
      "Digital Intention Profile",
      "Needs Discovery",
      "Transformation Blueprint",
    ],
    theme: {
      background: "#040D0F",
      text: "#F5F5F5",
      accent: "#1B4F5A",
    },
  },
  {
    slug: "yig-care",
    title: "YIG.CARE",
    tags: ["FREQUENCY", "WELLNESS"],
    image: "/assets/projects/yig-care.png",
    launchUrl: "https://google.com/",
    description: "Your Inner Glow. And we care about it.",
    details:
      "YIG.CARE was born from genuine curiosity — frequencies, sound, vibration, voice, light. Technologies that do not entertain — they restore order. Built as a website and app ecosystem where frequency work becomes visible, understandable, and usable. Launch: 2026.",
    services: [
      "Frequency Platform",
      "Practitioner Marketplace",
      "Daily Level-Ups",
      "Provider Tools",
    ],
    theme: {
      background: "#030A0D",
      text: "#F5F5F5",
      accent: "#00C8D4",
    },
  },
  {
    slug: "plhh-coin",
    title: "PLHH Coin",
    tags: ["BLOCKCHAIN", "RWA"],
    image: "/assets/projects/plhh-coin.png",
    launchUrl: "https://google.com/",
    description: "Peace, Love & Harmony for more Humanity.",
    details:
      "PLHH_Coin is a Real-World-Assets (RWA) Governance DAO token on the Sui Network — built to restore the living triangle of Nature, Animals, and Humans. We rebuild nature-agriculture so Nature, Animals, and Humans can live. 967 farms disappear every day. We refuse that reality.",
    services: [
      "RWA Governance Token",
      "Farm Preservation",
      "Nature Regeneration",
      "Community DAO",
    ],
    theme: {
      background: "#08060A",
      text: "#F5F5F5",
      accent: "#C9A84C",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (index + 1) % projects.length;
  return projects[nextIndex];
}
