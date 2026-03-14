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

    // 1. Setup Scrollbar logic
    function update() {
      updateScrollbar();
      rafId = window.requestAnimationFrame(update);
    }

    function updateScrollbar() {
      if (!scrollbar || !scrollbarHandle) return;
      const heightPerViewport = document.body.clientHeight / window.innerHeight;
      scrollbarHandle.style.height = `${scrollbar.clientHeight / heightPerViewport}px`;

      const scrollProgress = window.scrollY / document.body.clientHeight;
      scrollbarHandle.style.top = `${scrollProgress * 100}%`;
    }

    let rafId = window.requestAnimationFrame(update);

    // 2. Setup GSAP ScrollTriggers for Text Animation
    const ctx = gsap.context(() => {
      if (h1Topline) {
        ScrollTrigger.create({
          trigger: h1Topline,
          start: "top 95%", // trigger when element is 95% down the screen
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
      window.cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return null;
}
