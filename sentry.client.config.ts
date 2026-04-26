import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry init. Loaded by instrumentation-client.ts.
// No-op when NEXT_PUBLIC_SENTRY_DSN is unset, so dev / preview deployments
// without Sentry credentials don't ship the SDK to users.

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    // Capture 10% of sessions in production. The site is low-traffic enough
    // that 100% would still fit the free tier, but 10% leaves headroom for
    // an unexpected traffic spike without burning quota.
    tracesSampleRate: 0.1,
    // Replays are disabled by default — they capture user interactions
    // (including sensitive form input) and trigger consent obligations
    // we haven't scoped. Enable explicitly per-page if needed.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Disable IP/cookie/headers/user-agent attachment on outgoing events.
    // Keeps Sentry traffic free of personal data so the privacy posture
    // (cookieless, GDPR-clean) holds without consent-obligation creep.
    sendDefaultPii: false,
  });
}
