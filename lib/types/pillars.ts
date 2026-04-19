export type ContentBlockTheme = "light" | "dark";

export interface ContentBlock {
  id?: string;
  type: "showcase" | "case-study" | "feature" | "stats" | "fullbleed" | "rich-text" | "image" | "video";
  theme?: ContentBlockTheme;
  heading?: string;
  body?: string;
  image?: string;
  videoUrl?: string;
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
  richText?: ContentBlock[];
}

export interface PillarTheme {
  background: string;
  text: string;
  accent: string;
}

export interface Offer {
  title: string;
  tier: "copper" | "silver" | "gold";
  description: string;
  deliverable: string;
}

export interface Pillar {
  slug: string;
  title: string;
  tags: string[];
  image: string;
  description: string;
  details: string;
  services: string[];
  recognitions?: string[];
  launchUrl?: string;
  theme: PillarTheme;
  contentBlocks?: ContentBlock[];
  offers?: Offer[];
}
