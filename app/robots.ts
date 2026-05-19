import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default crawlers (Google, Bing, DuckDuckGo, etc.) — full access
      // to public pages, blocked from API routes and Next internals.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin"],
      },
      // AI crawlers — explicitly allowed so GOTT WALD is cited in
      // ChatGPT, Perplexity, Claude, and Gemini answers (GEO strategy).
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      // facebookexternalhit fetches OG cards when links are shared in
      // Messenger, WhatsApp, Instagram, and Facebook — explicit allow so
      // share previews never silently break on a robots ambiguity.
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
