# Performance Baseline — 2026-06-22

Captured before Phase 1 of the optimization plan. Use these numbers as
the comparison point for every subsequent perf commit.

> ⚠️ **The initial-run table below is stale-server-skewed.** It was
> measured against a `next-server` process that had been running for
> hours. After Phase 1 step 1.1 we noticed that a fresh server restart
> alone halved the TBT numbers. The corrected fresh-server baseline
> (measured for `/` and `/partnerships` against an `npm start` that had
> just come up with the *same code*) sits in `reports/perf/baseline-fresh/`
> and is the true reference point for delta comparisons.
>
> **Fresh baseline (3-run median, OLD code, fresh server):**
> - `/`             Perf 63, LCP 7.5s, FCP 1.2s, **TBT 448ms**, CLS 0.000
> - `/partnerships` Perf 52, LCP 6.8s, FCP 1.2s, **TBT 1022ms**, CLS 0.000
>
> The other routes have not been re-baselined yet — when Phase 1 steps
> 1.2-1.5 ship, re-run those routes on a fresh server before claiming
> wins.

## Environment

| Setting | Value |
|---------|-------|
| Lighthouse version | `lighthouse@latest` (CLI, headless Chrome) |
| Form factor | mobile (default preset) |
| Throttling | simulate (Lighthouse default) |
| Server | `next start` (production build) on `localhost:3000` |
| Runs per route | 3 — median reported |
| Caveat | Localhost = zero network latency, so LCP for canvas-heavy pages reflects render time, not transfer time. **TBT is the most actionable metric** at this stage. |

## Per-route median (3-run median)

| Route          | Perf | LCP (ms) | FCP (ms) | TBT (ms) | CLS   | SI (ms) | TTI (ms) |
|----------------|-----:|---------:|---------:|---------:|------:|--------:|---------:|
| /              | 47   | 15 142   | 1 211    | 1 056    | 0.000 | 5 936   | 15 168   |
| /about         | 50   | 46 028   | 1 061    | 578      | 0.000 | 17 145  | 46 379   |
| /contact       | 54   | 14 846   | 1 060    | 642      | 0.000 | 5 698   | 14 962   |
| /careers       | 52   | 15 576   | 1 060    | 684      | 0.000 | 6 309   | 15 721   |
| /partnerships  | 40   | 16 187   | 1 212    | **1 935**| 0.000 | 7 974   | 17 775   |
| /our-work      | 54   | 14 893   | 1 211    | 642      | 0.000 | 5 834   | 15 003   |
| /entity-grid   | 53   | 13 864   | 1 061    | 671      | 0.000 | 5 744   | 14 477   |

## Targets (Core Web Vitals — mobile)

| Metric | Good   | Needs improvement | Poor |
|--------|--------|--------------------|------|
| LCP    | <2 500 | 2 500-4 000       | >4 000 |
| FCP    | <1 800 | 1 800-3 000       | >3 000 |
| TBT    | <200   | 200-600           | >600 |
| CLS    | <0.10  | 0.10-0.25         | >0.25 |

## Key observations

1. **FCP is healthy everywhere** (1.0-1.2s). The initial HTML + CSS path is fast.
2. **LCP is consistently terrible** (13-46s). Almost every route's largest contentful
   element is the WebGL/canvas content, which paints progressively and Lighthouse
   times only when the canvas reaches stable contents. Real network LCP will look
   different — verify against a deployed environment before celebrating wins here.
3. **TBT is the actionable headline number.**
   - `/partnerships` is the worst at 1.9s (10 GSAP timelines + horizontal pin).
   - `/` is second worst at 1.1s — but with high variance (run 1 was 4.6s, runs 2-3 ≈1s).
   - Other routes hover at 600-700ms — also above the 200ms "good" line.
4. **CLS is 0.000 everywhere** — no layout shift problems. One thing not to break.

## Bundle inventory

- Total `.next/static/chunks/`: **14 MB**
- Total JS payload across `.next/static/`: **2.72 MB**
- Top 5 chunks:
  - 701 KB — Three.js + R3F bundle (`0a61399225aba211.js`)
  - 225 KB — `2a750eb7a7d0fd31.js`
  - 218 KB — `c467bd2fcac876b5.js`
  - 172 KB — `6d4a54570da68bca.js`
  - 142 KB — `8a1ad373028935ec.js`
- CSS:
  - 212 KB — main stylesheet
  - 12 KB — secondary

## Reduced-motion audit

8 files honor `prefers-reduced-motion`. **13 files run infinite animations without
it** — these are the priority targets for Phase 1.4 (reduced-motion compliance) and
1.2 (off-screen pausing):

| Route | Files |
|-------|-------|
| /     | `HomeIntroSection.tsx`, `PhysicsSandboxSection/_hooks/useHeroEntrance.ts`, `StrategicInquirySection/_components/LiquidAurora.tsx` |
| /about    | `OutcomesSection.tsx` |
| /careers  | `ProcessSection.tsx`, `RolesByPillarSection.tsx`, `WhoWereLookingForSection.tsx` |
| /contact  | `BackgroundLayers.tsx`, `HeroSection.tsx` |
| /partnerships | `EquilibriumSection.tsx`, `HeroSection.tsx` |
| /our-work | `HeroSlide.tsx` |
| shared    | `components/canvas/AmbientAurora.tsx` |

## What to do next (per the v2 plan)

**Phase 1 — Cheap wins, behavior-only:**
1. Add `prefers-reduced-motion` skip to the 13 flagged files
2. Add IntersectionObserver pause to remaining infinite CSS animations
3. Consolidate 20 scattered `gsap.registerPlugin(ScrollTrigger)` into one bootstrap
4. Audit unthrottled scroll/mousemove listeners — add `{ passive: true }` or rAF gate
5. Remove `productionBrowserSourceMaps: true` from `next.config.ts`

Expected priority order by stop-condition impact:
- **/partnerships first** — highest TBT, biggest potential win
- **/ second** — variance in TBT suggests a fragile main-thread; investigate run-1 spike
- **/about** — investigate the 46s LCP (likely WebGL ambient canvas)

## Raw outputs

Every JSON is in this directory. Filename convention: `<route>-run<n>.json`.
