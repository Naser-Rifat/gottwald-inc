"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function PagingScript() {
  useEffect(() => {
    const scrollbar = document.getElementById("scrollbar");
    const scrollbarHandle = document.getElementById("scrollbar-handle");
    const h1Topline = document.getElementById("h1-topline");
    const h1Tagline = document.getElementById("h1-tagline");

    if (!scrollbar || !scrollbarHandle || !h1Topline || !h1Tagline) return;

    let ticking = false;

    function updateScrollbar() {
      if (!scrollbar || !scrollbarHandle) return;
      const heightPerViewport = document.body.clientHeight / window.innerHeight;
      scrollbarHandle.style.height = `${scrollbar.clientHeight / heightPerViewport}px`;
      const scrollProgress = window.scrollY / document.body.clientHeight;
      scrollbarHandle.style.top = `${scrollProgress * 100}%`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollbar);
      }
    }

    updateScrollbar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollbar, { passive: true });

    const ctx = gsap.context(() => {
      if (h1Topline) {
        ScrollTrigger.create({
          trigger: h1Topline,
          start: "top 95%",
          onEnter: () => h1Topline.classList.add("animate"),
        });
      }

      if (h1Tagline) {
        ScrollTrigger.create({
          trigger: h1Tagline,
          start: "top 95%",
          onEnter: () => h1Tagline.classList.add("animate"),
        });
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollbar);
      ctx.revert();
    };
  }, []);

  return null;
}
