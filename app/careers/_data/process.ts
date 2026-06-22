/**
 * Application-process steps + the "What you'll find here" inventory.
 *
 * Kept in one module because both are short, structurally similar lists
 * that only show up in the same section (`ProcessSection`).
 */

export interface ProcessStep {
  /** Step number rendered in the circular badge. */
  n: string;
  /** Step title in uppercase. */
  t: string;
  /** One-line description of what happens at that step. */
  d: string;
}

export const APPLICATION_PROCESS: ReadonlyArray<ProcessStep> = [
  { n: "1", t: "Submit", d: "Role interest + proof" },
  { n: "2", t: "Screening", d: "Fit, foundation, delivery" },
  { n: "3", t: "Short call", d: "If relevant" },
  { n: "4", t: "Case / pilot", d: "Small, real, measurable" },
  { n: "5", t: "Start", d: "Employee, interim, or pool" },
];

export interface FindHereItem {
  /** Bold left-hand label. */
  label: string;
  /** Italic right-hand "instead of …" / context line. */
  context: string;
  /** Render the label in the brand copper tint (used for the closing item). */
  accent?: boolean;
  /** Allow the context to break into two lines (used for the closing item). */
  multiline?: boolean;
}

export const FIND_HERE: ReadonlyArray<FindHereItem> = [
  { label: "standards", context: "instead of chaos" },
  { label: "responsibility", context: "instead of excuses" },
  { label: "strong people", context: "instead of political noise" },
  { label: "clean documentation", context: "instead of knowledge islands" },
  { label: "discretion", context: "as culture" },
  {
    label: "a global human family",
    context: "diversity is wanted\nfoundation is required",
    accent: true,
    multiline: true,
  },
];
