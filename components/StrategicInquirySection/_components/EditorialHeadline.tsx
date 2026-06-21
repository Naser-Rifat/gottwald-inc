"use client";

import type { Ref } from "react";

interface EditorialHeadlineProps {
  /** Attached to the inner Playfair italic span; animated by useEntranceReveal. */
  ref?: Ref<HTMLSpanElement>;
}

export default function EditorialHeadline({ ref }: EditorialHeadlineProps) {
  return (
    <div className="lg:col-span-7 relative">
      <h2 className="strategic-reveal text-[clamp(3.5rem,6.5vw,8.5rem)] font-black leading-[0.83] tracking-[-0.055em] text-white uppercase opacity-0">
        Initiate <br />
        Strategic
        <span className="block pt-2 pb-[0.18em] overflow-hidden">
          <span
            ref={ref}
            className="block text-[0.85em] normal-case leading-[1] tracking-[-0.04em] text-turquoise"
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              transform: "translateY(100%)",
            }}
          >
            Alignment.
          </span>
        </span>
      </h2>
    </div>
  );
}
