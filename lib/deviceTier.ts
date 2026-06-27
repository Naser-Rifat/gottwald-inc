export type DeviceTier = "mobile" | "desktop";

interface ExtendedNavigator extends Navigator {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
}

/**
 * Classify the visitor's device for heavy-asset gating (WebGL canvases,
 * HDR environment maps, the 8MB hero video). "mobile" = skip the
 * expensive path; "desktop" = render the full cinematic experience.
 *
 * Why each signal exists (in order of precedence):
 *
 * 1. **Mobile UA + iPad-pretending-to-be-Mac.** Real phones/tablets
 *    can't push the WebGL load reliably and bandwidth is precious.
 *    iPad on iOS 13+ defaults to a desktop Safari UA, so we have to
 *    detect it via `maxTouchPoints` on a Macintosh UA — no real Mac
 *    has multi-touch.
 *
 * 2. **Tiny viewport.** Sub-768px almost always means a phone or a
 *    very compact tablet; the canvas would be too small to matter.
 *
 * 3. **Save-Data / prefers-reduced-data.** The user explicitly asked
 *    the browser to skip non-essential heavy assets. Respecting this
 *    is best-practice PWA / RUM hygiene.
 *
 * 4. **2G / slow-2G connection.** An 8MB hero video can't buffer in
 *    time over these links — render the poster fallback instead.
 *
 * 5. **deviceMemory < 4 GB.** Chrome/Edge expose RAM in GB, rounded.
 *    Genuinely-weak hardware (2GB Chromebooks, old netbooks) trips this.
 *    Safari/Firefox don't expose the API; they fall through to (6).
 *
 * 6. **hardwareConcurrency ≤ 2.** Final safety net for ancient
 *    netbook-class CPUs. Most modern laptops have 4+ cores so this
 *    catches very little — it's a backstop for the deviceMemory miss.
 *
 * 7. **prefers-reduced-motion.** Users who explicitly opted out of
 *    animation at the OS level shouldn't be served an 8MB autoplay
 *    WebGL canvas. The fallback path (HTML5 video or poster) is still
 *    "on brand" but cheaper for them and respects the preference.
 *
 * SSR-safe: returns "desktop" when `navigator` is undefined (server
 * render). Consumers must call this in a `useEffect` or guard against
 * the desktop default leaking into mobile-render paths — see the
 * `useState("webgl") + useEffect` pattern in `VideoPanelAnchors.tsx`.
 *
 * Removed in the 2026-06-27 revision: the `"ontouchstart" in window`
 * check. Touch ⊂ mobile was false even in 2020; in 2026 every
 * mid-range laptop ships with a touchscreen. Replacing that signal
 * with the more-precise checks above lets Surface/XPS/ThinkPad Yoga
 * users see the desktop cinematic experience as intended.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "desktop";
  const nav = navigator as ExtendedNavigator;
  const ua = nav.userAgent;

  const isIPadOS = /Macintosh/i.test(ua) && nav.maxTouchPoints > 1;
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || isIPadOS) return "mobile";

  if (typeof window !== "undefined" && window.innerWidth < 768) return "mobile";

  if (nav.connection?.saveData) return "mobile";
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-data: reduce)").matches
  ) {
    return "mobile";
  }

  const effective = nav.connection?.effectiveType;
  if (effective === "2g" || effective === "slow-2g") return "mobile";

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return "mobile";
  }

  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return "mobile";

  if ((nav.hardwareConcurrency || 8) <= 2) return "mobile";

  return "desktop";
}
