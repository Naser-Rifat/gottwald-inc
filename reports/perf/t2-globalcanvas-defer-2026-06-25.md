# T2 — GlobalCanvas interaction-defer (2026-06-25) — REVERTED

## What I tried

Gated `<GlobalCanvasLoader/>`'s render behind first user interaction
(`pointerdown` / `keydown` / `touchstart` / `scroll`) with a 3s
`requestIdleCallback` fallback. Added a module-level singleton in
`lib/usePageColorShift.ts` so the canvas could read the current route's
brand color when it mounted late (otherwise it would snap from default
gold).

Goal: push the three.js + R3F parse cost (~1.2 MB) past the TBT
measurement window.

## Result — Lighthouse delta (3-run averages, mobile, simulate)

| Route | Post-T5 TBT | Post-T2 TBT | Δ |
|---|---:|---:|---:|
| `/` home | ~400ms | ~454ms (506/417/440) | **+54ms** |
| `/partnerships` | ~303ms | ~311ms (320/281/331) | +8ms (noise) |
| `/entity-grid` | ~141ms | ~162ms (161/165/159) | +21ms (noise) |

Perf scores moved with TBT: home 66 → 64, partnerships 70 → 69,
entity-grid 75 → 75.

## Why it didn't work

Lighthouse's simulate mode doesn't model user input. The 3s idle-callback
fallback fires unconditionally during measurement — so the three.js
parse still lands inside the [FCP, TTI] window. We didn't escape TBT;
we shifted the heavy work to a later moment inside the same window.

On the home route, this had a measurable negative effect because the
IntroPortal's own WebGL canvas was already loading early. When
GlobalCanvas's parse work slid into a later slot, it collided with
IntroPortal's hydration / first-frame work. Combined long-task density
in that window got worse, not better.

For T2 to be net-positive on Lighthouse:
- The canvas chunk fetch + parse would have to complete AFTER TTI, or
- The deferred slot would have to contain significantly less other
  work than the original eager-load moment.

Neither holds on home; the other two routes show the change is at best
a wash.

## Status

**Reverted.** Restored:
- `components/canvas/GlobalCanvasLoader.tsx` to the eager `dynamic({ ssr: false })` form
- `components/canvas/GlobalCanvas.tsx` — removed singleton seed-on-mount
- `lib/usePageColorShift.ts` — removed the `latestPageColor` singleton

T5 wins remain shipped and intact.

## What this teaches

"Defer the heavy chunk" is intuitive but only pays off in Lighthouse
when the deferred work lands outside the measurement window. For
ambient backgrounds that need to appear within seconds, that window
boundary (TTI) is closer than the defer point — the chunk still loads,
parses, and blocks the main thread inside TBT, just later.

T5's IO-gating worked because the gated canvases live well below the
fold — they don't load at all during Lighthouse's headless run, so the
chunks genuinely leave the critical path. GlobalCanvas can't use that
strategy because it's the page-wide background.

## Phase 2 final cumulative results

`/partnerships`:
- Pre-Phase-2: perf 50, TBT 1350ms
- Post-T1 + T5: perf 70, TBT ~303ms
- **Net: perf +20, TBT −1047ms (−77%)**

Other routes: small wins from T1 only, within run-to-run noise but no
regressions.
