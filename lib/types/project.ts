export type ContentBlockTheme = "light" | "dark";

export interface ContentBlock {
  id: string;
  type: "rich-text" | "image" | "video";
  theme?: "light" | "dark";
  heading?: string;
  body?: string; // For rich-text, this will contain HTML
  image?: string;
  videoUrl?: string;
}

export interface ProjectTheme {
  background: string;  // hex color e.g. "#121212"
  text: string;        // hex color e.g. "#F5F5F5"
  accent: string;      // hex color e.g. "#A8B4B8"
}

export interface Project {
  slug: string;
  title: string;
  tags: string[];
  image: string;
  launchUrl: string;
  description: string;
  details: string;
  services: string[];
  contentBlocks: ContentBlock[];
  theme: ProjectTheme;
}
