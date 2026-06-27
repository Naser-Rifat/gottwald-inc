"use client";

// Static SVG file rather than an inline data URI. Chrome/WebKit
// mis-resolve `url(#filterId)` references inside data-URI SVGs against
// the parent document, spamming `GET /%23noise 404` requests every
// frame the overlay is visible. Linking the SVG by file path gives it
// its own document URL, so the filter reference resolves correctly.
const NOISE_SVG_URL = "url('/svg/noise-grain.svg')";

/** Subtle SVG fractal-noise grain overlay. */
export default function NoiseGrain() {
  return (
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
      style={{ backgroundImage: NOISE_SVG_URL }}
    />
  );
}
