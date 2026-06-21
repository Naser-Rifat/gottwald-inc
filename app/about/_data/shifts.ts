/**
 * Five-shift editorial sequence used in the "What shifts" sub-section.
 * Each item is a performative reading (subject → verb) the page maps
 * to a shift image and a ScrollCanvas index.
 */
export interface Shift {
  /** Sans display copy that sets the scene. */
  subject: string;
  /** Italic Playfair drop-line — the verb that performs the shift. */
  verb: string;
  /** Single-sentence context body shown under the shift. */
  context: string;
  /** Source image for the sticky ShiftCanvas reveal. */
  image: string;
}

export const SHIFTS: ReadonlyArray<Shift> = [
  {
    subject: "Decision gridlock",
    verb: "dissolves.",
    context: "Clear priorities, clear ownership, fewer open loops.",
    image: "/images/shifts/decision.png",
  },
  {
    subject: "Execution becomes",
    verb: "predictable.",
    context:
      'Projects are not "felt." They are led with SSOT, sequence, and standards.',
    image: "/images/shifts/execution.png",
  },
  {
    subject: "Visibility becomes",
    verb: "plan-able.",
    context:
      "Messaging locks in. Proof is structured. Conversion rises because trust forms faster.",
    image: "/images/shifts/visibility.png",
  },
  {
    subject: "Digital presence becomes",
    verb: "powerful.",
    context:
      "Performance, indexability, structure. Website as operating system, not brochure.",
    image: "/images/shifts/digital.png",
  },
  {
    subject: "Leadership state",
    verb: "stabilizes.",
    context:
      "More calm, more focus, better decisions — without self-loss.",
    image: "/images/shifts/leadership.png",
  },
];

/** Roman numerals reused as marginalia by the OUTCOMES section. */
export const SHIFT_ROMANS: ReadonlyArray<string> = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
];
