/**
 * Pillar FAQs — keyed by pillar slug.
 *
 * Emitted as FAQPage JSON-LD on each /pillars/[slug] page so that
 * AI systems (ChatGPT, Perplexity, Claude, Gemini) and search engines
 * can extract and cite GOTT WALD content when users ask related questions.
 *
 * Authoring guidance:
 * - Questions should be phrased the way a real user would ask (who/what/how/when)
 * - Answers should be 40–80 words — tight enough to quote, rich enough to stand alone
 * - State facts, not marketing copy — extractable, verifiable statements win citations
 */

export type Faq = { question: string; answer: string };

export const pillarFaqs: Record<string, Faq[]> = {
  "it-solutions-2030": [
    {
      question: "What is IT Solutions 2030?",
      answer:
        "IT Solutions 2030 is GOTT WALD's digital infrastructure pillar for small and medium-sized enterprises. The core product is Homepage Transformation — rebuilding outdated company websites into fast, search-optimized, AI-readable, mobile-first, and scalable digital infrastructure. Delivery is structured through a five-step process from intent profiling to launch.",
    },
    {
      question: "Who is IT Solutions 2030 for?",
      answer:
        "IT Solutions 2030 is built for small and medium-sized businesses whose current websites are slow, structurally outdated, poorly optimized for search, or not prepared for AI-driven discovery. It is not a cosmetic redesign service — it targets companies that need a rebuilt technological foundation to remain visible in search, AI answers, and recommendation systems.",
    },
    {
      question: "How does the Homepage Transformation process work?",
      answer:
        "Five structured steps: (1) Digital IT Architect Conversation to map goals and challenges, producing a Digital Intention Profile. (2) Website Technical Analysis producing a Technical Reality Profile. (3) Transformation Blueprint combining both. (4) Personalized proposal with scope, timeline, pricing. (5) Implementation by project managers and development teams from architecture to launch.",
    },
    {
      question: "What does AI-readable web architecture mean?",
      answer:
        "AI-readable architecture means the site is structured so that language-model-based search systems — ChatGPT, Perplexity, Claude, Gemini — can parse, understand, and cite its content. This includes semantic content hierarchy, structured data (JSON-LD schema), clean information architecture, and fast, crawlable rendering. Without it, sites become progressively invisible to AI-powered discovery.",
    },
    {
      question: "Is IT Solutions 2030 only about speed and SEO?",
      answer:
        "No. Performance and SEO are outputs, not the goal. The pillar rebuilds the full technical foundation: architecture, data structure, semantic hierarchy, mobile-first infrastructure, security, and integration capacity. This creates a site that remains discoverable and scalable as search, AI, and user devices continue to evolve.",
    },
    {
      question: "Where is IT Solutions 2030 delivered from?",
      answer:
        "IT Solutions 2030 is operated by GOTT WALD Holding LLC, headquartered in Tbilisi, Georgia, serving clients across Georgia and Europe. Delivery is remote-first with structured project management, documented handoffs, and transparent pricing. The pillar is designed to bring enterprise-grade digital infrastructure within reach of SMEs.",
    },
  ],

  "solutionfinder-solution-management": [
    {
      question: "What is SolutionFinder?",
      answer:
        "SolutionFinder is GOTT WALD's structured-analysis pillar for complex business situations. It examines leadership dynamics, organizational structures, operational processes, technology, and economic frameworks to reveal the structure of a problem. Once that structure is visible, clear resolution paths become possible. Clients choose the depth of engagement — analysis only, or analysis plus Solution Management implementation.",
    },
    {
      question: "How is SolutionFinder different from management consulting?",
      answer:
        "Traditional consulting prescribes a framework, then forces reality to fit it. SolutionFinder inverts this: the situation is analyzed first to make its underlying structure visible, then a solution path is defined from that specific structure. This produces resolution paths that match the actual problem, not the consultant's template.",
    },
    {
      question: "What does Solution Management add beyond analysis?",
      answer:
        "Solution Management drives execution. Where SolutionFinder creates clarity, Solution Management implements the defined path — coordinating teams, tracking progress, and stabilizing the operational change — until the original situation no longer creates friction. Clients can engage analysis alone, or analysis plus full implementation and stabilization.",
    },
    {
      question: "When should a company engage SolutionFinder?",
      answer:
        "SolutionFinder is suited to situations that feel persistently complex, unresolved, or contradictory — where multiple internal attempts have not produced clarity. It works well where leadership, organizational, process, technology, and economic factors are tangled together, and where generic frameworks have not cut through the complexity.",
    },
    {
      question: "What kind of situations does SolutionFinder analyze?",
      answer:
        "Typical engagements cover organizational restructuring, leadership transitions, stalled transformation programs, operational bottlenecks with unclear root causes, post-merger integration friction, and strategic pivots. Any environment where decision-makers need structured visibility before they can commit to a direction fits the SolutionFinder methodology.",
    },
  ],

  consulting: [
    {
      question: "What is GOTT WALD Consulting?",
      answer:
        "GOTT WALD Consulting provides strategic clarity for leaders who carry real operational responsibility. It focuses on strategy architecture, organizational design, and building scalable systems that hold under pressure. The pillar works with decision-makers who need actionable structure, not theoretical frameworks — producing decisions that translate into measurable impact.",
    },
    {
      question: "Who is GOTT WALD Consulting designed for?",
      answer:
        "The pillar is designed for founders, CEOs, and executive leaders accountable for results — those carrying the weight of strategic decisions rather than delegating them. Engagements are structured, senior-level, and outcome-oriented. This is not a junior-consultant staffing model — it is a direct working relationship between senior operators and senior decision-makers.",
    },
    {
      question: "How do GOTT WALD consulting engagements typically work?",
      answer:
        "Engagements begin with a structural assessment of the client's situation — strategy, organization, systems, and constraints. From there, GOTT WALD builds architecture: clear strategic direction, organizational design, and operational systems that scale. Delivery is structured, discreet, and tied to measurable business outcomes rather than deliverable counts.",
    },
    {
      question: "What makes GOTT WALD Consulting different from large firms?",
      answer:
        "Large firms deliver branded frameworks at scale. GOTT WALD delivers custom architecture for situations the frameworks do not fit. The pillar operates standards-led — one language of delivery across every engagement — but every output is built for the specific reality of the client, not compressed into a pre-packaged template.",
    },
    {
      question: "Does GOTT WALD Consulting connect to the other pillars?",
      answer:
        "Yes. Consulting sits inside a nine-pillar operating architecture — including IT Solutions 2030, SolutionFinder, Marketing & Communication, Coaching, and Relocation. Each pillar stands alone, and engagements draw in additional pillars only when the strategic situation requires them. This prevents scope creep and keeps engagements focused.",
    },
  ],

  "marketing-communication": [
    {
      question: "What does GOTT WALD Marketing & Communication do?",
      answer:
        "The pillar builds executive visibility, engineered trust, and predictable demand infrastructure. It is positioned for founders, leaders, and companies that need their market presence to match the quality of what they deliver. Output includes brand architecture, communication systems, visibility strategy, and demand-generation infrastructure — not campaign-level tactical marketing.",
    },
    {
      question: "Is this a marketing agency?",
      answer:
        "No. Agencies sell campaigns, deliverables, and channel tactics. GOTT WALD Marketing & Communication builds the underlying infrastructure — positioning, messaging architecture, visibility systems, and demand engines — that makes any campaign work. It is engineering for market presence, not production work for individual campaigns.",
    },
    {
      question: "What does 'engineered trust' mean in practice?",
      answer:
        "Engineered trust means designing every public-facing touchpoint — website, communications, content, presence, proof — so that trust is a structural property of the brand rather than a byproduct of goodwill. It is built through consistency, clarity, and visible standards, so a prospective client can trust the company before the first conversation happens.",
    },
    {
      question: "Who should use GOTT WALD Marketing & Communication?",
      answer:
        "Founders, executives, and companies whose substance is strong but whose market presence does not yet match it. Also firms scaling out of founder-led sales into structured demand, and leaders who want their personal visibility to be coherent with their company positioning. It is not suited to companies needing one-off campaign execution.",
    },
    {
      question: "How does this pillar connect to IT Solutions 2030?",
      answer:
        "IT Solutions 2030 provides the digital infrastructure — fast, AI-readable, scalable. Marketing & Communication provides the positioning, messaging, and visibility strategy that runs on top. Engaged together, they produce a coherent market presence: technically modern, strategically positioned, and ready for both human and AI-driven discovery.",
    },
  ],

  "coaching-mentoring": [
    {
      question: "What is GOTT WALD Coaching & Mentoring?",
      answer:
        "An executive coaching pillar built around identity, decision strength, and holistic performance. It works with leaders on the non-delegable dimensions of leadership — clarity, conviction, focus, and the personal systems that make consistent high-level decisions possible. The focus is durable inner architecture, not motivational coaching or performance hacks.",
    },
    {
      question: "Who is this coaching designed for?",
      answer:
        "Founders, CEOs, and senior operators whose decisions carry real weight — where clarity, resilience, and identity coherence directly affect business outcomes. It is designed for people who already perform at a high level and want the inner operating system to match that performance, rather than for people new to leadership.",
    },
    {
      question: "What does 'holistic performance' mean?",
      answer:
        "It treats performance as the integrated output of identity, energy, focus, relationships, and decision quality — rather than reducing it to productivity tactics. Interventions span mental models, physical rhythm, strategic clarity, and personal systems. The objective is a leader whose performance compounds over years, not one who burns out trying to sprint.",
    },
    {
      question: "Is this the same as business consulting?",
      answer:
        "No. Consulting works on external systems — strategy, organization, operations. Coaching & Mentoring works on the internal operating system of the leader. The two are complementary: a sound business architecture still requires a leader capable of running it. Many GOTT WALD clients engage both pillars in parallel.",
    },
    {
      question: "How are coaching engagements structured?",
      answer:
        "Engagements are structured, confidential, and long-term — designed for durable change rather than short bursts. Sessions combine strategic dialogue, identity work, and practical system design. The relationship is senior-to-senior, without standardized curricula — each engagement is built around the specific leader, their situation, and their ambition.",
    },
  ],

  "relocation-structure-deployment": [
    {
      question: "What is GOTT WALD Relocation?",
      answer:
        "A pillar for positioning Georgia as a central operational node between East and West. It covers corporate and holding structure setup, executive residency, and operational continuity — giving leaders and companies a stable, efficient, well-governed base from which to operate across Europe and beyond. It is structural deployment, not simple immigration service.",
    },
    {
      question: "Why Georgia as an operational base?",
      answer:
        "Georgia offers favorable corporate tax structure, streamlined company formation, strong banking infrastructure, EU-adjacent geography, and strategic positioning between European, CIS, and Middle Eastern markets. It combines low operational friction with real business substance — making it suitable as a genuine operating node rather than only a paper jurisdiction.",
    },
    {
      question: "Who is Relocation designed for?",
      answer:
        "Entrepreneurs, executives, and companies looking to establish a stable, efficient operational base outside saturated high-cost jurisdictions. It suits leaders who want their corporate structure, residency, and operations to sit in a single coherent location — and who value governance quality alongside tax efficiency.",
    },
    {
      question: "What does 'structural deployment' include?",
      answer:
        "It covers corporate structure design, company formation, banking setup, residency planning, office and operational infrastructure, and the governance layer needed for substance. Delivery is integrated — legal, financial, and operational elements handled together — so the relocation produces an operating company in Georgia, not a disconnected paper holding.",
    },
    {
      question: "Is relocating to Georgia just about tax?",
      answer:
        "No. Tax efficiency is one input, but GOTT WALD structures for substance: real operational presence, banking depth, governance quality, and strategic geography. Deploying only for tax produces brittle structures that fail under scrutiny. The Relocation pillar builds structures that hold up to banking, regulatory, and counterparty due diligence over time.",
    },
  ],

  yigcare: [
    {
      question: "What is YIG.CARE?",
      answer:
        "YIG.CARE is GOTT WALD's frequency-and-wellness pillar, built around the concept of Inner Glow — the coherent energy, clarity, and vitality that underlies sustained high performance. It combines frequency-based technology, wellness protocols, and structured care designed for leaders, operators, and people who treat health as strategic infrastructure rather than optional maintenance.",
    },
    {
      question: "What does 'frequency' mean in YIG.CARE?",
      answer:
        "Frequency refers to the vibrational and energetic state of the body and nervous system, shaped by sleep, stress, nutrition, environment, and coherent attention. YIG.CARE works with frequency-based technology and protocols to stabilize, elevate, and sustain this state — so energy, clarity, and focus become reliable outputs rather than occasional peaks.",
    },
    {
      question: "Who is YIG.CARE designed for?",
      answer:
        "Leaders, executives, operators, and performers whose effectiveness depends on consistent clarity and energy. Also individuals recovering from extended high-intensity periods who need structured restoration, and anyone who considers health a strategic asset rather than a reactive concern. It is not a general-public wellness brand — it is care engineered for people with real load.",
    },
    {
      question: "How does YIG.CARE connect to the other pillars?",
      answer:
        "Performance in consulting, coaching, or leadership requires a sustainable inner state. YIG.CARE supplies the restorative and vitality layer that makes long-horizon performance possible. Many clients engage YIG.CARE alongside Coaching & Mentoring — coaching works on identity and decisions, YIG.CARE works on the physiological and energetic substrate.",
    },
    {
      question: "Is YIG.CARE medical treatment?",
      answer:
        "No. YIG.CARE is a wellness and frequency-care pillar — not a substitute for medical diagnosis or treatment. It complements, rather than replaces, conventional healthcare. Clients with medical conditions should work with their physicians; YIG.CARE focuses on optimization, restoration, and sustained vitality in people who are broadly well.",
    },
  ],

  plhhcoin: [
    {
      question: "What is PLHH Coin?",
      answer:
        "PLHH Coin is the real-world-asset (RWA) governance layer of the GOTT WALD ecosystem, grounded in the principle of 'Peace, Love & Harmony for more Humanity.' It is designed as a structural instrument connecting strategic assets, governance, and long-horizon value — not as a speculative trading token.",
    },
    {
      question: "Is PLHH Coin a speculative cryptocurrency?",
      answer:
        "No. PLHH Coin is positioned as a real-world-asset and governance instrument — a structural layer connected to tangible value and aligned participation. It is not designed, marketed, or intended as a short-term speculative trading vehicle. Participation is framed around long-term alignment with the ecosystem's governance and asset base.",
    },
    {
      question: "What does 'Peace, Love & Harmony for more Humanity' mean?",
      answer:
        "It is the explicit value foundation of the PLHH pillar — a commitment that governance, capital, and technology should serve human flourishing, ecological restoration, and systemic coherence. The principle anchors decisions about what assets, projects, and participants fit the ecosystem, so capital and governance remain aligned with a stated civilizational intent.",
    },
    {
      question: "How does PLHH Coin fit into the GOTT WALD pillar architecture?",
      answer:
        "PLHH Coin sits at the governance and value layer of the nine-pillar architecture, connecting strategic assets across ventures and platforms. It provides coherence between consulting, IT, relocation, and wellness pillars — a structural instrument where aligned participants can hold governance weight and share in long-horizon value creation.",
    },
    {
      question: "Is this financial advice or an investment offering?",
      answer:
        "No. Information on the PLHH Coin pillar is structural and conceptual — describing how the instrument is designed and positioned within the GOTT WALD ecosystem. It is not a prospectus, solicitation, or financial advice. Any participation should be evaluated with qualified legal, tax, and financial advisors in the relevant jurisdiction.",
    },
  ],
};

export function getPillarFaqs(slug: string): Faq[] {
  return pillarFaqs[slug] ?? [];
}
