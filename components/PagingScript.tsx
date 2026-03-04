"use client";

import { useEffect } from "react";

export default function PagingScript() {
  useEffect(() => {
    const scrollbar = document.getElementById("scrollbar");
    const scrollbarHandle = document.getElementById("scrollbar-handle");
    const h1Topline = document.getElementById("h1-topline");
    const h1Tagline = document.getElementById("h1-tagline");

    if (!scrollbar || !scrollbarHandle || !h1Topline || !h1Tagline) return;

    function isElementOnScreen(element: HTMLElement): Promise<boolean> {
      const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      };

      return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              resolve(true);
              observer.disconnect();
            } else {
              resolve(false);
            }
          });
        }, observerOptions);

        observer.observe(element);
      });
    }

    function onScroll() {
      function isElementOnScreenCallback(
        element: HTMLElement,
        isOnScreen: boolean,
      ) {
        if (isOnScreen) {
          element.classList.add("animate");
        } else {
          element.classList.remove("animate");
        }
      }
      if (h1Topline) {
        isElementOnScreen(h1Topline).then((isOnScreen) =>
          isElementOnScreenCallback(h1Topline!, isOnScreen),
        );
      }
      if (h1Tagline) {
        isElementOnScreen(h1Tagline).then((isOnScreen) =>
          isElementOnScreenCallback(h1Tagline!, isOnScreen),
        );
      }
    }

    function update() {
      updateScrollbar();
      window.requestAnimationFrame(update);
    }

    function updateScrollbar() {
      if (!scrollbar || !scrollbarHandle) return;
      const heightPerViewport = document.body.clientHeight / window.innerHeight;
      scrollbarHandle.style.height = `${scrollbar.clientHeight / heightPerViewport}px`;

      const scrollProgress = window.scrollY / document.body.clientHeight;
      scrollbarHandle.style.top = `${scrollProgress * 100}%`;
    }

    window.addEventListener("scroll", onScroll);
    const rafId = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
