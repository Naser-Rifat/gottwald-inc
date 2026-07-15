import Image from "next/image";

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
 * MobileHero renders the SAME brand chrome but with:
 *   • A static Cloudinary poster instead of the WebGL orb (auto-formatted
 *     to AVIF/WebP by Next.js Image + `fetchPriority=high` to prime the
 *     LCP element).
 *   • CSS-only fade-in (no gsap, no JS) so it paints in the first frame.
 *   • Scroll hint at the bottom — no "Start Experience" gate; the user
 *     just scrolls into the content sections.
 *
 * Desktop is unaffected — see app/page.tsx for the branching.
 */
export default function MobileHero() {
  return (
    <section
      className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-[#040404] text-white overflow-hidden"
      aria-label="GOTT WALD Holding — brand introduction"
    >
      {/* Poster image — this is the LCP element on mobile. Extracted from
          the same intro video used on desktop so the visual identity is
          consistent across form factors. fetchPriority=high tells the
          browser to preload this before below-the-fold work. */}
      <Image
        src="https://res.cloudinary.com/dsfe6i3vf/video/upload/so_0,f_jpg,q_auto:eco,w_1200/v1778839135/gottwald_ixgowv.jpg"
        alt=""
        role="presentation"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-40 pointer-events-none select-none"
      />

      {/* Vertical vignette so the brand text stays readable over the poster */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none"
      />

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

      {/* Scroll indicator — CSS-only chevron with a native pulse animation.
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
