import * as Sentry from "@sentry/nextjs";

// Edge runtime init (middleware, edge route handlers). Loaded by
// instrumentation.ts when NEXT_RUNTIME === "edge". Kept lightweight —
// edge bundle size matters more than node.

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
