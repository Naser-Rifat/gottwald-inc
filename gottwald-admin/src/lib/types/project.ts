export type ContentBlockTheme = "light" | "dark";

export interface ContentBlock {
  id: string;
  type: "rich-text";
  theme: ContentBlockTheme;
  heading?: string;
  body?: string;
  image?: string;
}

export interface ProjectTheme {
  background: string;
  text: string;
  accent: string;
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

export type CreateProjectPayload = Project;
export type UpdateProjectPayload = Partial<Project>;
