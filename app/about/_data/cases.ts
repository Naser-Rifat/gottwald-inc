/**
 * Mini editorial case stories (five) cycled by the about-page carousel.
 *
 * `mark` is the path to the case anchor image rendered in the
 * marginalia rail of the case spread. It's typed as `string | null` so
 * the carousel can fall back to the roman-numeral placeholder when a
 * mark image hasn't been generated yet.
 */
export interface CaseStudy {
  /** Audience tag rendered in mono uppercase under the title. */
  tag: string;
  /** Editorial title in the form "Case N — Subject". */
  title: string;
  /** Pre-intervention situation copy. */
  before: string;
  /** Intervention summary (turquoise italic in the carousel). */
  intervention: string;
  /** Outcome copy. */
  after: string;
  /** Anchor image path (null until artwork ships — placeholder shows). */
  mark: string | null;
  /** Pull-quote line for sidebar or social use. */
  pull: string;
}

export const CASES: ReadonlyArray<CaseStudy> = [
  {
    tag: "CEO / Founder / Entrepreneur",
    title: "Case 1 — Too many moving parts",
    before:
      "Everything matters, nothing is ordered. Decisions are heavy. Team pressure rises.",
    intervention:
      "SolutionFinder → root cause visible → sequence + SSOT → execution standard.",
    after:
      "Fewer open loops, a clear line, noticeably more calm. Decision-making becomes light again.",
    mark: "/about/case-mark-i.webp",
    pull: "Decision-making becomes light again.",
  },
  {
    tag: "SME / Premium Offer",
    title: "Case 2 — We're great — but invisible",
    before:
      "High quality, unclear external signal. Inconsistent leads.",
    intervention:
      "Messaging architecture + proof structure + trust system + conversion flow.",
    after:
      "The market understands you immediately. Trust forms faster. Demand becomes more predictable.",
    mark: "/about/case-mark-ii.webp",
    pull: "Trust forms faster. Demand becomes predictable.",
  },
  {
    tag: "SME",
    title: "Case 3 — Old website, slow growth",
    before:
      "Website as a brochure. Performance and structure hold you back. Indexing potential is wasted.",
    intervention:
      "IT Solutions 2030 → infrastructure upgrade (performance, SEO/AI readability, structure, scalability).",
    after:
      "More discoverable, faster, clearer — website becomes a growth engine.",
    mark: "/about/case-mark-iii.webp",
    pull: "Website becomes a growth engine.",
  },
  {
    tag: "Executive",
    title: "Case 4 — High responsibility, inner drift",
    before:
      "You function outwardly, but feel restless inside. Focus breaks. Energy drops.",
    intervention:
      "Mentoring as a Human Operating System (regulation, focus, identity, daily systems).",
    after:
      "Stable state, clearer decisions, stronger impact — without drama.",
    mark: "/about/case-mark-iv.webp",
    pull: "Stronger impact — without drama.",
  },
  {
    tag: "Entrepreneur / Holding",
    title: "Case 5 — Structure Deployment (Georgia)",
    before:
      "You want structure, but risk chaos, half-knowledge, wrong sequence.",
    intervention:
      "Assessment → defensible setup → clean coordination (compliant, bankable, operational).",
    after:
      "Structure stands. Operations are clear. Less stress. More safety.",
    mark: "/about/case-mark-v.webp",
    pull: "Structure stands. Less stress, more safety.",
  },
];
