import * as Sentry from "@sentry/nextjs";

// Next.js calls register() once per runtime (node + edge) at boot. We branch
// on NEXT_RUNTIME so each runtime loads its own config without dragging the
// node-only deps into the edge bundle.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
