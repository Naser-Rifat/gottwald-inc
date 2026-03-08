"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instantly move the dot
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Smooth render loop for outer ring
    const render = () => {
      // Lerp custom cursor to mouse position
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      // Only apply if we aren't magnetically snapped to an element
      if (!cursor.classList.contains("is-magnetic")) {
        gsap.set(cursor, {
          x: cursorX,
          y: cursorY,
        });
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    // Hide native cursor
    document.body.style.cursor = "none";

    // Set up hover states
    const setupHoverEvents = () => {
      // Find all interactive elements
      const links = document.querySelectorAll(
        "a, button, [data-magnetic], input, textarea",
      );

      links.forEach((link) => {
        // Prevent multiple bindings
        if (link.getAttribute("data-cursor-bound") === "true") return;
        link.setAttribute("data-cursor-bound", "true");

        link.addEventListener("mouseenter", (e) => {
          const target = e.currentTarget as HTMLElement;
          const isMagnetic =
            target.hasAttribute("data-magnetic") || target.tagName === "BUTTON";
          const isVideo = target.hasAttribute("data-video");

          if (isVideo) {
            // Morph into a large "PLAY" button
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
            // Magnetic snap to element box
            const rect = target.getBoundingClientRect();
            cursor.classList.add("is-magnetic");

            gsap.to(cursor, {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              width: rect.width + 20,
              height: rect.height + 20,
              borderRadius:
                window.getComputedStyle(target).borderRadius || "8px",
              borderColor: "rgba(212, 175, 55, 0.5)", // Gold border on hover
              backgroundColor: "rgba(212, 175, 55, 0.05)",
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(dot, { opacity: 0, duration: 0.2 });
          } else {
            // Standard link hover - just enlarge ring slightly
            gsap.to(cursor, {
              scale: 1.5,
              borderColor: "rgba(10, 147, 150, 0.8)", // Turquoise
              backgroundColor: "rgba(10, 147, 150, 0.1)",
              duration: 0.3,
            });
          }
        });

        link.addEventListener("mouseleave", () => {
          cursor.classList.remove("is-magnetic");

          // Restore default cursor state
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
        });
      });
    };

    // Run setup and setup mutation observer in case elements are added dynamically
    setupHoverEvents();

    // We observe the body for newly added elements
    const observer = new MutationObserver((mutations) => {
      let shouldSetup = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) shouldSetup = true;
      }
      if (shouldSetup) setupHoverEvents();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      document.body.style.cursor = "auto";
    };
  }, [pathname]);

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
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-turquoise rounded-full pointer-events-none z-10000 mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
