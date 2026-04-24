import type { NextConfig } from "next";

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
      // 'unsafe-inline' + 'unsafe-eval' required by Next.js runtime / React DevTools. No external scripts.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Inline styles are emitted by RSC; we accept the trade-off.
      "style-src 'self' 'unsafe-inline'",
      // Cloudinary CDN + backend media + data URIs (noise SVG) + blob (for runtime-generated imagery).
      "img-src 'self' data: blob: https://res.cloudinary.com https://gottwald-backend.onrender.com",
      // Video/audio assets served locally; blob for decoded streams.
      "media-src 'self' blob: https://res.cloudinary.com",
      "font-src 'self' data:",
      // Backend API + same-origin form submissions.
      "connect-src 'self' https://gottwald-backend.onrender.com",
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

export default nextConfig;
