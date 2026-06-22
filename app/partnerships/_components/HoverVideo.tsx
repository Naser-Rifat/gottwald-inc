"use client";

import { useRef } from "react";

/**
 * Bare `<video>` element with the looped/muted/playsInline/preload="none"
 * defaults the partnership-card hover-reveal relies on.
 *
 * Extracted so the dozen places that need the same hover-thumbnail
 * behavior don't each have to spell out the four attribute defaults.
 * The ref is kept so a parent can drive `.play()` / `.pause()` later
 * without having to call into the DOM directly.
 */
export default function HoverVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className={className}
    />
  );
}
