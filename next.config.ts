import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

// next-intl without URL-based locale routing. Locale is resolved in
// i18n/request.ts from the googtrans cookie so hero copy (owned by
// next-intl) stays in sync with the Google Translate pill (owns body copy).
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Security headers applied to every route. CSP is intentionally
// permissive on `style-src` ('unsafe-inline') because Next.js App Router
// emits inline style attributes for RSC; tighter policy breaks rendering.
// Script is tightened against XSS but still allows the Next.js runtime.
const securityHeaders = [
  // Force HTTPS for 2 years including subdomains. Preloaded domains qualify
  // for the browser HSTS preload list once this is live on production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disallow framing entirely — the site is not designed to be embedded.
  { key: "X-Frame-Options", value: "DENY" },
  // Block MIME-type sniffing (defense-in-depth for uploaded assets).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to third parties, but keep enough context for CDNs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable permissions for features the site doesn't use.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  // Cross-Origin policy — keeps third-party iframes/windows isolated from
  // the app's origin while still allowing standard CDN asset loading.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' + 'unsafe-eval' required by Next.js runtime / React DevTools.
      // Google Translate loads widget + supportedLanguages from multiple Google hosts;
      // translate-pa.googleapis.com is the newer GT API endpoint.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com",
      "script-src-elem 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com",
      // Inline styles are emitted by RSC; we accept the trade-off. GT injects a stylesheet from translate.googleapis.com.
      "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com https://fonts.googleapis.com",
      // Cloudinary CDN + backend media + data URIs (noise SVG) + blob (for runtime-generated imagery) + GT icons/SVG.
      "img-src 'self' data: blob: https://res.cloudinary.com https://gottwald-backend.onrender.com https://translate.googleapis.com https://www.gstatic.com https://fonts.gstatic.com https://www.google.com",
      // Video/audio assets served locally; blob for decoded streams.
      "media-src 'self' blob: https://res.cloudinary.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Backend API + same-origin form submissions + GT translation API endpoints.
      // Sentry EU ingest (the project lives in the .de region —
      // sentry.client.config.ts uses the matching DSN).
      "connect-src 'self' https://gottwald-backend.onrender.com https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com https://*.ingest.de.sentry.io",
      // GT falls back to an iframe on www.google.com for some UI chrome.
      "frame-src https://www.google.com https://translate.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      // Enable WASM execution (Rapier3D physics).
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "80",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "gottwald-backend.onrender.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

};

// Sentry build-time wrapper. Uploads source maps when SENTRY_AUTH_TOKEN is
// set in CI/Vercel; otherwise it's a near-no-op that still wires up the
// runtime tunnel route. `silent: !process.env.CI` keeps local builds quiet.
const sentryWebpackOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Tunnel client errors through /monitoring to dodge ad-blockers that
  // block direct requests to *.ingest.sentry.io. Same-origin → no extra CSP.
  tunnelRoute: "/monitoring",
  disableLogger: true,
  // Don't fail the production build if Sentry's release-creation step
  // hits a transient error — error reporting will still work at runtime.
  errorHandler: (err: Error) => {
    console.warn("[sentry] non-fatal build error:", err.message);
  },
};

export default withSentryConfig(withNextIntl(nextConfig), sentryWebpackOptions);
