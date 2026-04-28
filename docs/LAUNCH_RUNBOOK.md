# Launch Runbook — gottwald.world Cutover

This runbook covers the production launch of the GOTT WALD Holding LLC
website. It documents the pre-launch checklist, the cutover sequence,
the first-hour smoke tests, the rollback procedure, and post-launch
monitoring. Print this or keep it open during the launch window.

## Roles

- **Operator** — runs the cutover commands and updates Vercel env vars
- **Verifier** — runs the smoke tests in a separate browser session
- **Client (Mathias)** — confirms DNS and provides credentials when needed

---

## Pre-cutover checklist

Run through this list the day before cutover, not on launch day.

### 1. Codebase state

- [ ] `main` branch is the deployment source on Vercel
- [ ] All Phase 1A items merged and tagged
- [ ] `bun run build` succeeds locally with no warnings
- [ ] `bunx tsc --noEmit` returns clean
- [ ] No `console.log` left in production code paths
- [ ] No `process.env.NEXT_PUBLIC_*` typos that would silently no-op

### 2. Production env vars in Vercel (Production scope only)

| Variable | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://gottwald.world` | Drives sitemap, OG tags, canonical |
| `NEXT_PUBLIC_API_URL` | `https://gottwald-admin.vercel.app/` | Backend (Vercel HTTPS proxy in front of EC2) |
| `NEXT_PUBLIC_DATA_SOURCE` | `api` | Switch from mock to live backend |
| `NEXT_PUBLIC_SENTRY_DSN` | (from client's Sentry account) | EU region, scope = Production only |
| `SENTRY_ORG` | (from client's Sentry account) | For source map upload |
| `SENTRY_PROJECT` | (from client's Sentry account) | For source map upload |
| `SENTRY_AUTH_TOKEN` | (Sentry internal-integration token) | For source map upload |
| `RESEND_API_KEY` | (from Resend dashboard) | Email delivery |
| `RESEND_FROM` | `no-reply@gottwald.world` | Verified in Resend |
| `RESEND_TO` | `office@gottwald.world` | Where form submissions arrive |
| `API_READ_KEY` | (if backend requires auth) | Server-side fetch credential |

- [ ] All variables above are set in Vercel **Production** scope
- [ ] None are accidentally set on Preview or Development
- [ ] DSN values are tested against live Sentry (test error appears in dashboard)

### 3. DNS prerequisites (client-side)

- [ ] Client has admin access to the domain registrar for `gottwald.world`
- [ ] Current DNS records documented (for rollback)
- [ ] Vercel project domain settings page open and ready

### 4. Backend health check

- [ ] `gottwald-admin.vercel.app/api/v1/pillars/` returns 200 with full pillar list
- [ ] EC2 instance behind the proxy is healthy
- [ ] Resend test email delivers successfully

---

## Cutover sequence (launch day)

Estimated total elapsed time: **30 minutes** including DNS propagation.

### Step 1 — Add domain in Vercel (5 min)

1. Vercel dashboard → project → Settings → Domains
2. Click **Add** → enter `gottwald.world`
3. Vercel will display the required DNS records (A record or CNAME)
4. Repeat for `www.gottwald.world` if a www variant is needed

### Step 2 — Update DNS records at the registrar (5 min)

1. Log into the domain registrar
2. Update DNS records to match what Vercel showed in Step 1
3. Lower the TTL to 300 (5 minutes) for faster propagation if not already
4. Save changes

### Step 3 — Wait for DNS propagation (5–30 min)

- Vercel will automatically detect propagation and mark the domain as Active
- Check at <https://dnschecker.org/> for global propagation status
- Once Vercel shows the green ✓ on the domain, proceed

### Step 4 — Trigger production redeploy (2 min)

1. Vercel dashboard → project → Deployments
2. Click the latest deployment → ⋯ → Redeploy
3. Wait for the deployment to complete (≈2 min for this site)
4. The new deployment picks up the production env vars

### Step 5 — Verify SSL certificate (1 min)

- Visit `https://gottwald.world` in a browser
- Check the padlock icon shows a valid Let's Encrypt certificate from Vercel
- If no certificate, wait 60 seconds and reload (Vercel provisions automatically)

---

## First-hour smoke tests

The Verifier runs these in a fresh browser session (not signed in to anything).

### Critical path

- [ ] Home page loads at `https://gottwald.world`
- [ ] All 8 pillar pages load without errors
- [ ] `/about`, `/our-work`, `/contact`, `/partnerships`, `/careers` all load
- [ ] `/imprint`, `/privacy-policy`, `/terms-of-use` all load
- [ ] Contact form submits and triggers Resend email to <office@gottwald.world>
- [ ] Acknowledgement email arrives at the submitter address

### SEO and discoverability

- [ ] `https://gottwald.world/robots.txt` returns the AI-crawler-friendly file
- [ ] `https://gottwald.world/sitemap.xml` returns the dynamic sitemap with all routes
- [ ] `https://gottwald.world/llms.txt` returns the curated AI crawler index
- [ ] `https://gottwald.world/llms-full.txt` returns the long-form companion
- [ ] `https://gottwald.world/.well-known/security.txt` returns the RFC 9116 file
- [ ] View source on home page: confirm `Organization` JSON-LD includes `patron` property
- [ ] Run <https://search.google.com/test/rich-results> on `https://gottwald.world` — expect Organization recognized

### Security

- [ ] Run <https://securityheaders.com/?q=gottwald.world> — expect Grade A or A+
- [ ] Confirm HSTS header present in response: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] Confirm CSP header present
- [ ] `curl -I https://gottwald.world` shows full security header set

### Performance

- [ ] Run `bun run lighthouse` — capture baseline html + json into `lighthouse/`
- [ ] LCP < 3s on desktop preset, < 4s on mobile (rough launch-day target)
- [ ] No CLS issues on initial paint

### Accessibility

- [ ] Skip-link visible on Tab key press (focus first focusable element on home)
- [ ] Footer directory link reads "Entity Grid" (not "Entity Grid Entity Grid Entity Grid") in screen reader
- [ ] Loading intro announces "Loading new page content" to screen reader
- [ ] Run axe DevTools scan on home, /about, /contact, /our-work — log critical findings

### Observability

- [ ] Trigger a test error (`throw new Error("sentry-test-launch-day")` in browser console on production) — appears in Sentry dashboard within 60 seconds
- [ ] Remove the test code immediately after verification
- [ ] UptimeRobot reports all monitors as Up

---

## Rollback procedure

If anything critical breaks within the first hour, fastest rollback path:

### Option 1 — Revert Vercel deployment (fastest, ~2 min)

1. Vercel dashboard → project → Deployments
2. Find the previous successful deployment (one before launch)
3. Click ⋯ → **Promote to Production**
4. Done — site reverts within seconds

### Option 2 — Revert DNS (slower, 5–30 min for propagation)

1. Restore the original DNS records at the registrar
2. Wait for propagation
3. Use this only if Vercel itself is unhealthy

### Option 3 — Disable production deployment (emergency)

1. Vercel dashboard → project → Settings → General
2. Pause auto-deployments
3. The current production deployment continues serving but no new builds ship

**After any rollback:** capture a Sentry export, document the failure, do not re-attempt the cutover until the root cause is understood.

---

## Communication path during launch

**Primary channel:** [insert preferred Slack/Discord/email thread]

**Roles during the window:**

- Operator on Vercel dashboard: drives the cutover steps
- Verifier on a separate machine: runs smoke tests in real time
- Client (Mathias): notified at start and end, reachable for DNS coordination if needed

**Status updates** every 10 minutes during the window so the team has a clear sense of progress without spam.

---

## Post-launch (first 48 hours)

These are mandatory follow-ups, not optional:

- [ ] Run axe DevTools scan on **every** main route within 48 hours
- [ ] Fix any **critical-severity** axe findings immediately as Phase 1A
- [ ] Roll any **non-critical** findings into the Phase 2 accessibility pass
- [ ] Check Sentry dashboard daily for the first week — review every error
- [ ] Check UptimeRobot daily for the first week — confirm no flaps
- [ ] Re-run Lighthouse against production after 24 hours — validate baseline holds under real traffic
- [ ] Submit `https://gottwald.world` to Google Search Console (when client provides Google access)

---

## When NOT to launch

Hold the cutover if any of the following are true:

- The build is failing or has typecheck errors
- Production env vars are not yet set in Vercel
- Sentry DSN is not yet configured (you lose error visibility on the most critical day)
- Backend health check is failing
- Client has not confirmed DNS access
- It's a Friday afternoon (defer this rule only when there's a genuine reason)
- Anyone in the launch team is unreachable for the next 4 hours

---

## Out-of-scope but worth noting

These items are deliberately *not* in this runbook because they belong elsewhere:

- Plausible / Fathom analytics activation → Phase 2
- Cloudflare Turnstile bot protection → Phase 2
- HSTS preload submission → Phase 2 (after 2 weeks of stable production)
- Full WCAG 2.2 AA pass → Phase 2 (separately scoped)
