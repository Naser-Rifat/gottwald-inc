import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

// PWA manifest — improves the mobile install prompt, the browser tab/window
// chrome tint on mobile, and adds a small AI-readable signal (name +
// description repeat) for engines that fetch /manifest.webmanifest during
// discovery. This isn't a full PWA (no service worker, no offline support);
// just the browser hints we get for free from declaring one.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Standards-Led Holding & Operations`,
    short_name: "GOTT WALD",
    description:
      "Standards-led holding company in Tbilisi, Georgia. Operating-grade systems for people and strategic assets.",
    start_url: "/",
    display: "standalone",
    background_color: "#070c14",
    // Matches layout.tsx viewport.themeColor — keeps the mobile status bar
    // tint consistent whether the site is opened as a PWA or a browser tab.
    theme_color: "#070c14",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "consulting", "productivity"],
    icons: [
      {
        src: "/logo.png",
        sizes: "160x160",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-horizontal.png",
        sizes: "600x327",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
