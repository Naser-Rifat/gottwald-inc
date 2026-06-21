"use client";

import { useEffect, useRef, useState } from "react";

const COMPLETE_SETTLE_MS = 50;

interface UseLoadingProgressArgs {
  /** Fires inside the same tick as setIsLoaded(true). */
  onComplete?: () => void;
}

/**
 * Subscribes to the global `loading-progress` and `loading-complete`
 * events dispatched by `loadingGroup.ts`. Returns the current progress
 * percentage and a `isLoaded` flag.
 *
 * The 50ms settle delay before flipping `isLoaded` matches the original
 * intent: it ensures the loader is mounted before any opacity transition
 * to 0 starts, so users see the bar reach 100% before the fade.
 */
export function useLoadingProgress({
  onComplete,
}: UseLoadingProgressArgs = {}) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const handleProgress = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") setProgress(detail);
    };

    const handleComplete = () => {
      window.setTimeout(() => {
        setIsLoaded(true);
        onCompleteRef.current?.();
      }, COMPLETE_SETTLE_MS);
    };

    window.addEventListener("loading-progress", handleProgress);
    window.addEventListener("loading-complete", handleComplete);
    return () => {
      window.removeEventListener("loading-progress", handleProgress);
      window.removeEventListener("loading-complete", handleComplete);
    };
  }, []);

  return { progress, isLoaded };
}
