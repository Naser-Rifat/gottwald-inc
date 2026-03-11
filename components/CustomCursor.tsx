"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";


export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Fast tracking for the small dot
    let mouseX = 0;
    let mouseY = 0;

    // Smoothed tracking for the outer ring
    let cursorX = 0;
    let cursorY = 0;

    // Highly optimized GSAP setters (prevents 60fps GC spikes from creating new tweens)
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const cursorXSet = gsap.quickSetter(cursor, "x", "px");
    const cursorYSet = gsap.quickSetter(cursor, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instantly move the dot (100x faster than gsap.to)
      dotX(mouseX);
      dotY(mouseY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Smooth render loop for outer ring
    let rAF: number;
    const render = () => {
      // Lerp custom cursor to mouse position
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      // Only apply if we aren't magnetically snapped to an element
      if (!cursor.classList.contains("is-magnetic")) {
        cursorXSet(cursorX);
        cursorYSet(cursorY);
      }

      rAF = requestAnimationFrame(render);
    };

    rAF = requestAnimationFrame(render);

    // Hide native cursor
    document.body.style.cursor = "none";

    // Global event delegation for hover states (replaces heavy MutationObserver)
    let activeTarget: HTMLElement | null = null;
    
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest(
        "a, button, [data-magnetic], input, textarea"
      ) as HTMLElement;
      
      if (!target) return;
      if (activeTarget === target) return;
      activeTarget = target;

      const isMagnetic = target.hasAttribute("data-magnetic");
      const isVideo = target.hasAttribute("data-video");

      if (isVideo) {
        gsap.to(cursor, {
          width: 100,
          height: 100,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          duration: 0.3,
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        if (textRef.current) {
          textRef.current.innerHTML = "PLAY";
          gsap.to(textRef.current, { opacity: 1, scale: 1, duration: 0.3 });
        }
      } else if (isMagnetic) {
        const rect = target.getBoundingClientRect();
        cursor.classList.add("is-magnetic");

        gsap.to(cursor, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 20,
          height: rect.height + 20,
          borderRadius: window.getComputedStyle(target).borderRadius || "8px",
          borderColor: "rgba(212, 175, 55, 0.5)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(cursor, {
          scale: 1.5,
          borderColor: "rgba(10, 147, 150, 0.8)",
          backgroundColor: "rgba(10, 147, 150, 0.1)",
          duration: 0.3,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!activeTarget) return;

      const related = e.relatedTarget as Element | null;
      if (related && activeTarget.contains(related)) return;

      activeTarget = null;
      cursor.classList.remove("is-magnetic");

      gsap.to(cursor, {
        width: 40,
        height: 40,
        scale: 1,
        borderRadius: "50%",
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "transparent",
        backdropFilter: "none",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(dot, { opacity: 1, duration: 0.3 });

      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rAF);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-9999 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <span
          ref={textRef}
          className="opacity-0 scale-50 text-[10px] font-bold tracking-widest text-white absolute"
        ></span>
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-10000 shadow-[0_0_10px_rgba(255,255,255,0.5)] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
