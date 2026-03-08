export interface ProjectTheme {
  background: string;
  text: string;
  accent: string;
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
}

export const projects: Project[] = [
  {
    slug: "solution-finder",
    title: "Solution Finder",
    tags: ["CONSULTING", "STRATEGY"],
    image: "/assets/projects/dream-machine.png",
    description: "Root cause. Leverage. Sequence.",
    details:
      "A strategic dissection of your core challenges, mapping the precise sequence of operations required to unblock growth and eliminate friction within the ecosystem.",
    services: ["Diagnostics", "Strategic Positioning", "Risk Analysis"],
    theme: {
      background: "#121212",
      text: "#ffffff",
      accent: "#d4af37",
    },
  },
  {
    slug: "consulting",
    title: "Consulting",
    tags: ["STRUCTURE", "OPERATIONS"],
    image: "/assets/projects/synthetic-human.png",
    description: "Structure that makes decisions inevitable.",
    details:
      "Transforming complex, ambiguous environments into highly structured operational frameworks. We don't advise; we architect paths of least resistance.",
    services: [
      "Process Architecture",
      "Executive Alignment",
      "Decision Frameworks",
    ],
    theme: {
      background: "#b7adfd",
      text: "#101018",
      accent: "#3b2a82",
    },
  },
  {
    slug: "marketing-communication",
    title: "Marketing &\nCommunication",
    tags: ["BRAND", "MEDIA"],
    image: "/assets/projects/spatial-fusion.png",
    description: "Trust infrastructure — not campaigns.",
    details:
      "Building a communication ecosystem grounded in irrefutable reality. We generate authority and trust through exact language and systemic narrative distribution rather than fleeting advertisements.",
    services: [
      "Narrative Architecture",
      "Digital Presence",
      "Authority Building",
    ],
    theme: {
      background: "#1e1332",
      text: "#ffffff",
      accent: "#a970ff",
    },
  },
  {
    slug: "it-solutions-2030",
    title: "IT Solutions 2030",
    tags: ["TECHNOLOGY", "SYSTEMS"],
    image: "/assets/projects/choo-choo-world.png",
    description: "Your website as a growth engine.",
    details:
      "Engineering future-proof digital assets capable of supporting elite-level scale without technical debt. From underlying architecture to front-facing conversion mechanisms.",
    services: ["Web Development", "System Integration", "Data Security"],
    theme: {
      background: "#a5d6a7",
      text: "#1e3a1f",
      accent: "#2e7d32",
    },
  },
  {
    slug: "coaching-mentoring",
    title: "Coaching &\nMentoring",
    tags: ["LEADERSHIP", "PERFORMANCE"],
    image: "/assets/projects/dream-machine.png",
    description: "Sustainable performance from the inside out.",
    details:
      "Fostering alignment between personal capacity and executive demands. Equipping leaders with the frequency and resilience required to command complex ecosystems.",
    services: ["Executive Coaching", "Performance Metrics", "Mindset Tuning"],
    theme: {
      background: "#ead1ce",
      text: "#000000",
      accent: "#8c1e22",
    },
  },
  {
    slug: "structure-deployment",
    title: "Structure\nDeployment",
    tags: ["EXECUTION", "COMPLIANCE"],
    image: "/assets/projects/synthetic-human.png",
    description: "Clean setup. Compliant. Operational from day one.",
    details:
      "The physical application of strategic planning. We embed our frameworks deeply into your operational reality, ensuring total compliance and immediate velocity.",
    services: ["Implementation", "Compliance Audits", "Operational Rollout"],
    theme: {
      background: "#111111",
      text: "#ffffff",
      accent: "#d4af37",
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
