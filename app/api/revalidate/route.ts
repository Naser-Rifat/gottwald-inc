import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { PILLARS_CACHE_TAG } from "@/lib/api/pillars";

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
    const secret = process.env.REVALIDATION_SECRET;
    if (secret) {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
    }

    // ── Parse body ────────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const tag = (body as { tag?: string }).tag || PILLARS_CACHE_TAG;

    // ── Revalidate ────────────────────────────────────────────────────────
    // Next.js 16 experimental types require a second argument for cache life profile
    // @ts-expect-error Types in latest Next.js canary changed unexpectedly
    revalidateTag(tag);

    console.log(`[revalidate] Cache tag "${tag}" purged`);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[revalidate] Error:", message);
    return NextResponse.json(
      { error: "Revalidation failed", message },
      { status: 500 },
    );
  }
}

/**
 * Quick GET for convenience — revalidates all pillars.
 * e.g. curl https://gottwald.world/api/revalidate?secret=xxx
 */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  if (secret) {
    const param = request.nextUrl.searchParams.get("secret");
    if (param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Next.js 16 experimental types require a second argument for cache life profile
  // @ts-expect-error Types in latest Next.js canary changed unexpectedly
  revalidateTag(PILLARS_CACHE_TAG);
  console.log(`[revalidate] All pillars cache purged via GET`);

  return NextResponse.json({
    revalidated: true,
    tag: PILLARS_CACHE_TAG,
    now: Date.now(),
  });
}
