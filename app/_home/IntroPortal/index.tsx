"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";

// IntroPortalCanvas pulls in three + @react-three/fiber (~600KB). Dynamic
// import keeps that out of the initial home-page JS chunk so the first
// paint (loading screen / portal shell) ships without Three.js. Return
// visitors render <ReturnVisitLoader/> instead and never load this code
// at all. ssr:false because Three.js requires window/WebGL.
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

  // Reveal home-content once the portal is done. Belt + suspenders:
  //   • LoadingGroup on desktop already removes `.fade-out` when the WebGL
  //     scene reaches the "post-load sequence" — this fires for cinematic
  //     dismissal on desktop.
  //   • The mobile perf path skips WebGL entirely, so LoadingGroup never
  //     fires; we remove `.fade-out` here from IntroPortal so mobile users
  //     don't end up stuck on a black screen.
  //   • Explicit dismiss (user clicks Start / View Work) also removes the
  //     class immediately, so the hero fades in as the portal fades out.
  const revealHomeContent = () => {
    document.getElementById("home-content")?.classList.remove("fade-out");
  };

  // Safety net: if the portal never dismisses within 6 s (broken WebGL,
  // stalled loader, mobile without WebGL), reveal home-content anyway so
  // the user is never stuck staring at a hidden hero.
  useEffect(() => {
    if (!isClient) return;
    const t = window.setTimeout(revealHomeContent, 6000);
    return () => window.clearTimeout(t);
  }, [isClient]);

  // ReturnVisitLoader auto-dismisses when isLoaded flips to true — reveal
  // home-content in sync with its fade-out (transition-opacity duration-1000).
  useEffect(() => {
    if (isReturnVisit && isLoaded) revealHomeContent();
  }, [isReturnVisit, isLoaded]);

  const dismissPortal = () => {
    sessionStorage.setItem("portal-visited", "true");
    window.dispatchEvent(new CustomEvent("portal-start"));
    revealHomeContent();

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

  if (!isClient) return null;
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
        style={{ transformOrigin: "center center" }}
      >
        <IntroPortalCanvas />
      </div>

      <PortalContent onStart={handleStart} onViewWork={handleViewWork} />
    </div>
  );
}
