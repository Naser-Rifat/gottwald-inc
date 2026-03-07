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
  description: string;
  details: string;
  services: string[];
  recognitions?: string[];
  launchUrl?: string;
  theme: ProjectTheme;
}

export const projects: Project[] = [
  {
    slug: "dream-machine",
    title: "Porsche:\nDream Machine",
    tags: ["CONCEPT", "3D ILLUSTRATION", "MOGRAPH", "VIDEO"],
    image: "/assets/projects/dream-machine.png",
    description:
      "Lusion was commissioned by Wallpaper* and Porsche GB to create a CG short film captured the visionary dreams of Porsche's founder, Ferry Porsche.",
    details:
      "Our Creative Director Edan Kwan introduced a 4 phases journey to take the audiences through the evolution of Porsche's sports cars through digital art and motion graphics. The artwork was also made public at Outernet features 23,000 square feet of giant wrap-around, floor-to-ceiling 16K LED screens in central London.",
    services: ["Concept", "3D Design", "Motion Design", "Compositing"],
    recognitions: ["Wallpaper*", "Porsche Newsroom", "Litsuit"],
    theme: {
      background: "#ead1ce",
      text: "#000000",
      accent: "#8c1e22",
    },
  },
  {
    slug: "synthetic-human",
    title: "Synthetic\nHuman",
    tags: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/assets/projects/synthetic-human.png",
    description:
      "We worked with Fantasy to launch the campaign website for their new AI product Synthetic Humans.",
    details:
      "In the project, we developed a system in Houdini FX to optimize the high quality 3D assets and built the interactive front-end layer of the website. We also designed and developed the procedural animations and other vfx used in the experience.",
    services: [
      "Creative Direction",
      "Design",
      "3D Development",
      "WebGL",
      "Animation",
    ],
    recognitions: ["Awwwards SOTD", "FWA of the Day", "Webby Nominee"],
    launchUrl: "https://synthetic-humans.ai/",
    theme: {
      background: "#b7adfd",
      text: "#101018",
      accent: "#3b2a82",
    },
  },
  {
    slug: "spatial-fusion",
    title: "Meta:\nSpatial Fusion",
    tags: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
    image: "/assets/projects/spatial-fusion.png",
    description:
      "A mixed reality experience for Meta Quest, blending physical and digital worlds through spatial computing.",
    details:
      "Interactive crystal environments respond to user presence and gesture. We pushed the boundaries of WebXR to create an immersive AR experience that seamlessly merges digital objects with the physical world.",
    services: [
      "Concept",
      "WebXR Development",
      "3D Modeling",
      "Spatial Design",
      "Interaction Design",
    ],
    theme: {
      background: "#1e1332",
      text: "#ffffff",
      accent: "#a970ff",
    },
  },
  {
    slug: "choo-choo-world",
    title: "Choo Choo\nWorld",
    tags: ["CONCEPT", "WEB", "GAME DESIGN", "3D"],
    image: "/assets/projects/choo-choo-world.png",
    description:
      "A whimsical interactive game world featuring miniature landscapes, trains, and playful architecture.",
    details:
      "Designed to bring joy through colorful, toy-like 3D environments. Players explore a vibrant floating island filled with charming buildings, winding railroads, and delightful surprises around every corner.",
    services: [
      "Game Design",
      "3D World Building",
      "Character Design",
      "WebGL Development",
      "Sound Design",
    ],
    theme: {
      background: "#a5d6a7",
      text: "#1e3a1f",
      accent: "#2e7d32",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (index + 1) % projects.length;
  return projects[nextIndex];
}
