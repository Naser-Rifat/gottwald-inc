"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type SplitMode = "char" | "word";

interface UseSplitTextRevealArgs {
  ref: RefObject<HTMLElement | null>;
  /** Reactive text — when it changes (e.g. locale switch) the split rebuilds. */
  text: string;
  mode: SplitMode;
}

const buildChars = (text: string) =>
  text
    .split("")
    .map(
      (char) =>
        `<span class="inline-block overflow-hidden"><span class="char-mask inline-block translate-y-full opacity-0">${char === " " ? "&nbsp;" : char}</span></span>`,
    )
    .join("");

const buildWords = (text: string) =>
  text
    .split(" ")
    .map(
      (word) =>
        `<span class="inline-block overflow-hidden mr-[0.3em]" style="perspective:600px"><span class="tag-word inline-block" style="transform:translateY(120%) rotateX(-60deg);transform-origin:bottom center;opacity:0">${word}</span></span>`,
    )
    .join("");

/**
 * Replaces `ref`'s innerHTML with per-char or per-word spans, then
 * animates them in on scroll. Re-runs when `text` changes so locale
 * switches rebuild from fresh strings.
 *
 * Safety: caller must pass trusted text (i18n strings, not user input).
 * We use innerHTML for the split because the per-element transform
 * setup is verbose enough that JSX would explode for long strings.
 */
export function useSplitTextReveal({
  ref,
  text,
  mode,
}: UseSplitTextRevealArgs) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (mode === "char") {
        el.innerHTML = buildChars(text);
        gsap.to(el.querySelectorAll(".char-mask"), {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.025,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      } else {
        el.innerHTML = buildWords(text);
        gsap.to(el.querySelectorAll(".tag-word"), {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      }
    });

    return () => ctx.revert();
  }, [ref, text, mode]);
}
