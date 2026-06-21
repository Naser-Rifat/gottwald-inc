"use client";

import { useEffect, useState } from "react";

export function useActiveSnapSection(selector = ".snap-section", threshold = 0.5) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.getAttribute("data-index")));
          }
        });
      },
      { threshold },
    );

    const sections = document.querySelectorAll(selector);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [selector, threshold]);

  return activeIndex;
}
