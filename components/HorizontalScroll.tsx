"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const getTotalWidth = () => wrapper.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        x: () => -getTotalWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${getTotalWidth()}`,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="horizontal-scroll-container">
      <div ref={wrapperRef} className="horizontal-scroll-wrapper">
        {children}
      </div>
    </div>
  );
}
