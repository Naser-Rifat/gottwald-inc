"use client";

import { useEffect, useRef, type Ref } from "react";

interface LiquidAuroraProps {
  ref?: Ref<HTMLDivElement>;
}

/**
 * Spinning gradient blob behind the editorial column.
 *
 * Visually unchanged. Both child spin animations and the parent's 100px
 * blur layer are the single most expensive composite in the home page —
 * a 50vw × 50vw blurred element with two infinite-spinning gradients
 * forces continuous GPU work as long as it's in the layout. The
 * IntersectionObserver below pauses the spins (via animation-play-state)
 * whenever the section is off-screen, so the GPU is free for whatever
 * section the viewer actually has on screen.
 */
export default function LiquidAurora({ ref }: LiquidAuroraProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // The two children are the elements with the infinite spin animation;
    // animation-play-state on them is what actually halts GPU work.
    const spinners = el.querySelectorAll<HTMLDivElement>("[data-spin]");

    const observer = new IntersectionObserver(
      ([entry]) => {
        const state = entry.isIntersecting ? "running" : "paused";
        spinners.forEach((s) => {
          s.style.animationPlayState = state;
        });
      },
      { threshold: 0.01 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Bridge the external ref (used by useMouseParallax for layer parallax)
  // to the internal ref via a ref callback that writes both.
  const setRefs = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };

  return (
    <div
      ref={setRefs}
      className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen pointer-events-none opacity-[0.15] blur-[100px] z-0 will-change-transform"
    >
      <div
        data-spin
        className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_20s_linear_infinite]"
      />
      <div
        data-spin
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-gold to-petrol rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay"
      />
    </div>
  );
}
