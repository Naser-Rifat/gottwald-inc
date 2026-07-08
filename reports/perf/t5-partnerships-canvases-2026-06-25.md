# T5 — IO-gate partnerships canvases (2026-06-25)

## What shipped

Replaced static imports of `<ArchetypeCanvas/>` and `<StandardCanvas/>`
with sticky-IO-gated, `next/dynamic({ ssr: false })` wrappers so their
three.js + drei parse cost moves off `/partnerships`' critical path.

New files:
- `lib/useInViewOnce.ts` — sticky IntersectionObserver hook
- `app/partnerships/_components/LazyArchetypeCanvas.tsx`
- `app/partnerships/_components/LazyStandardCanvas.tsx`

Modified (import swap only):
- `app/partnerships/_components/ArchetypeCard.tsx`
- `app/partnerships/_components/NonNegotiablesSection.tsx`

`rootMargin: "200px"` pre-warm so the canvas hydrates slightly before
scrolling into view — no visible "pop in".

## Lighthouse delta — `/partnerships` (mobile, simulate, 3 runs)

| Metric | Post-T1 baseline | Post-T5 | Δ |
|---|---:|---:|---:|
| Perf score | 55 | 70 (68/71/70) | **+15** |
| TBT | 909ms | ~303ms (337/275/296) | **−606ms (−67%)** |
| FCP | 1.21s | 1.21s | flat |
| LCP | ~7.7s | ~6.97s | −0.7s (hero-bound, unrelated) |
| TTI | ~7.85s | ~7.11s | −0.74s |
| CLS | 0.000 | 0.000 | flat |

## Other routes (regression check)

- `/` home — 3 runs: perf 64/66/68, TBT 476/380/343ms. Within Lighthouse
  simulate-mode run-to-run variance vs the post-T1 baseline (perf 68,
  TBT 344ms). T5 touches only `/partnerships`, so any apparent delta is
  noise.
- `/entity-grid` — 1 run: perf 75, TBT 141ms. Matches post-T1 (TBT
  143ms). No regression.

## Why this worked

Before T5, both canvases were imported eagerly from the partnerships
orchestrator's component tree, so their chunks (three.js core 718K +
drei integration in the route's chunk-fetch wave) were pulled and
parsed on initial route load — before the user had any chance to see
them, since the archetype bento and standards horizontal-scroll are
deep below the fold.

T5 makes the dynamic chunk fetch + canvas instantiation contingent on
the host element entering (or being within 200px of) the viewport.
TBT measures main-thread blocking *during initial page load* — so
moving the three.js eval to a later, scroll-driven moment is exactly
what the metric rewards.

## Cumulative wins this session (post-T1 + T5)

`/partnerships`:
- Pre-Phase-2 baseline: perf 50, TBT 1350ms
- Post-T1: perf 55, TBT 909ms
- Post-T5: perf 70, TBT 303ms

**Total Phase 2: perf 50 → 70 (+20), TBT 1350ms → 303ms (−1047ms, −77%).**

## Remaining targets

- **T2** — GlobalCanvas (~1.2 MB three.js) first-interaction defer.
  Highest single-chunk lever, but touches the page-color-shift event
  system every route subscribes to. Do last.
- **T3** — N/A (Sentry already idle-callback-deferred).
- **T4** — MagneticButton framer-motion → CSS+state. Held; user keeps
  spring-physics implementation.
