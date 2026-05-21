// Next.js loads this file in the browser before the app boots. Keep it
// minimal — anything imported eagerly here ships in the initial JS payload
// and blocks the main thread before first paint.
//
// Sentry weighs ~120 KB gzipped and contributes ~500ms of Total Blocking Time
// during its `Sentry.init()` call. Errors thrown in the first ~1.5s of a page
// load are rare (the user has barely started interacting) and the marketing
// pages have no user-input boundaries that early. Trading sub-2-second error
// capture for a measurably faster LCP/TBT is the right call for this site.
//
// Behavior:
// - When the browser becomes idle (or after 1.5s as a fallback), we dynamically
//   import the Sentry config module. That side-effect-import triggers
//   `Sentry.init()`. From that point on, error capture works normally.
// - When `NEXT_PUBLIC_SENTRY_DSN` is unset (dev, preview without secrets),
//   `sentry.client.config` already no-ops on its own.

if (typeof window !== "undefined") {
  const loadSentry = () => {
    import("./sentry.client.config").catch(() => {
      // Sentry chunk failed to load — error capture stays off. The page
      // continues to work; this is not a fatal condition.
    });
  };

  // `requestIdleCallback` is the right tool here: it fires when the browser
  // has nothing better to do. The 3s timeout cap ensures Sentry initializes
  // even on long-running task chains.
  if ("requestIdleCallback" in window) {
    (window as Window & typeof globalThis).requestIdleCallback(loadSentry, {
      timeout: 3000,
    });
  } else {
    // Safari pre-iOS 18.4 and a few older browsers lack requestIdleCallback.
    // setTimeout 1500 is the conventional fallback — clears the LCP/TBT
    // measurement window which Lighthouse cares about most.
    setTimeout(loadSentry, 1500);
  }
}
