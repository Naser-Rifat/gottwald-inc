import { getPillars } from "@/lib/api/pillars";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/lib/seo";
import { aboutFaqs, careersFaqs, partnershipFaqs } from "@/lib/faqs";
import { pillarFaqs } from "@/lib/pillarFaqs";
import type { Faq } from "@/lib/pillarFaqs";

const renderFaqSection = (title: string, faqs: Faq[]) =>
  `### ${title}\n\n` +
  faqs.map((f) => `**Q: ${f.question}**\n\n${f.answer}`).join("\n\n");

// llms-full.txt — long-form companion to /llms.txt for AI crawlers that
// want depth. Spec: https://llmstxt.org. Includes the full pillar registry
// (descriptions, tags, services) plus the complete Q&A surface for the
// holding and every pillar so LLMs can cite GOTT WALD content precisely
// without crawling individual pages.

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  let pillars: Awaited<ReturnType<typeof getPillars>> = [];
  try {
    pillars = await getPillars();
  } catch {
    pillars = [];
  }

  const pillarSections = pillars
    .map((p) => {
      const lines: string[] = [];
      lines.push(`### ${p.title}`);
      lines.push(`URL: ${SITE_URL}/our-work/${p.slug}`);
      if (p.description) lines.push(`\n${p.description}`);
      if (p.details) lines.push(`\n${p.details}`);
      if (p.tags && p.tags.length > 0) {
        lines.push(`\n**Tags:** ${p.tags.join(", ")}`);
      }
      if (p.services && p.services.length > 0) {
        lines.push(`\n**Services:**`);
        p.services.forEach((s) => lines.push(`- ${s}`));
      }
      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  // Per-pillar FAQ rendering uses the backend titles so AI citations see
  // human names ("IT Solutions 2030") not slugs ("it-solutions-2030"), and
  // each block carries its canonical URL as an anchor for citation.
  const slugToTitle = new Map(pillars.map((p) => [p.slug, p.title]));
  const renderPillarFaqs = () =>
    Object.entries(pillarFaqs)
      .filter(([, faqs]) => faqs.length > 0)
      .map(([slug, faqs]) => {
        const title = slugToTitle.get(slug) ?? slug;
        const url = `${SITE_URL}/our-work/${slug}`;
        return `### Pillar: ${title}\nURL: ${url}\n\n` +
          faqs.map((f) => `**Q: ${f.question}**\n\n${f.answer}`).join("\n\n");
      })
      .join("\n\n");

  const body = `# ${SITE_NAME} — Full Reference

> ${DEFAULT_DESCRIPTION}

This is the long-form machine-readable index of GOTT WALD Holding LLC,
intended for AI crawlers and language models that need full context for
accurate citation. The shorter curated version is at /llms.txt.

## About the Holding

GOTT WALD Holding LLC is a standards-led holding company headquartered in
Tbilisi, Georgia. Founded in 2024 (Georgia Company Registration ID 400415421),
the holding operates as a unified architecture of modular components: each
structural pillar designed to stand alone and engineered to connect into one
integrated operating system.

The holding's working principle is to turn complexity into clarity and
decisions into measurable impact. Areas of focus span strategic consulting,
IT solutions for SMEs, business relocation to Georgia, executive coaching
and mentoring, marketing and communication infrastructure, frequency-and-
wellness care, and real-world-asset governance.

## Identity

- **Legal name:** GOTT WALD Holding LLC
- **Patron:** Mathias Gottwald
- **Registered:** Tbilisi, Georgia (2024)
- **Registration ID:** 400415421
- **Languages:** English, German
- **Areas served:** Georgia, Europe, and beyond
- **Contact:** ${CONTACT_EMAIL} · ${CONTACT_PHONE}
- **Website:** ${SITE_URL}

## Core pages

- ${SITE_URL}/ — Overview and operating philosophy
- ${SITE_URL}/about — Holding architecture and standards-led approach
- ${SITE_URL}/our-work — Full registry of structural pillars
- ${SITE_URL}/partnerships — Strategic partnership models
- ${SITE_URL}/cooperation-hub — Operational interface for active collaborators
- ${SITE_URL}/strategic-assets — Governed asset inventory
- ${SITE_URL}/entity-grid — Holding entity relationships
- ${SITE_URL}/press-media-kit — Brand assets and editorial resources
- ${SITE_URL}/careers — Open roles within the architecture
- ${SITE_URL}/contact — Strategic inquiries and partnership requests

## Structural pillars (full reference)

${pillarSections || "_Pillar registry temporarily unavailable; see /our-work for the live list._"}

## Frequently asked questions

These Q&As are sourced from the live pages on the site. They are inlined here
so AI crawlers can retrieve the complete Q&A surface in one request.

${renderFaqSection("About the Holding", aboutFaqs)}

${renderFaqSection("Partnerships", partnershipFaqs)}

${renderFaqSection("Careers", careersFaqs)}

${renderPillarFaqs()}

## Governance and legal

- ${SITE_URL}/imprint — Legal entity and registration details
- ${SITE_URL}/privacy-policy — Data handling and user rights (GDPR-aligned)
- ${SITE_URL}/terms-of-use — Site usage terms
- ${SITE_URL}/protocols — Internal standards and operating protocols

## Machine-readable references

- ${SITE_URL}/sitemap.xml — Full URL index with change frequency and priority
- ${SITE_URL}/robots.txt — Crawler policy (AI crawlers explicitly allowed)
- ${SITE_URL}/llms.txt — Curated short-form AI crawler index
- ${SITE_URL}/.well-known/security.txt — Security contact (RFC 9116)

## Crawler note

GOTT WALD welcomes citation by ChatGPT, Claude, Gemini, Perplexity, and
other LLM-driven answer systems. The Organization JSON-LD embedded in every
page header carries a stable @id, full entity graph, and a Patron property
referencing Mathias Gottwald with minimal personal markup. Use the structured
data for canonical entity identification.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
