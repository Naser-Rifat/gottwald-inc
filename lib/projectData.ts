export interface ProjectTheme {
  background: string;
  text: string;
  accent: string;
}

/** A single content block that populates one horizontal-scroll panel */
export interface ContentBlock {
  id: string;
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
    description: "Transforming Websites into Future-Ready Digital Infrastructure.",
    details:
      "IT Solutions 2030 helps SMEs transition from outdated websites to future-ready digital infrastructure. Core product: Homepage Transformation — supported by automation, AI analysis, and structured project delivery. Digital power should not only belong to global corporations.",
    services: [
      "Homepage Transformation",
      "Performance Optimization",
      "AI-Readable Architecture",
      "Automated Proposals"
    ],
    contentBlocks: [
      {
        id: "its-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Problem Most Companies Don't See",
        body:
          "Most company websites today are built on yesterday's technology. They are slow, structurally outdated, poorly optimized for search, and not prepared for AI indexing.\n\nSearch engines are evolving. Artificial intelligence is becoming a primary discovery layer. Performance, structure, and data architecture now determine whether a company is visible — or invisible.\n\nFor many small and medium-sized businesses, this shift happens silently in the background. Those who do not modernize their digital infrastructure now will gradually disappear from search results, recommendation systems, and digital discovery over the coming years.",
        image: "/assets/projects/it-solutions-2030-block-1.png"
      },
      {
        id: "its-block-2",
        type: "rich-text",
        theme: "light",
        heading: "Our Mission",
        body:
          "IT Solutions 2030 exists to help companies transition from outdated websites to future-ready digital infrastructure. Our focus is not cosmetic redesign — our focus is digital architecture.\n\nWe rebuild and optimize the technological foundation behind your digital presence so that your business becomes faster, easier to find, optimized for search engines and AI discovery, mobile-first ready, technically scalable, and secure.\n\nAnd most importantly: we make this transformation accessible for small and medium-sized companies. Because digital power should not only belong to global corporations.",
        image: "/assets/projects/it-solutions-2030-block-2.png"
      },
      {
        id: "its-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "What Our Homepage Transformation Includes",
        body:
          "Technical Architecture\nPerformance optimization, fast loading infrastructure, modern web frameworks, scalable backend systems, security and stability.\n\nVisibility & Discoverability\nAdvanced SEO architecture, AI-readable content structures, semantic content hierarchy, geo-optimization, and structured data integration.\n\nPerformance Optimization\nPage speed optimization, lightweight architecture, clean code structure, and server optimization.\n\nMobile-First Infrastructure\nFully responsive design, mobile performance optimization, and device-agnostic architecture.\n\nSystem Scalability\nModular infrastructure, integration capability, and future-ready technical frameworks.",
        image: "/assets/projects/it-solutions-2030-block-3.png"
      },
      {
        id: "its-block-4",
        type: "rich-text",
        theme: "light",
        heading: "Our Structured Transformation Process",
        body:
          "Step 1 — Digital IT Architect Conversation\nA guided interaction that identifies your business goals, market positioning, digital challenges, and growth plans. This creates your Digital Intention Profile.\n\nStep 2 — Website Technical Analysis\nA deep technical scan evaluating loading speed, architecture quality, SEO readiness, AI indexing compatibility, and mobile structure — creating your Technical Reality Profile.\n\nStep 3 — Transformation Blueprint\nWe combine both profiles to clearly show what works, what limits growth, and what opportunities exist.\n\nStep 4 — Personalized Proposal\nA clear transformation proposal with recommended improvements, scope, timeline, and transparent pricing. No obligation — just clarity.\n\nStep 5 — Implementation\nOur project managers and development teams handle the full implementation from architecture to launch. Structured. Efficient. Transparent.",
        image: "/assets/projects/it-solutions-2030-block-4.png"
      }
    ],
    theme: { background: "#040D0F", text: "#F5F5F5", accent: "#C9A84C" }
  },

  {
    slug: "solutionfinder-solution-management",
    title: "SolutionFinder & Solution Management",
    tags: ["STRATEGY", "COMPLEXITY RESOLUTION"],
    image: "/assets/projects/solutionfinder-clean.png",
    launchUrl: "https://google.com/",
    description:
      "Every complex situation has a structure. Once it's visible, solutions become possible.",
    details:
      "SolutionFinder creates clarity through structured analysis of complex environments — examining leadership dynamics, organizational structures, operational processes, technology, and economic frameworks. Solution Management drives resolution, supporting implementation until the situation no longer creates operational friction. Clients choose the depth of collaboration.",
    services: [
      "Structured Situation Analysis",
      "Root Cause Identification",
      "Solution Path Definition",
      "Implementation & Stabilization"
    ],
    contentBlocks: [
      {
        id: "sf-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "Complexity Rarely Has a Single Cause",
        body:
          "Most challenges today do not originate from one isolated issue. They arise where multiple elements interact: leadership and decision structures, operational processes, technology and infrastructure, communication and stakeholder dynamics, and economic and contractual realities.\n\nEach element may function independently. But together they can create friction. This is the moment when organizations realize that the situation requires structured external thinking.",
        image: "/assets/projects/solutionfinder-solution-management-block-1.png"
      },
      {
        id: "sf-block-2",
        type: "rich-text",
        theme: "light",
        heading: "SolutionFinder — Strategic Clarity",
        body:
          "The SolutionFinder is a structured analysis process designed to understand complex environments and identify the real causes behind a situation. Instead of focusing on symptoms, we examine how the entire system behind a situation actually functions.\n\nAfter completing a SolutionFinder process, clients gain clarity about:\n- The real drivers behind the situation\n- Possible strategic options\n- Realistic solution paths\n- Decisions that create measurable impact\n\nClarity changes the quality of decisions. And better decisions create better outcomes.",
        image: "/assets/projects/solutionfinder-solution-management-block-2.png"
      },
      {
        id: "sf-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "Solution Management — From Clarity to Resolution",
        body:
          "While the SolutionFinder creates clarity, Solution Management focuses on resolving the situation. When clients decide to continue the collaboration, we support the structured implementation of the solution.\n\nDepending on the situation, this may include structuring complex initiatives, resolving operational friction, coordinating stakeholders, guiding transformation processes, and supporting implementation phases.\n\nOur objective remains consistent: a situation is considered solved when it no longer creates operational friction.",
        image: "/assets/projects/solutionfinder-solution-management-block-3.png"
      },
      {
        id: "sf-block-4",
        type: "rich-text",
        theme: "light",
        heading: "The Five Principles of Our Work",
        body:
          "Clarity Before Action\nCorrect diagnosis determines solution quality.\n\nRoot Cause Thinking\nWe address underlying causes rather than symptoms.\n\nSystemic Perspective\nPeople, processes, and technology always interact.\n\nImplementation Focus\nSolutions must work in real environments.\n\nPartnership\nWe work with our clients — not beside them.",
        image: "/assets/projects/solutionfinder-solution-management-block-4.png"
      }
    ],
    theme: { background: "#0B0F14", text: "#F5F5F5", accent: "#4A7FA5" }
  },

  {
    slug: "consulting",
    title: "Consulting",
    tags: ["STRATEGIC CLARITY", "LEADERSHIP"],
    image: "/assets/projects/consulting-clean.png",
    launchUrl: "https://google.com/",
    description: "Strategic clarity for leaders who carry real responsibility.",
    details:
      "At a certain level of leadership, complexity quietly replaces clarity. Our consulting work partners directly with founders, CEOs, and leadership teams to restore the structural precision behind performance — clarifying strategic direction, simplifying decision architecture, and restoring leadership alignment. Not generic frameworks. Deep understanding of how organizations actually operate.",
    services: [
      "Strategic Clarity Sessions",
      "Decision Architecture",
      "Leadership Alignment",
      "Strategic Transformation"
    ],
    contentBlocks: [
      {
        id: "con-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Hidden Weight of Complexity",
        body:
          "Leadership at scale often looks very different from the outside than it feels from within. From the outside, organizations appear stable, structured, and successful. Inside the leadership circle, however, complexity increases.\n\nEvery decision carries greater consequences. Every strategic move affects people, capital, and long-term direction. And over time, leadership energy becomes fragmented — decisions take longer, strategic focus becomes diluted, and execution loses the speed it once had.\n\nNot because the organization is weak. But because complexity has quietly grown faster than clarity.",
        image: "/assets/projects/consulting-block-1.png"
      },
      {
        id: "con-block-2",
        type: "rich-text",
        theme: "light",
        heading: "Our Consulting Philosophy",
        body:
          "True consulting is not about giving advice. Advice is easy. Real consulting means helping leadership strengthen the system that determines how an organization thinks, decides, and executes.\n\nThis requires three elements:\n\nIntellectual Precision\nUnderstanding complex organizational systems quickly and accurately.\n\nHuman Understanding\nRecognizing that organizations are built and led by people.\n\nOperational Realism\nEnsuring strategies survive contact with reality.\n\nWithout these elements consulting becomes theory. With them, transformation becomes possible.",
        image: "/assets/projects/consulting-block-2.png"
      },
      {
        id: "con-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "The Five Principles of Our Work",
        body:
          "Strategic Clarity\nOrganizations rarely suffer from lack of ideas — they suffer from unclear priorities. We help leadership sharpen direction until execution becomes obvious.\n\nStructural Intelligence\nDecision architecture, incentives, and leadership design shape performance. We redesign systems so progress becomes natural.\n\nLeadership Alignment\nFragmented leadership energy slows organizations down. We help leaders regain shared clarity about direction and responsibility.\n\nIntellectual Honesty\nStrong organizations grow through truth, not comfort. We address the questions others hesitate to raise — respectfully but directly.\n\nResponsibility For Outcomes\nIdeas alone change nothing. Our work continues until clarity translates into real operational progress.",
        image: "/assets/projects/consulting-block-3.png"
      },
      {
        id: "con-block-4",
        type: "rich-text",
        theme: "light",
        heading: "Engagement Models",
        body:
          "Strategic Clarity Session\nA focused 90–120 minute deep-dive designed to analyze your situation and identify the most important leverage points. Confidential discussion with leadership.\n\nAdvisory Partnership\nOngoing collaboration with founders or leadership teams navigating strategic complexity — covering strategic direction, leadership alignment, decision architecture, and structural clarity during growth phases.\n\nStrategic Transformation\nDeep consulting engagement during major transformation phases — organizational scaling, leadership architecture redesign, strategic repositioning, or complex growth transitions.",
        image: "/assets/projects/consulting-block-4.png"
      }
    ],
    theme: { background: "#0D0D0D", text: "#F5F5F5", accent: "#B8A88A" }
  },

  {
    slug: "marketing-communication",
    title: "Marketing & Communication",
    tags: ["VISIBILITY", "DEMAND INFRASTRUCTURE"],
    image: "/assets/projects/marketing-communication-clean.png",
    launchUrl: "https://google.com/",
    description: "Executive Visibility. Engineered Trust. Predictable Demand.",
    details:
      "We are a Visibility & Demand Infrastructure company. We build a premium communication operating system that makes your company read as inevitable — translating value into a structure that is instantly understood, premium without arrogance, and built for trust and decision-speed.",
    services: [
      "Signal Audit & Positioning",
      "Executive Messaging Blueprint",
      "Visibility & SEO/AI Architecture",
      "Content Engine & Automation"
    ],
    contentBlocks: [
      {
        id: "mc-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Problem: Your Market Signal Isn't Matching Your Level",
        body:
          "Most premium businesses don't lose because they aren't good. They lose because they're not clearly understood at first glance.\n\nCommon symptoms: your website is fine but not authority. Your message is too broad, too technical, or too complex. Content feels like effort, not leverage. You attract attention — but not the right decision-makers. Leads happen, but not predictably.\n\nExecutive truth: When your signal is unclear, you lose the right decisions.",
        image: "/assets/projects/marketing-communication-block-1.png"
      },
      {
        id: "mc-block-2",
        type: "rich-text",
        theme: "light",
        heading: "Agency Output vs. Our Operating System",
        body:
          "There is a fundamental difference between what agencies deliver and what we build:\n- Agencies create content. We build communication systems.\n- Agencies chase reach. We engineer trust and decision-speed.\n- Agencies deliver assets. We deliver automation-ready infrastructure.\n\nMarketing isn't content. Marketing is leadership — at scale.",
        image: "/assets/projects/marketing-communication-block-2.png"
      },
      {
        id: "mc-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "What You Get — Outcomes That Change the Game",
        body:
          "Positioning That Lands Instantly\nA category statement that clarifies in seconds.\n\nMessaging That Sells Without Pressure\nOne coherent executive language across website, pitch, social, and video.\n\nProof & Authority Architecture\nWe structure evidence so you need less explaining and do more closing.\n\nVisibility Built for the Next Decade\nSEO and AI indexing foundations that keep you discoverable.\n\nA Content Engine Without Burnout\nSeries, hooks, templates, and distribution as a system.",
        image: "/assets/projects/marketing-communication-block-3.png"
      },
      {
        id: "mc-block-4",
        type: "rich-text",
        theme: "light",
        heading: "Our Process — 5 Steps",
        body:
          "1 — Signal Audit & Reality Check\n2 — Executive Messaging Blueprint\n3 — Visibility Architecture\n4 — Production Sprint\n5 — Stabilize & Scale\n\nWe turn communication into a reliable operating system.",
        image: "/assets/projects/marketing-communication-block-4.png"
      }
    ],
    theme: { background: "#080A0E", text: "#F5F5F5", accent: "#C0392B" }
  },

  {
    slug: "coaching-mentoring",
    title: "Coaching & Mentoring",
    tags: ["HUMAN PERFORMANCE", "TRANSFORMATION"],
    image: "/assets/projects/coaching-mentoring-clean.png",
    launchUrl: "https://google.com/",
    description: "Clarity that lasts. Impact that holds.",
    details:
      "A master system for people who want more than better performance. We integrate state, identity, and behavior — because sustainable change happens when all three align.",
    services: [
      "High-Precision Coaching",
      "Deep Long-Term Mentoring",
      "Corporate & Executive Programs",
      "Nervous System & Performance Regulation"
    ],
    contentBlocks: [
      {
        id: "cm-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Standard We Set",
        body:
          "Some coaches work on thinking. Others work on behavior. Others work on the body. We integrate all of it — because a human is a system.\n\nState → Identity → Behavior → Impact. That's our order.\n\nSometimes it's not lack of strategy — it's nervous system, breath, and language. And sometimes it's not lack of discipline — it's identity, boundaries, and execution.",
        image: "/assets/projects/coaching-mentoring-block-1.png"
      },
      {
        id: "cm-block-2",
        type: "rich-text",
        theme: "light",
        heading: "The 3 Layers of Our System",
        body:
          "Layer 1 — Being & Direction\nIdentity, values, meaning, inner truth.\n\nLayer 2 — State & Energy\nNervous system, breath, presence, focus, regulation.\n\nLayer 3 — Expression & Execution\nCommunication, impact, decisions, structure, performance.",
        image: "/assets/projects/coaching-mentoring-block-2.png"
      },
      {
        id: "cm-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "The 12 Levers — In the Right Order",
        body:
          "1. Consciousness & Being\n2. Energy / Frequency State\n3. Nervous System & Stress Regulation\n4. Breath & Focus\n5. Posture & Embodiment\n6. Movement\n7. Hydration / Electrolytes\n8. Nutrition\n9. Language & Voice\n10. Nonverbal Impact\n11. Inner Programs & Patterns\n12. Decision & Execution",
        image: "/assets/projects/coaching-mentoring-block-3.png"
      },
      {
        id: "cm-block-4",
        type: "rich-text",
        theme: "light",
        heading: "How We Work — 5 Stages",
        body:
          "Stage 1 — Diagnosis & Truth Moment\nStage 2 — State & Stability\nStage 3 — Identity & Line\nStage 4 — Execution & Performance\nStage 5 — Integration & Holding the Level",
        image: "/assets/projects/coaching-mentoring-block-4.png"
      }
    ],
    theme: { background: "#0A0A0A", text: "#F5F5F5", accent: "#7D6B4F" }
  },

  {
    slug: "relocation",
    title: "RELocation — Structure Deployment",
    tags: ["GEORGIA", "CORPORATE STRUCTURE"],
    image: "/assets/projects/relocation-clean.png",
    launchUrl: "https://google.com/",
    description:
      "Georgia as your Central Node between East & West. Deploy your structure. Upgrade your operational reality.",
    details:
      "We engineer defensible structures for companies, holding setups, and high-responsibility profiles — not logistics. Key People Residency, Corporate/Holding Setup, Tax Coordination, Compliance, Banking Readiness, and Operational Continuity.",
    services: [
      "Corporate & Holding Structure Deployment",
      "Key People Residency",
      "Tax Coordination & Efficiency",
      "Banking Readiness & Compliance"
    ],
    contentBlocks: [
      {
        id: "rel-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "What This Really Is — Strategic Deployment",
        body:
          "Relocation becomes expensive when it's treated like logistics.\n\nYou're not leaving — you're positioning.\nYou're not registering — you're building substance.\nYou're not optimizing taxes — you're creating defensible tax efficiency.\nYou're not opening a bank account — you're achieving banking readiness.\n\nOutcome: A structure you can explain, defend, operate — and scale.",
        image: "/assets/projects/relocation-block-1.png"
      },
      {
        id: "rel-block-2",
        type: "rich-text",
        theme: "light",
        heading: "Why Georgia — The Central Node Between East & West",
        body:
          "The Midpoint Advantage\nGeorgia is a strategic junction where markets, cultures, and operational realities converge.\n\nSpeed & Pragmatism\nMany processes can be more direct when sequencing is correct.\n\nTax Efficiency — Only When Built as a System\nThe value is a defensible architecture: Residency + Substance + Compliance + Banking Readiness + Cross-Border Coordination.",
        image: "/assets/projects/relocation-block-2.png"
      },
      {
        id: "rel-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "What We Deploy — End-to-End or Modular",
        body:
          "A — Corporate / Holding Structure Deployment\nB — Key People Residency\nC — Tax Coordination & Efficiency\nD — Banking Readiness\nE — Operational Continuity\nF — Maintenance & Compliance Hygiene",
        image: "/assets/projects/relocation-block-3.png"
      },
      {
        id: "rel-block-4",
        type: "rich-text",
        theme: "light",
        heading: "How It Works — 3 Steps",
        body:
          "Step 1 — Structure Deployment Assessment\nMap current state to target state and risks.\n\nStep 2 — Blueprint\nDefine exact execution order.\n\nStep 3 — Execution + Maintenance\nLocal delivery through licensed partners, then compliance hygiene and renewals.",
        image: "/assets/projects/relocation-block-4.png"
      }
    ],
    theme: { background: "#090C10", text: "#F5F5F5", accent: "#3A7D44" }
  },

  {
    slug: "yig-care",
    title: "YIG.CARE",
    tags: ["WELLNESS TECH", "FREQUENCY & RESONANCE"],
    image: "/assets/projects/yig-care-clean.png",
    launchUrl: "https://google.com/",
    description: "Your Inner Glow. And we care about it.",
    details:
      "YIG.CARE is a platform and app ecosystem (iOS & Android) built to make frequency work — sound, vibration, voice, light, and regenerative technologies — visible, understandable, and usable.",
    services: [
      "User Discovery & Booking Platform",
      "Provider Visibility & Management",
      "Daily Energy Field Level-Ups",
      "Partner & Co-Creator Network"
    ],
    contentBlocks: [
      {
        id: "yig-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Name Is the Message",
        body:
          "YIG.CARE stands for Your Inner Glow — and we care about it.\n\nThat inner glow is often covered by pressure, overstimulation, and inner noise.\n\nYIG.CARE is a counter-movement: reconnection, grounding, resonance.",
        image: "/assets/projects/yig-care-block-1.png"
      },
      {
        id: "yig-block-2",
        type: "rich-text",
        theme: "light",
        heading: "A Platform That Helps People Feel Again",
        body:
          "YIG.CARE is built as a website and app ecosystem.\n\nFor Users\nSearch, discover providers, and book directly.\n\nFor Providers & Entrepreneurs\nRegister, become visible, publish programs, and manage bookings in one system.",
        image: "/assets/projects/yig-care-block-2.png"
      },
      {
        id: "yig-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "Fair Access — Resonance Instead of Barriers",
        body:
          "No base fee for users.\nNo base fee for providers for placement and visibility.\n\nThe platform sustains through transparent transaction service fees paid by providers.\n\nDaily Level-Ups — for $1 a day.",
        image: "/assets/projects/yig-care-block-3.png"
      },
      {
        id: "yig-block-4",
        type: "rich-text",
        theme: "light",
        heading: "We Open the Circle — Join as a Co-Creator",
        body:
          "YIG.CARE is designed as a movement, not a solo project.\n\nWe seek co-creators across frequency and health-tech, practitioners, brands, infrastructure partners, and aligned contributors.\n\nLaunch 2026.",
        image: "/assets/projects/yig-care-block-4.png"
      }
    ],
    theme: { background: "#07080F", text: "#F5F5F5", accent: "#8A5CF6" }
  },

  {
    slug: "plhh-coin",
    title: "PLHH_Coin",
    tags: ["WEB3", "REAL-WORLD ASSETS"],
    image: "/assets/projects/plhh-coin-clean.png",
    launchUrl: "https://google.com/",
    description:
      "Peace, Love & Harmony for more Humanity. We rebuild Nature-agriculture — so Nature, Animals, and Humans can live.",
    details:
      "PLHH_Coin is a Real-World-Assets Governance DAO token on the Sui Network built to restore the living triangle of Nature–Animals–Humans.",
    services: [
      "RWA Governance (DAO on Sui)",
      "Farm & Agriculture Restoration",
      "Nature & Biodiversity Regeneration",
      "Community Project Submission & Voting"
    ],
    contentBlocks: [
      {
        id: "plhh-block-1",
        type: "rich-text",
        theme: "dark",
        heading: "The Reality — Why PLHH Exists",
        body:
          "This is not a trend. It's a collapse.\n\nAcross the EU, farm numbers have fallen dramatically.\n\nWhen farms disappear, nature, animal dignity, and human food quality are all impacted.\n\nPLHH exists because we refuse toীবaccept this as normal.",
        image: "/assets/projects/plhh-coin-block-1.png"
      },
      {
        id: "plhh-block-2",
        type: "rich-text",
        theme: "light",
        heading: "What PLHH Builds — The Ecosystem",
        body:
          "1 — Save Farms\n2 — Animals with Dignity\n3 — Nature Regeneration\n4 — Human Health & Food Quality\n\nThis is Peace, Love & Harmony for more Humanity as infrastructure.",
        image: "/assets/projects/plhh-coin-block-2.png"
      },
      {
        id: "plhh-block-3",
        type: "rich-text",
        theme: "dark",
        heading: "Tokenomics & Presale Structure",
        body:
          "Total Supply: 1,000,000,000 PLHH\nNetwork: Sui\n\nAllocation\n44% Presale & Staking Rewards\n22% Ecosystem Development\n11% Liquidity Pool\n11% Community Projects\n11% Execution & Completion Reserve\n1% Gift\n\nPresale\n8 phases x 17 days\nPhase 1 €0.08 ... Phase 8 €0.36\nLaunch €0.40",
        image: "/assets/projects/plhh-coin-block-3.png"
      },
      {
        id: "plhh-block-4",
        type: "rich-text",
        theme: "light",
        heading: "The PLHH Standard — Decision Rules for the Ecosystem",
        body:
          "Every initiative must strengthen NATURE — ANIMALS — HUMANS and pass:\n1 — Nature First\n2 — Animal Dignity\n3 — Human Health & Responsibility\n4 — Farmer Future\n5 — Transparency by Design",
        image: "/assets/projects/plhh-coin-block-4.png"
      }
    ],
    theme: { background: "#050D08", text: "#F5F5F5", accent: "#2E7D32" }
  }
] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (index + 1) % projects.length;
  return projects[nextIndex];
}
