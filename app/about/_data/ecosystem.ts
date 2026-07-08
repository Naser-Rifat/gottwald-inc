/**
 * Ecosystem "orchestra" frequencies powering the bottom-half About
 * section. Each entry maps a business area to its inner state, brand
 * tone (one of 5), and reveal image.
 *
 * The tone → Tailwind class mapping lives next to the data so a section
 * component never has to invent its own class strings — keeps the brand
 * frequency palette to a single source of truth.
 */

export type FrequencyTone =
  | "gold"
  | "silver"
  | "petrol"
  | "copper"
  | "turquoise";

/**
 * Default-state / hover-state text colour pair, one entry per
 * `FrequencyTone`. Pre-baked Tailwind class strings (rather than dynamic
 * `text-${tone}/X`) so the JIT compiler picks them up — generated
 * classes silently disappear from the production CSS bundle.
 */
export const FREQUENCY_TONE_CLASSES: Record<FrequencyTone, string> = {
  gold: "text-gold/55 group-hover:text-gold",
  silver: "text-silver/55 group-hover:text-silver",
  petrol: "text-petrol/80 group-hover:text-petrol",
  copper: "text-copper/55 group-hover:text-copper",
  turquoise: "text-turquoise/65 group-hover:text-turquoise",
};

export interface EcosystemFrequency {
  /** Full business area name (often paired e.g. "X / Y"). */
  name: string;
  /** Single-word inner-state label rendered in the brand-tone column. */
  frequency: string;
  /** Short description of what the area delivers. */
  desc: string;
  /** Brand frequency for color signalling (see palette manifesto). */
  tone: FrequencyTone;
  /** Reveal-cursor image swapped in on row hover. */
  image: string;
}

/**
 * Brand color logic (per client manifesto):
 *   gold      = positive / stability
 *   silver    = neutral / space
 *   petrol    = depth / structure
 *   turquoise = signal / clarity
 *   copper    = warmth / human presence
 * Distributed across the 8 sub-frequencies so each business "sounds"
 * distinct without any single tone dominating.
 */
export const ECOSYSTEM_FREQUENCIES: ReadonlyArray<EcosystemFrequency> = [
  {
    name: "SolutionFinder / Solution Management",
    frequency: "Clarity",
    desc: "Find the cause, lead the solution, lock stability.",
    tone: "turquoise",
    image: "/images/orchestra/clarity.png",
  },
  {
    name: "Consulting",
    frequency: "Structure",
    desc: "Executive-grade strategy, decision systems, and growth.",
    tone: "petrol",
    image: "/images/orchestra/structure.png",
  },
  {
    name: "Marketing & Communication",
    frequency: "Signal",
    desc: "Trust and demand infrastructure.",
    tone: "gold",
    image: "/images/orchestra/signal.png",
  },
  {
    name: "IT Solutions 2030",
    frequency: "Momentum",
    desc: "Websites as high-performance, indexable infrastructure.",
    tone: "silver",
    image: "/images/orchestra/momentum.png",
  },
  {
    name: "Coaching & Mentoring",
    frequency: "Presence",
    desc: "A human operating system for high responsibility.",
    tone: "copper",
    image: "/images/orchestra/presence.png",
  },
  {
    name: "Structure Deployment (Georgia)",
    frequency: "Stability",
    desc: "Defensible setup for entrepreneurs and holdings.",
    tone: "petrol",
    image: "/images/orchestra/stability.png",
  },
  {
    name: "YIG.CARE",
    frequency: "Expansion",
    desc: "Platform and movement. Launch 2026.",
    tone: "silver",
    image: "/images/orchestra/expansion.png",
  },
  {
    name: "PLHH_Coin",
    frequency: "Harmony",
    desc: "RWA and Governance DAO for real-world regeneration.",
    tone: "gold",
    image: "/images/orchestra/harmony.png",
  },
];
