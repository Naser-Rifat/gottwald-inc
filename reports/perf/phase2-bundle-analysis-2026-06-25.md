# Phase 2 — Bundle Analysis (2026-06-25)

Run via `next experimental-analyze` (Turbopack's native analyzer; the
older `@next/bundle-analyzer` plugin doesn't support Turbopack builds).
Static-chunk inventory + signature-based content fingerprinting from
the production build.

## Total payload

- `.next/static/chunks/`: **3.0 MB** across 56 JS chunks
- Top 5 chunks alone = **1.58 MB** (53% of all JS)
- Sourcemaps disabled (step 1.5 win — was 14 MB before)

## What every route loads (rootMain)

| Chunk | Size | Contents |
|-------|-----:|----------|
| `61e4836232d5f856` | 218K | React + ReactDOM |
| `001df128c26b2364` | 103K | Next.js framework |
| `74fa45f7d85c69dd` | 11K | Next.js client runtime |
| `58a311f690bef6ef` | 30K | Next.js client runtime |
| `7d513448b746fb60` | 33K | Next.js client runtime |
| `turbopack-e9f744…` | 11K | Turbopack chunk loader |
| **Total** | **~406K** | Framework only — no app code |

**Verdict:** rootMain is clean. No app dependencies (gsap, three, framer-motion) leak into the always-loaded bundle. Tree-shaking is working.

## Top heavy chunks (dynamic — loaded on-demand)

| Chunk | Size | Contains | Routes that need it |
|-------|-----:|----------|---------------------|
| `f6b5e319…` | **701K** | three.js (REVISION'd) | Any route that uses a WebGL canvas (all) |
| `df3d42cf…` | 258K | three.js (R3F integration) | Same |
| `37303bfd…` | 224K | unidentified (likely Sentry runtime + Next router instrumentation) | All |
| `b428f464…` | 172K | three.js + @react-three/fiber | All |
| `2e5d0b22…` | 141K | gsap + ScrollTrigger + framer-motion + next-intl + three | Probably the heaviest "app" chunk — shared between page chunks |
| `7d74e4f6…` | 133K | gsap + ScrollTrigger + next-intl + three | Similar shared chunk |
| `794b2045…` | 116K | framer-motion | Routes that import framer-motion (9 files, mostly /partnerships) |
| `a6dad97d…` | 110K | (polyfills, per build-manifest) | All |

**Three.js footprint:** 701 + 258 + 172 = **1131K** raw, possibly +shared bits in 141K/133K chunks ≈ **1.2 MB** of three.js + R3F code across multiple chunks.

## Framer-motion usage audit (116K chunk)

Found in 9 files:
- `app/template.tsx` — page transition wrapper (mounted on every route)
- `app/careers/_components/RolesByPillarSection.tsx` — accordion `motion.div` + `AnimatePresence`
- `app/careers/_components/MagneticButton.tsx` — spring animation
- `app/partnerships/_components/MagneticButton.tsx` — spring animation
- `app/partnerships/_components/VerticalSpineTimeline.tsx` — `useScroll` + `useTransform`
- `app/partnerships/_components/EquilibriumSection.tsx` — `motion.div whileInView`
- `app/partnerships/_components/ParallaxShard.tsx` — `useScroll` parallax
- `app/partnerships/_components/ArchetypeCard.tsx` — `motion.div layout` animations
- `app/partnerships/_components/DomainsAccordionSection.tsx` — `AnimatePresence` accordion

**6 of 9 usages are on `/partnerships`**, which explains why that route has the worst TBT (1.35s).

`app/template.tsx` mounts a page-transition wrapper on every route — so framer-motion's 116K is paid on every page even when nothing visible uses it.

## Concrete optimization targets (ranked by impact + measurability)

### 🔴 T1 — Eliminate framer-motion from the always-loaded path

`app/template.tsx` is the smoking gun. If we replace its page transition with a CSS-only equivalent OR mark it as a client-only dynamic-imported wrapper, framer-motion (116K) leaves the critical path.

- **Effort:** 1-2 hours
- **Expected impact:** -116K main-thread JS to parse on every route → **measurable Lighthouse TBT delta**

### 🟡 T2 — Lighter Three.js loading strategy

GlobalCanvas is dynamic but auto-loads after layout mount. On routes that don't surface the WebGL ambient backdrop above-the-fold, defer the load until first user interaction (scroll/click).

- **Effort:** 2-3 hours; needs careful testing of the page-color-shift event flow
- **Expected impact:** Three.js (~1.2 MB) no longer in initial chunk-fetch wave → faster TTI, smaller "time to interactive" delta

### 🟡 T3 — Audit the 224K `37303bfd…` mystery chunk

Couldn't identify with library signatures. Likely Sentry's nextjs runtime + Next router instrumentation. If Sentry session-tracking can be configured lazier, ~50-150K could come out of every route's load.

- **Effort:** 1 hour investigation, possibly 30 min change
- **Expected impact:** unknown until traced

### 🟢 T4 — Replace MagneticButton's framer-motion with CSS+state

2 routes (/careers, /partnerships) each have a `MagneticButton` that uses `motion.button` + spring physics for a 0.4-magnitude cursor follow. A 30-line `useState` + `transform` CSS implementation would do the same thing without framer-motion.

- **Effort:** 1 hour
- **Expected impact:** small per-route saving; combined with T1, framer-motion's 116K could disappear entirely if /partnerships drops the other 5 usages too

### 🟢 T5 — Move heavy /partnerships canvas dependencies behind IntersectionObserver-gated dynamic imports

`ArchetypeCanvas` (Three.js + drei) and `StandardCanvas` (Three.js + drei) are imported statically from /partnerships orchestrator. They could be `dynamic(() => import…, { ssr: false })` and gated by viewport presence so the Three.js bundle isn't pulled until the section approaches the viewport.

- **Effort:** 1-2 hours
- **Expected impact:** partnerships LCP unaffected (Three.js still loads), but TBT drops because the parse work shifts off the critical path

## Recommendation: order of work

| Step | Change | Why first |
|------|--------|-----------|
| 1 | T1 — replace `app/template.tsx` framer-motion transition | Single-file change; measurable; benefits every route |
| 2 | Re-baseline Lighthouse | Capture the T1 delta cleanly before stacking T2 |
| 3 | T3 — identify the mystery 224K chunk | Need a 1-hour investigation pass |
| 4 | T4 — kill MagneticButton's framer dependency | Eliminates one more framer-motion user; brings the goal of dropping framer-motion entirely within reach |
| 5 | T5 — gate /partnerships canvases | Targets the specific route with worst TBT |
| 6 | T2 — GlobalCanvas interaction-deferred load | Biggest single chunk; do last because it touches the page-color-shift system that all pages depend on |

## What this does NOT cover

- **CSS bundle weight** — 212K main + 12K secondary. Worth a separate pass.
- **WASM / Rapier** — no Rapier in this build (false signal earlier; no `@dimforge` deps).
- **Server bundle** — analyzed too but server-side bundle size has no user-visible impact unless cold-start matters (Vercel functions).

## Raw inventory

All 56 chunks + their signature scans live in this report's source build at `.next/static/chunks/`. The interactive Turbopack analyzer UI is available locally:

```bash
npx next experimental-analyze --port 4001
# then open http://localhost:4001
```
