"use client";

import ScrollerLink from "./ScrollerLink";
import type { NavLink } from "../_data/nav";

interface NavColumnProps {
  title: string;
  links: ReadonlyArray<NavLink>;
  translateLabel: (key: string) => string;
  /** Directory variant gets the "↗" arrow reveal. */
  showArrow?: boolean;
  /** Override column-span / min-width if needed. */
  className?: string;
}

export default function NavColumn({
  title,
  links,
  translateLabel,
  showArrow = false,
  className = "lg:col-span-2 min-w-0",
}: NavColumnProps) {
  return (
    <div className={className}>
      <h4 className=" uppercase tracking-[0.3em] font-light text-turquoise mb-8">
        {title}
      </h4>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <ScrollerLink
            key={link.key}
            href={link.href}
            label={translateLabel(link.key)}
            showArrow={showArrow}
          />
        ))}
      </nav>
    </div>
  );
}
