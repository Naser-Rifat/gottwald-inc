import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { PILLARS_CACHE_TAG } from "@/lib/api/pillars";

// ─── CORS helper ─────────────────────────────────────────────────────────────
// The admin panel lives on a different origin (Vite dev / admin subdomain),
// so we must allow cross-origin POST + OPTIONS for cache purge requests.

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data: object, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders() });
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
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
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
      return json({ error: "REVALIDATION_SECRET is required in production." }, 500);
    }
    if (secret !== "") {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) return json({ error: "Unauthorized" }, 401);
    }

    // ── Parse body ────────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const tag = (body as { tag?: string }).tag || PILLARS_CACHE_TAG;

    // ── Revalidate ────────────────────────────────────────────────────────
    // @ts-expect-error Types in latest Next.js canary changed unexpectedly
    revalidateTag(tag);

    console.log(`[revalidate] Cache tag "${tag}" purged`);

    return json({ revalidated: true, tag, now: Date.now() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[revalidate] Error:", message);
    return json({ error: "Revalidation failed", message }, 500);
  }
}

/**
 * Quick GET for convenience — revalidates all pillars.
 * e.g. curl https://gottwald.world/api/revalidate?secret=xxx
 */
export async function GET(request: NextRequest) {
  const secret = getRevalidationSecret();
  if (secret === null) {
    return json({ error: "REVALIDATION_SECRET is required in production." }, 500);
  }
  if (secret !== "") {
    const param = request.nextUrl.searchParams.get("secret");
    if (param !== secret) {
      return json({ error: "Unauthorized" }, 401);
    }
  }

  // @ts-expect-error Types in latest Next.js canary changed unexpectedly
  revalidateTag(PILLARS_CACHE_TAG);
  console.log(`[revalidate] All pillars cache purged via GET`);

  return json({ revalidated: true, tag: PILLARS_CACHE_TAG, now: Date.now() });
}
