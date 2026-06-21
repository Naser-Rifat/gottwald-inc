"use client";

const NOISE_SVG_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

/** Subtle SVG fractal-noise grain overlay. */
export default function NoiseGrain() {
  return (
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
      style={{ backgroundImage: NOISE_SVG_URL }}
    />
  );
}
