import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { PILLARS_CACHE_TAG } from "@/lib/api/pillars";

// Paths that consume pillar data and must be regenerated after an
// admin edit. revalidateTag alone purges the fetch data cache; the
// explicit revalidatePath calls below force the page HTML to be
// rebuilt on the next request, which is more reliable across Next.js
// versions / Vercel cache layers.
const PILLAR_DEPENDENT_PATHS: ReadonlyArray<[string, "page" | "layout"]> = [
  ["/", "page"],                  // home — pillar tiles section
  ["/our-work", "page"],          // pillar grid
  ["/our-work/[slug]", "page"],   // every dynamic pillar detail route
  ["/llms.txt", "page"],          // AI-discovery feed (uses getPillars)
  ["/llms-full.txt", "page"],     // expanded AI-discovery feed
];

// Next.js 16 changed `revalidateTag` to require a second `profile`
// argument (string | { expire: number }). `{ expire: 0 }` means
// "immediately expire any cached entry tagged with this." Previously
// the codebase called the old 1-arg form with `@ts-expect-error`,
// which compiled but silently no-op'd in Next.js 16 — that's why
// admin edits were not reaching the public site.
function purgePillarCache(tag: string): void {
  revalidateTag(tag, { expire: 0 });
  for (const [path, type] of PILLAR_DEPENDENT_PATHS) {
    revalidatePath(path, type);
  }
}

// ─── CORS helper ─────────────────────────────────────────────────────────────
// The admin panel lives on a different origin (Vite dev / admin subdomain),
// so we must allow cross-origin POST + OPTIONS for cache purge requests.
//
// Independent audit dated 2026-07-16 flagged the previous wildcard
// `Access-Control-Allow-Origin: *` as CORS 2/10 — any origin could invoke
// the endpoint from a browser session. Combined with a leaked
// REVALIDATION_SECRET this becomes a purge-abuse vector.
//
// Now we allow only known admin origins. Anything else gets no CORS
// headers — the browser rejects the response before it reaches JS.
//
// Server-to-server callers (Django backend firing on post_save signals)
// don't send an Origin header, so they still work unaffected.

// Production origins that legitimately call /api/revalidate. Anything not
// on this list receives no Access-Control-Allow-Origin header and gets
// rejected by the browser before the response reaches JS.
const PRODUCTION_ALLOWED = [
  "https://admin.gottwald.world",     // custom admin panel (Vite)
  "https://gottwald.world",           // public site (same-origin fetches still preflight in some modes)
  "https://www.gottwald.world",       // www variant of the public site
] as const;

// Development-only additions. Kept out of production builds so a leaked
// prod deploy can't be reached from localhost tabs.
const DEV_ALLOWED =
  process.env.NODE_ENV === "production"
    ? ([] as string[])
    : [
        "http://localhost:5173",      // Vite dev server (admin panel)
        "http://localhost:3000",      // Next.js dev / preview
      ];

const ALLOWED_ORIGINS = new Set<string>([...PRODUCTION_ALLOWED, ...DEV_ALLOWED]);

function corsHeaders(request?: Request): HeadersInit {
  const requestOrigin = request?.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : "";

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
  // Only echo the origin when it's on our allowlist. Omitting the header
  // entirely (rather than sending "null" or "false") is the safer default
  // — the browser rejects the response.
  if (allowOrigin) headers["Access-Control-Allow-Origin"] = allowOrigin;
  return headers;
}

function json(data: object, status = 200, request?: Request) {
  return NextResponse.json(data, { status, headers: corsHeaders(request) });
}

function getRevalidationSecret(): string | null {
  const secret = process.env.REVALIDATION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") return null;
  return "";
}

/**
 * Preflight for CORS — browsers send OPTIONS before a cross-origin POST
 * with JSON content-type.
 */
export function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

/**
 * On-demand revalidation endpoint.
 *
 * Call this after creating / updating / deleting a pillar in the admin panel
 * to immediately purge the Next.js cache so visitors see fresh data.
 *
 * Usage:
 *   POST /api/revalidate
 *   Body: { "tag": "pillars" }
 *   Header: Authorization: Bearer <REVALIDATION_SECRET>
 *
 * Or revalidate a specific pillar:
 *   POST /api/revalidate
 *   Body: { "tag": "pillar-my-slug" }
 *
 * The admin panel (Vite app at :5173) can call this after any CUD operation.
 */

export async function POST(request: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────────────────
    const secret = getRevalidationSecret();
    if (secret === null) {
      return json({ error: "REVALIDATION_SECRET is required in production." }, 500, request);
    }
    if (secret !== "") {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) return json({ error: "Unauthorized" }, 401, request);
    }

    // ── Parse body ────────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const tag = (body as { tag?: string }).tag || PILLARS_CACHE_TAG;

    // ── Revalidate ────────────────────────────────────────────────────────
    purgePillarCache(tag);

    console.log(`[revalidate] Cache tag "${tag}" purged + paths regenerated`);

    return json({ revalidated: true, tag, now: Date.now() }, 200, request);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[revalidate] Error:", message);
    return json({ error: "Revalidation failed", message }, 500, request);
  }
}

/**
 * Quick GET for convenience — revalidates all pillars.
 * e.g. curl https://gottwald.world/api/revalidate?secret=xxx
 */
export async function GET(request: NextRequest) {
  const secret = getRevalidationSecret();
  if (secret === null) {
    return json({ error: "REVALIDATION_SECRET is required in production." }, 500, request);
  }
  if (secret !== "") {
    const param = request.nextUrl.searchParams.get("secret");
    if (param !== secret) {
      return json({ error: "Unauthorized" }, 401, request);
    }
  }

  purgePillarCache(PILLARS_CACHE_TAG);
  console.log(`[revalidate] All pillars cache purged + paths regenerated via GET`);

  return json({ revalidated: true, tag: PILLARS_CACHE_TAG, now: Date.now() }, 200, request);
}
