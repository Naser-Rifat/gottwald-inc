"use client";

import { useEffect } from "react";

// Sets the poster background on the overlay div via JS after hydration.
// Keeps the Cloudinary URL out of SSR HTML so it is never an LCP candidate.
// The H1 text wins LCP at FCP time (~1.5 s); the poster fades in ~1–2 s
// later as a decorative layer — imperceptible delay at 25% opacity.
export default function MobileHeroBg() {
  useEffect(() => {
    const el = document.getElementById("mobile-hero-bg");
    if (!el) return;
    const url =
      "https://res.cloudinary.com/dsfe6i3vf/video/upload/so_0,f_jpg,q_auto:low,w_800/v1778839135/gottwald_ixgowv.jpg";
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url('${url}')`;
      el.style.opacity = "0.25";
    };
    img.src = url;
  }, []);
  return null;
}
