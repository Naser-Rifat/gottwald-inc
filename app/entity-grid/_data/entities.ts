/**
 * Directory of operating entities under the GOTT WALD holding.
 *
 * `size: "lg"` makes the card span 2 columns in the bento layout — used
 * to give the first and last entries presence on the desktop grid. All
 * other entries default to a single column. Mirrors the data-only
 * convention used by `app/our-work/_data/` and `app/about/_data/`.
 */
export interface Entity {
  /** Zero-padded directory number ("01"…"07"). */
  id: string;
  /** Display name of the entity. */
  name: string;
  /** One-sentence positioning copy under the title. */
  tagline: string;
  /** Strategic pillar this entity belongs to. */
  pillar: string;
  /** Operational status; rendered next to the live dot. */
  status: string;
  /** Bento card span — "lg" = 2 cols, "sm" = 1 col. */
  size: "lg" | "sm";
}

export const ENTITIES: ReadonlyArray<Entity> = [
  {
    id: "01",
    name: "GOTT WALD Holding",
    tagline: "Strategic holding structure and global operating framework.",
    pillar: "Foundation",
    status: "Active",
    size: "lg",
  },
  {
    id: "02",
    name: "PLHH.world",
    tagline: "Peace, Love & Harmony — for more Humanity.",
    pillar: "Community",
    status: "Active",
    size: "sm",
  },
  {
    id: "03",
    name: "YIG.CARE",
    tagline: "Human resonance, clarity, and inner strength.",
    pillar: "Wellbeing",
    status: "Active",
    size: "sm",
  },
  {
    id: "04",
    name: "IT Solutions 2030",
    tagline: "Engineered digital systems for the next decade.",
    pillar: "Technology",
    status: "Active",
    size: "sm",
  },
  {
    id: "05",
    name: "Relocation — Georgia",
    tagline: "Executive relocation and structure deployment.",
    pillar: "Operations",
    status: "Active",
    size: "sm",
  },
  {
    id: "06",
    name: "Consulting",
    tagline: "Strategic business clarity, direction, and execution.",
    pillar: "Advisory",
    status: "Active",
    size: "sm",
  },
  {
    id: "07",
    name: "Coaching & Mentoring",
    tagline: "Human development, transition, and aligned growth.",
    pillar: "Development",
    status: "Active",
    size: "lg",
  },
];
