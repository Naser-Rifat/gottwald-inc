/**
 * Editorial "5 principles" copy that powers the pinned cinematic
 * showcase ("WHAT WE DO DIFFERENTLY") in the About page.
 *
 * Pure data — no React, no DOM dependencies. The reason this lives in
 * a `_data/` module rather than inline in the section component is so
 * other modules (e.g. SEO ld+json, an internal CMS-sync script, or any
 * future principle-index page) can import the same canonical list
 * without having to render or fork the JSX. Mirrors the convention used
 * by `/our-work/_data/coreStandards.ts`.
 */
export interface Principle {
  /** Display number, zero-padded ("01"…"05"). */
  num: string;
  /** Top-level principle label shown above the title (uppercase mono). */
  principle: string;
  /** Editorial title for the principle. */
  title: string;
  /** Body copy explaining the principle. */
  desc: string;
  /** Cinematic anchor image for the pinned stage. */
  image: string;
}

export const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    num: "01",
    principle: "CLARITY",
    title: "We remove noise until only truth remains",
    desc: "Most problems aren't complex — they're just hidden. We reveal what truly drives the system: root cause, leverage, sequence.",
    image: "/about/pillar_signal_premium_1781530213416.png",
  },
  {
    num: "02",
    principle: "LIGHTNESS",
    title: "We make decisions light again",
    desc: 'When a system becomes clear, decisions almost make themselves. Not because it\'s "easy," but because it is finally ordered.',
    image: "/about/pillar_lightness_premium_1781530200059.png",
  },
  {
    num: "03",
    principle: "SIGNAL",
    title: "We build signal, not volume",
    desc: "Marketing is not a campaign. It's Trust & Demand Infrastructure: positioning, proof architecture, messaging, conversion — built so premium clients and top talent take you seriously immediately.",
    image: "/about/pillar_presence_premium_1781530240970.png",
  },
  {
    num: "04",
    principle: "INFRASTRUCTURE",
    title: "We treat technology as infrastructure",
    desc: "Websites are not business cards. They are discovery, trust, conversion, scale — including SEO and AI indexing. With IT Solutions 2030, we transform outdated presences into future-ready digital infrastructure.",
    image: "/about/pillar_infrastructure_premium_1781530227488.png",
  },
  {
    num: "05",
    principle: "PRESENCE",
    title: "We strengthen the human behind the system",
    desc: "Because the best strategy fails when the person behind it is burning out or drifting. Coaching & Mentoring with us means regulation, focus, clarity, identity — so performance becomes sustainable.",
    image: "/about/pillar_clarity_premium_1781530185774.png",
  },
];
