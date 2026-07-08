/**
 * Three-phase "days to feel it" timeline shown in the OUTCOMES & TIME
 * TO VALUE section. Pure data so the diagnostic copy can live alongside
 * the rest of the About data set and stay diff-friendly.
 */
export interface ProofPhase {
  /** Range of days shown as the massive numeral. */
  days: string;
  /** Mono uppercase station label. */
  title: string;
  /** Italic serif descriptor under the label. */
  descriptor: string;
  /** Active-phase body copy cross-faded under the timeline. */
  desc: string;
}

export const PROOF_PHASES: ReadonlyArray<ProofPhase> = [
  {
    days: "7–14",
    title: "Read",
    descriptor: "Diagnostic",
    desc: "Root cause, leverage, sequence — visible. Not opinions, structure.",
  },
  {
    days: "30",
    title: "Move",
    descriptor: "Intervention",
    desc: "Less friction. A clearer line. Relief across the system.",
  },
  {
    days: "60–90",
    title: "Hold",
    descriptor: "Stabilization",
    desc: "Standards hold. Signal stands. Execution becomes stable.",
  },
];
