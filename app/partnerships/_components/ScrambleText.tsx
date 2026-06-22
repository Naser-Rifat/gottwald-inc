"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\\\/[]{}—=+*^?#";

/**
 * Text component that does a cyberpunk-style character-scramble reveal
 * when `isActive` flips to true. Each character lands one-by-one (half
 * a position per 30ms tick) and the unrendered positions show a random
 * symbol from `SCRAMBLE_CHARS`.
 *
 * Used in the accordion header so the active item's title visibly
 * "decodes" as the accordion opens — a tactile editorial signal that
 * the section is now active.
 */
export default function ScrambleText({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isActive) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) return text[index];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);
    return () => clearInterval(interval);
  }, [text, isActive]);

  return <>{isActive ? displayText : text}</>;
}
