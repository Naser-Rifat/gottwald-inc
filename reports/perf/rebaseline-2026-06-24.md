# Performance Rebaseline — 2026-06-24

Captured after all of Phase 1 (steps 1.1-1.5) plus your interim commits
(`d92b048` shader rewrite, `9bcd2db` LCP optimization + heavy-component
deferrals, etc.) shipped. Same Lighthouse setup as the original baseline:
mobile preset, simulated throttling, 3 runs per route, median reported.

## Median across 3 runs (fresh server, latest HEAD)

| Route         | Perf | LCP     | FCP   | TBT   | CLS   | SI     | TTI   |
|---------------|-----:|--------:|------:|------:|------:|-------:|------:|
| /             | 62   | 7 503   | 1 210 | 484   | 0.000 | 3 854  | 8 000 |
| /about        | 61   | 32 305  | 1 210 | 247   | 0.000 | 11 455 | 32 806 |
| /contact      | 72   | 6 905   | 1 208 | 243   | 0.000 | 2 419  | 6 976 |
| /careers      | 70   | 6 690   | 1 209 | 299   | 0.000 | 2 598  | 6 809 |
| /partnerships | 50   | 6 870   | 1 208 | 1 350 | 0.000 | 4 011  | 7 995 |
| /our-work     | 75   | 6 976   | 1 207 | 140   | 0.000 | 2 068  | 7 042 |
| /entity-grid  | 74   | 6 845   | 1 207 | 173   | 0.000 | 2 690  | 6 895 |

## Deltas vs ORIGINAL stale-server baseline (2026-06-22)

> ⚠️ The original baseline ran against a server that had been up for
> hours. **Almost all the apparent "improvement" below is the fresh-server
> effect, not Phase 1 code work.** Don't take credit for what was a
> server-restart artifact.

| Route         | Perf Δ | LCP Δ   | TBT Δ | TBT %  |
|---------------|-------:|--------:|------:|-------:|
| /             | +15    | -7 639  | -572  | -54%   |
| /about        | +11    | -13 723 | -331  | -57%   |
| /contact      | +18    | -7 941  | -399  | -62%   |
| /careers      | +18    | -8 886  | -385  | -56%   |
| /partnerships | +10    | -9 317  | -585  | -30%   |
| /our-work     | +21    | -7 917  | -502  | -78%   |
| /entity-grid  | +21    | -7 019  | -498  | -74%   |

## Honest delta vs fresh-server baseline (apples-to-apples, only 2 routes available)

| Route         | Fresh OLD code | Fresh NEW code | TBT Δ | Perf Δ |
|---------------|---------------:|---------------:|------:|-------:|
| /             | 448 ms / 63    | 484 ms / 62    | **+36 ms (noise)** | -1 |
| /partnerships | 1 022 ms / 52  | 1 350 ms / 50  | **+328 ms (regression)** | -2 |

So:
- **/home: essentially unchanged.** TBT moved by 36ms which is comfortably
  inside the 3-run variance. Phase 1 had no measurable Lighthouse impact
  on the home page's load-time metrics.
- **/partnerships: slight regression.** TBT went from 1022 → 1350 ms.
  Possible causes: the new `useBackgroundMouseParallax` hook adds a
  micro setup cost; the `usePauseAnimationsOffscreen` adds a
  querySelectorAll on mount; the GSAP `repeat: -1` gates have a one-time
  matchMedia check. Each is microseconds individually but the section is
  already so heavy that the run-to-run noise is wide (lowest run TBT
  was 921, highest 1211).

## What changed but cannot be attributed precisely

For the other 5 routes (`/about`, `/contact`, `/careers`, `/our-work`,
`/entity-grid`), I never captured a "fresh-server, OLD code" baseline
on 2026-06-22. The big-looking improvements above include:

1. Server restart effect (the same thing that halved /home and
   /partnerships from the stale baseline)
2. Phase 1 code changes
3. Your interim commits — particularly `9bcd2db` which mentions LCP
   optimization, deferring heavy components, and disabling the initial
   page-transition curtain

Without isolating these contributions, I can't honestly say which slice
of the delta came from where.

## CWV target scoring

| Metric | Target | Status across routes |
|--------|--------|---------------------|
| LCP    | <2 500 ms | 🔴 Every route 6.7s+ (most are 6.8-7.5s; about is 32s) |
| FCP    | <1 800 ms | 🟢 Every route 1.2s — well under target |
| TBT    | <200 ms   | 🟡 /our-work + /entity-grid pass; /contact + /careers close; /home + /about over; /partnerships way over |
| CLS    | <0.10     | 🟢 All routes 0.000 — perfect |

## About's LCP (32s) is suspicious

The AboutWaveCanvas WebGL element is likely being scored as LCP and
Lighthouse waits until its "stable contents" before timing it. Real-user
LCP on /about is probably fine (the actual text content paints at FCP=1.2s).
This is a Lighthouse-measurement artifact, not necessarily a real
user-perceived problem. **Verify with real-device + WebPageTest before
acting on this number.**

## What this means for Phase 2

| Question | Answer |
|----------|--------|
| Are Phase 1's changes measurable? | **Not in Lighthouse.** The known wins are scroll-time + cursor-time + a11y + build-size (78% smaller `.next/static/chunks/`). |
| What's the worst remaining number? | **/partnerships TBT 1.35s** — 10 GSAP timelines + horizontal scroll pin is doing real work. |
| What does Phase 2 (bundle audit) need to find? | The 701KB Three.js chunk + 224KB / 218KB / 172KB other chunks. Top of the list for split/lazy/defer. |
| Realistic target for next session? | Get partnerships TBT under 600 ms (still "needs improvement" but no longer red). |

## Raw outputs

Every JSON is in `reports/perf/rebaseline-2026-06-24/`. Same filename
convention: `<route>-run<n>.json`.
