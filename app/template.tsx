/**
 * Page-mount fade-up wrapper. Next.js mounts a fresh <Template> on
 * every route change, so this animation fires once per navigation —
 * same trigger semantics as the previous framer-motion implementation,
 * just CSS-driven.
 *
 * Keyframe + class live in `app/globals.css` (`.template-fade-in`).
 *
 * No `"use client"` directive — the CSS animation runs in the browser
 * automatically; there's nothing for React to hydrate.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="template-fade-in w-full h-full min-h-screen">
      {children}
    </div>
  );
}
