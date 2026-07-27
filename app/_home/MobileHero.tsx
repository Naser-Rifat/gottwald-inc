import Header from "@/components/layout/Header";
import MobileHeroBg from "./MobileHeroBg";

/**
 * Mobile-only hero — replaces IntroPortal + WebGL scene on mobile.
 *
 * WHY THIS EXISTS
 * The desktop home page opens with an IntroPortal that boots a full
 * Three.js scene (physics sandbox + video shader + hero orb). On a
 * throttled mobile CPU this takes 8-12 seconds during which users see
 * only a black loading screen. Real Lighthouse mobile scores drop to
 * ~50 as a result.
 *
 * MobileHero renders a lightweight static hero:
 *   • Dark bg (#040404) + radial gradient — no external image in SSR HTML,
 *     nothing competes with the H1 text for LCP.
 *   • Cloudinary poster fades in via JS after hydration (MobileHeroBg).
 *     The URL is absent from SSR HTML so the browser never fetches it
 *     during the LCP window — H1 text wins LCP at FCP time (~1.5 s).
 *   • Zero GSAP, no Three.js on first paint.
 *
 * Desktop is unaffected — see app/page.tsx for the branching.
 */
export default function MobileHero() {
  return (
    <section
      className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-[#040404] text-white overflow-hidden"
      aria-label="GOTT WALD Holding — brand introduction"
    >
      {/* Global site header. On desktop the header is rendered inside
          PhysicsSandboxSection/HeaderSlot with an opacity-0 fade-in choreo.
          On mobile we skip that section entirely, so the header lives here
          directly, visible from the first paint. */}
      <div className="fixed top-0 left-0 w-full z-[100] px-gutter pointer-events-auto">
        <Header />
      </div>

      {/* Deferred poster — backgroundImage injected via JS after hydration
          so it is absent from SSR HTML and never an LCP candidate.
          Starts at opacity-0; MobileHeroBg fades it to 0.25 on mount. */}
      <div
        id="mobile-hero-bg"
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-center bg-cover"
        style={{ opacity: 0, transition: "opacity 1.2s ease" }}
      />

      {/* Radial vignette — keeps text readable over the poster */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Injects backgroundImage + triggers fade after hydration */}
      <MobileHeroBg />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        <span className="mb-4 block text-[11px] tracking-[0.4em] uppercase text-white/70 font-semibold">
          THE STANDARD OF
        </span>
        <h1 className="text-[clamp(2.5rem,10vw,5rem)] leading-[0.95] font-light tracking-[-0.02em] uppercase text-white mb-6">
          GOTT WALD
          <br />
          HOLDING
        </h1>
        <span className="block text-[11px] tracking-[0.35em] uppercase text-white/80 font-medium">
          EST. 2024 &nbsp;·&nbsp; TBILISI, GEORGIA
        </span>
      </div>

      {/* Scroll indicator — CSS-only with a native pulse animation.
          No JS, no framer-motion, no gsap. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium mb-3">
          Scroll
        </span>
        <span className="block w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>

    </section>
  );
}
