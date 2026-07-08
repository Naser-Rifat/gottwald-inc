/**
 * Floating-particle decoration data for the /contact background layer.
 *
 * Generated once at module evaluation so the same seed renders on
 * every visit (the particles are positional decoration, not animated
 * by JS at runtime — CSS keyframes handle the float + sway). Keeping
 * this module-level constant means React doesn't re-randomize on
 * every re-render and the SSR snapshot matches client hydration.
 */
export interface Particle {
  id: number;
  /** Particle diameter in px. */
  size: number;
  /** Horizontal start position, 0-100. */
  left: number;
  /** Animation delay in seconds. */
  delay: number;
  /** Total float-up duration in seconds. */
  duration: number;
  /** Max opacity reached during the float. */
  opacity: number;
  /** Tint variant — chosen by index parity to spread the palette. */
  color: "turquoise" | "gold" | "white";
  /** Horizontal sway amplitude (unused at runtime; kept for tuning). */
  sway: number;
}

export const PARTICLES: ReadonlyArray<Particle> = Array.from(
  { length: 18 },
  (_, i): Particle => ({
    id: i,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 30 + Math.random() * 30,
    opacity: 0.08 + Math.random() * 0.15,
    color: i % 3 === 0 ? "turquoise" : i % 3 === 1 ? "gold" : "white",
    sway: 20 + Math.random() * 40,
  }),
);
