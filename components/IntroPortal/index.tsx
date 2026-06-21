"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import IntroPortalCanvas from "@/components/IntroPortalCanvas";

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
