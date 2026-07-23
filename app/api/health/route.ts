import { NextResponse } from "next/server";

// Traceability endpoint — lets ops verify which commit is live on which
// environment without cross-checking Vercel dashboards. Audit dated
// 2026-07-16 flagged "Production deployment traceability — no way to
// confirm which commit is serving traffic from outside Vercel."
//
// Vercel injects these at build time on every deployment. Locally (or
// self-hosted) they will be undefined; we surface `"unknown"` rather
// than 500 so the endpoint is still a valid liveness probe.
//
// The endpoint intentionally exposes only build metadata (commit SHA,
// branch, environment, build timestamp). It reveals nothing that isn't
// already visible in a repo — the commit SHA maps to a public GitHub
// commit on the client fork, and the environment string is one of
// three known values. No secrets, no versions of internal packages,
// no infrastructure details.

// BUILD_TIME is captured at module-eval time in the built bundle. On
// Vercel this happens during the build step, so it's frozen to the
// build wall-clock. Locally it re-runs on every dev-server restart.
const BUILD_TIME = new Date().toISOString();

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Never cache — an intermediary caching the response would return the
// PREVIOUS deployment's commit SHA after a rollout, defeating the whole
// point of the endpoint.
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Content-Type": "application/json",
} as const;

interface HealthResponse {
  status: "ok";
  commit: string;
  commitShort: string;
  branch: string;
  environment: string;
  region: string;
  buildTime: string;
  serverTime: string;
}

function readCommitSha(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    "unknown"
  );
}

export function GET() {
  const commit = readCommitSha();
  const body: HealthResponse = {
    status: "ok",
    commit,
    commitShort: commit === "unknown" ? "unknown" : commit.slice(0, 7),
    branch: process.env.VERCEL_GIT_COMMIT_REF || "unknown",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    region: process.env.VERCEL_REGION || "unknown",
    buildTime: BUILD_TIME,
    serverTime: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: 200, headers: NO_CACHE_HEADERS });
}

export function HEAD() {
  return new NextResponse(null, { status: 200, headers: NO_CACHE_HEADERS });
}
