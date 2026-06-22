"use client";

import Link from "next/link";

interface ScrollerLinkProps {
  href: string;
  label: string;
  /** Show the turquoise "↗" reveal on the left (Directory variant). */
  showArrow?: boolean;
}

/**
 * Footer nav link with a vertical text-mask scroller: the white label
 * slides up while a turquoise copy slides in from below on hover. The
 * label is the accessible name (aria-label); inner spans are decorative
 * so screen readers don't read each line three times.
 */
export default function ScrollerLink({
  href,
  label,
  showArrow = false,
}: ScrollerLinkProps) {
  return (
    <Link
      href={href}
      translate="no"
      aria-label={label}
      className="notranslate group flex flex-row items-start py-2 text-left cursor-pointer w-max max-w-full"
    >
      {showArrow && (
        <span
          aria-hidden="true"
          className="text-turquoise font-light transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] text-lg w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 group-hover:mr-2 shrink-0 leading-normal"
        >
          ↗
        </span>
      )}

      <div
        aria-hidden="true"
        className="relative overflow-hidden flex items-start min-h-[1.5em] flex-1 min-w-0"
      >
        {/* Invisible spacer to define intrinsic width */}
        <span className="block text-base font-medium uppercase tracking-[0.15em] opacity-0 pointer-events-none leading-normal">
          {label}
        </span>

        <span className="absolute top-0 left-0 right-0 block text-base font-medium uppercase tracking-[0.15em] text-white/80 group-hover:-translate-y-[110%] transition-transform duration-900 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform transform-gpu leading-normal">
          {label}
        </span>
        <span className="absolute top-0 left-0 right-0 translate-y-[110%] block text-base font-medium uppercase tracking-[0.15em] text-turquoise group-hover:translate-y-0 transition-transform duration-900 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform transform-gpu leading-normal">
          {label}
        </span>
      </div>
    </Link>
  );
}
