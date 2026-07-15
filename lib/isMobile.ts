import { headers } from "next/headers";

/**
 * SSR-time mobile detection via the incoming User-Agent header.
 *
 * Used to serve a static, WebGL-free hero to mobile visitors. Rationale:
 *   • The IntroPortal + PhysicsSandbox + VideoPanel WebGL stack ships
 *     ~600KB of Three.js + shaders and takes 8-12 s to boot on the
 *     Lighthouse-mobile CPU profile (4x throttle).
 *   • On real mid-range Android devices the experience is worse — users
 *     often bounce before the loader finishes.
 *   • Desktop users on wired connections + fast CPU still get the full
 *     cinematic experience.
 *
 * Calling this in a Server Component forces the enclosing page to render
 * dynamically instead of being statically pre-generated. Only invoke on
 * routes where a mobile / desktop split is intentional (currently: home).
 */
export async function isMobileFromHeaders(): Promise<boolean> {
  const userAgent = (await headers()).get("user-agent") || "";
  return /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
}
