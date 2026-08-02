import { Resend } from "resend";

// Lazy singleton — the Resend SDK's constructor throws synchronously if
// the API key is missing. A module-level `new Resend(...)` would run
// during Next.js's build-time "collect page data" step for every route
// that imports this file, which crashes the ENTIRE production build if
// RESEND_API_KEY isn't set on that specific deploy target — not just
// this one email route. That exact failure took production down for
// 18 days (2026-07-17 to 2026-08-02) after the env var went missing on
// this Vercel project; every commit in between built successfully
// locally but failed on Vercel with "Missing API key."
//
// Constructing lazily on first actual use means a missing key only
// breaks email sending at request time (a normal caught error), never
// the build itself.
let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}