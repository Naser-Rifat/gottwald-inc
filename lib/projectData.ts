export interface ProjectTheme {
  background: string;
  text: string;
  accent: string;
}

/** A single content block that populates one horizontal-scroll panel */
export interface ContentBlock {
  type: "showcase" | "case-study" | "feature" | "stats" | "fullbleed";
  heading?: string;
  body?: string; // plain text or sanitized HTML from rich text editor
  image?: string; // optional override image for this panel
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
  theme?: "dark" | "light";
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
}

export const projects: Project[] = [
  {
    slug: "it-solutions-2030",
    title: "IT Solutions 2030",
    tags: ["TECHNOLOGY", "SME TRANSFORMATION"],
    image: "/assets/projects/it-solutions-2030.png",
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
  },
  {
    slug: "solution-finder",
    title: "SolutionFinder & Management",
    tags: ["STRATEGY", "CLARITY"],
    image: "/assets/projects/solution-finder.png",
    description: "Every Complex Situation Has a Structure.",
    details:
      "When people, processes, technology and decisions interact, complexity becomes inevitable. SolutionFinder creates clarity through structured analysis. Solution Management drives resolution — a situation is solved when it no longer creates operational friction.",
    services: [
      "Structured Analysis",
      "Root Cause Diagnostics",
      "Implementation Support",
      "Systemic Resolution",
    ],
    theme: {
      background: "#121212",
      text: "#F5F5F5",
      accent: "#A8B4B8",
    },
  },
  {
    slug: "consulting",
    title: "Consulting",
    tags: ["LEADERSHIP", "SCALE"],
    image: "/assets/projects/consulting.png",
    description: "Strategic roadmap, systems, execution at scale.",
    details:
      "Consulting focuses on future development — strengthening strategy, optimizing structures, and building scalable systems. It is the natural next step after SolutionFinder resolves the immediate situation. Not a service — a partnership.",
    services: [
      "Strategy Architecture",
      "Organizational Design",
      "Executive Alignment",
      "Scalable Systems",
    ],
    theme: {
      background: "#0A0A0A",
      text: "#F5F5F5",
      accent: "#C9A84C",
    },
  },
  {
    slug: "marketing-communication",
    title: "Marketing & Communication",
    tags: ["VISIBILITY", "DEMAND"],
    image: "/assets/projects/marketing-communication.png",
    description: "Executive Visibility. Engineered Trust. Predictable Demand.",
    details:
      "We are a Visibility & Demand Infrastructure company. When your signal is unclear, you do not lose attention — you lose the right decisions. We build communication systems, engineer trust, and create automation-ready infrastructure that lasts.",
    services: [
      "Positioning & Messaging",
      "Authority Architecture",
      "SEO & AI Indexing",
      "Content Engine",
    ],
    theme: {
      background: "#040D0F",
      text: "#F5F5F5",
      accent: "#00C8D4",
    },
  },
  {
    slug: "coaching-mentoring",
    title: "Coaching & Mentoring",
    tags: ["PERFORMANCE", "HOLISTIC"],
    image: "/assets/projects/coaching-mentoring.png",
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
    slug: "yig-care",
    title: "YIG.CARE",
    tags: ["FREQUENCY", "WELLNESS"],
    image: "/assets/projects/yig-care.png",
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
  {
    slug: "digital-it-architect",
    title: "Digital IT Architect",
    tags: ["AI ADVISORY", "CONSULTATION"],
    image: "/assets/projects/digital-it-architect.png",
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
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (index + 1) % projects.length;
  return projects[nextIndex];
}
