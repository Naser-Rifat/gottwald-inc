"use client";

import { useEffect } from "react";

export default function PagingScript() {
  useEffect(() => {
    const scrollbar = document.getElementById("scrollbar");
    const scrollbarHandle = document.getElementById("scrollbar-handle");

    if (!scrollbar || !scrollbarHandle) return;

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

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, []);

  return null;
}
