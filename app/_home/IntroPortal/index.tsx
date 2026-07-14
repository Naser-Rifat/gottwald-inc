"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { getDeviceTier } from "@/lib/deviceTier";

// IntroPortalCanvas pulls in three + @react-three/fiber (~600KB). Dynamic
// import keeps that out of the initial home-page JS chunk so the first
// paint (loading screen / portal shell) ships without Three.js. Return
// visitors render <ReturnVisitLoader/> instead and never load this code
// at all. Mobile visitors also skip it — the portal UI (H1 + CTAs)
// renders against the plain dark backdrop instead of the WebGL orb, which
// is the difference between 6 s and ~2 s mobile LCP.
// ssr:false because Three.js requires window/WebGL.
const IntroPortalCanvas = dynamic(() => import("./IntroPortalCanvas"), {
  ssr: false,
});

import { useLoadingProgress } from "./_hooks/useLoadingProgress";
import { useBodyScrollLock } from "./_hooks/useBodyScrollLock";
import { usePortalEntrance } from "./_hooks/usePortalEntrance";

import NoiseGrain from "./_components/NoiseGrain";
import ReturnVisitLoader from "./_components/ReturnVisitLoader";
import PortalContent from "./_components/PortalContent";

// useSyncExternalStore snapshot helpers — hoisted so they are stable
// across renders (React reuses them without re-subscribing).
const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;
const getPortalVisited = () =>
  sessionStorage.getItem("portal-visited") === "true";

// Delay before the post-dismiss "/our-work" navigation fires, so the
// portal exit animation has time to almost finish.
const SKIP_NAV_DELAY_MS = 800;

export default function IntroPortal() {
  const router = useRouter();
  const portalRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  const isClient = useSyncExternalStore(noopSubscribe, getTrue, getFalse);
  const isReturnVisit = useSyncExternalStore(
    noopSubscribe,
    getPortalVisited,
    getFalse,
  );
  // Mobile devices skip the WebGL orb behind the portal — the ~600 KB
  // Three.js bundle blows past the mobile LCP budget. `useSyncExternalStore`
  // returns `false` on the server + first client render (matching SSR HTML,
  // no hydration mismatch), then the store selector re-reads on the client
  // and yields `true` only for desktop.
  const isDesktop = useSyncExternalStore(
    noopSubscribe,
    () => getDeviceTier() === "desktop",
    getFalse,
  );
  const [isVisible, setIsVisible] = useState(true);

  const { progress, isLoaded } = useLoadingProgress({
    onComplete: () => {
      // Returning visitors skip the portal hero — fire the wormhole
      // shader immediately so the canvas can react.
      if (sessionStorage.getItem("portal-visited") === "true") {
        window.dispatchEvent(new CustomEvent("portal-start"));
      }
    },
  });

  useBodyScrollLock(isClient && isVisible && !isLoaded);
  usePortalEntrance({
    portalRef,
    orbRef,
    isReady: isClient && isVisible,
    isLoaded,
  });

  const dismissPortal = () => {
    sessionStorage.setItem("portal-visited", "true");
    window.dispatchEvent(new CustomEvent("portal-start"));

    gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsVisible(false),
      });

      tl.to(".portal-reveal", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.in",
      });
      tl.to(
        orbRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.in" },
        "+=2.9",
      );
      tl.to(
        portalRef.current,
        { opacity: 0, duration: 0.8, ease: "power2.inOut" },
        "-=0.4",
      );
    }, portalRef);
  };

  const handleStart = () => {
    window.dispatchEvent(new CustomEvent("audio-start"));
    dismissPortal();
  };

  const handleViewWork = () => {
    dismissPortal();
    window.setTimeout(() => router.push("/our-work"), SKIP_NAV_DELAY_MS);
  };

  // Mobile visitors skip the intro portal entirely. Rendering the full-
  // screen z-9999 overlay (even without WebGL) covered the SSR hero and
  // pushed Lighthouse's LCP element to the client-only portal H1 (mobile
  // LCP 4.9 s). Skipping the overlay lets mobile pin LCP on the SSR-
  // rendered PhysicsSandbox H1, which is already in the initial HTML.
  //
  // We still need to release the portal-dependent listeners (`portal-start`
  // event + `portal-visited` sessionStorage flag) — otherwise the hero
  // entrance animation waits forever and JourneyIndicator never reveals.
  useEffect(() => {
    if (isDesktop) return;
    try {
      sessionStorage.setItem("portal-visited", "true");
    } catch {
      /* private-mode Safari: sessionStorage throws, downstream code
         handles the false branch safely. */
    }
    window.dispatchEvent(new CustomEvent("portal-start"));
  }, [isDesktop]);

  if (!isClient) return null;
  if (!isDesktop) return null;
  if (isReturnVisit) {
    return <ReturnVisitLoader progress={progress} isLoaded={isLoaded} />;
  }
  if (!isVisible) return null;

  return (
    <div
      ref={portalRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040404] text-white"
    >
      <NoiseGrain />

      <div
        ref={orbRef}
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none z-0"
        style={{
          transformOrigin: "center center",
          // Mobile fallback: a subtle radial gradient stands in for the
          // WebGL orb so the visual composition still reads. Desktop
          // gets the real thing mounted below.
          background: isDesktop
            ? undefined
            : "radial-gradient(60% 55% at 50% 50%, rgba(18,168,172,0.25), rgba(0,109,132,0.12) 55%, transparent 78%)",
        }}
      >
        {isDesktop ? <IntroPortalCanvas /> : null}
      </div>

      <PortalContent onStart={handleStart} onViewWork={handleViewWork} />
    </div>
  );
}
