import * as Sentry from "@sentry/nextjs";

// Server-side Sentry init (Node runtime). Loaded by instrumentation.ts when
// NEXT_RUNTIME === "nodejs". DSN is server-side only here (not the public
// one) so we don't accidentally re-expose it; falls back to the public DSN
// for projects that share a single key.

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
