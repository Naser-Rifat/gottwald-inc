import { getPillars } from "@/lib/api/pillars";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  CONTACT_EMAIL,
} from "@/lib/seo";

// llms.txt — curated index for AI crawlers (ChatGPT, Claude, Perplexity,
// Gemini). Spec: https://llmstxt.org. Served at /llms.txt as text/plain.
// Generated as a route so the pillar list stays in sync with the backend
// without a build-time regeneration step.

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  let pillars: { slug: string; title: string; description: string }[] = [];
  try {
    const fetched = await getPillars();
    pillars = fetched.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
    }));
  } catch {
    pillars = [];
  }

  const pillarLines = pillars
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/pillars/${p.slug})${p.description ? `: ${p.description}` : ""}`,
    )
    .join("\n");

  const body = `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

GOTT WALD Holding LLC is a standards-led holding company headquartered in
Tbilisi, Georgia (founded 2024, Georgia Company Registration ID 400415421).
The holding operates as a unified architecture of modular components — each
pillar designed to stand alone and engineered to connect into one integrated
operating system. Areas of focus include strategic consulting, IT solutions
for SMEs, business relocation to Georgia, executive coaching and mentoring,
marketing and communication infrastructure, frequency-and-wellness care,
and real-world-asset governance.

Languages: English, German. Areas served: Georgia and Europe.
Contact: ${CONTACT_EMAIL}.

## Core pages

- [Home](${SITE_URL}/): Overview of GOTT WALD Holding and its operating philosophy.
- [About](${SITE_URL}/about): Holding architecture, principles, and standards-led approach.
- [Our Work](${SITE_URL}/our-work): Full registry of structural pillars.
- [Partnerships](${SITE_URL}/partnerships): Strategic partnership models and engagement framework.
- [Cooperation Hub](${SITE_URL}/cooperation-hub): Operational interface for active collaborators.
- [Strategic Assets](${SITE_URL}/strategic-assets): Governed asset inventory and stewardship model.
- [Entity Grid](${SITE_URL}/entity-grid): Holding entity relationships and structural map.
- [Press & Media Kit](${SITE_URL}/press-media-kit): Brand assets, biographies, and editorial resources.
- [Careers](${SITE_URL}/careers): Open roles within the GOTT WALD architecture.
- [Contact](${SITE_URL}/contact): Strategic inquiries and partnership requests.

## Structural pillars
${pillarLines || "- (Pillar registry temporarily unavailable — see /our-work for the live list.)"}

## Governance and legal

- [Imprint](${SITE_URL}/imprint): Legal entity and registration details.
- [Privacy Policy](${SITE_URL}/privacy-policy): Data handling and user rights.
- [Terms of Use](${SITE_URL}/terms-of-use): Site usage terms.
- [Protocols](${SITE_URL}/protocols): Internal standards and operating protocols.

## Machine-readable references

- [Sitemap](${SITE_URL}/sitemap.xml): Full URL index with change frequency and priority.
- [Robots](${SITE_URL}/robots.txt): Crawler policy (AI crawlers explicitly allowed).
- [Organization JSON-LD](${SITE_URL}/): Embedded on the home page; see <script type="application/ld+json">.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
