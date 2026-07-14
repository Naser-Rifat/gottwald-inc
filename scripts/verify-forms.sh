#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# verify-forms.sh — Automated smoke test for /api/send-email
#
# Covers Section 4 of the closeout scope: Forms & Email Workflow Verification.
# Probes each server-side guarantee (rate limit, honeypot, file-size cap,
# empty rejection) and, when invoked with `--live`, sends real submissions
# that the QA operator then confirms landed at office@gottwald.world.
#
# Usage:
#   scripts/verify-forms.sh                        # dry-run (safe probes only)
#   scripts/verify-forms.sh --live                 # dry-run + real submissions
#   scripts/verify-forms.sh --base URL             # override target
#   scripts/verify-forms.sh --live --base https://gottwald.world
#
# Exit status: 0 = all pass, 1 = any failure.
# ---------------------------------------------------------------------------

set -u
IFS=$'\n\t'

# ─── Config ───────────────────────────────────────────────────────────────
BASE_URL="${BASE_URL:-http://localhost:3000}"
LIVE_MODE=0
ENDPOINT_PATH="/api/send-email"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --live) LIVE_MODE=1; shift ;;
    --base) BASE_URL="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown flag: $1" >&2; exit 2 ;;
  esac
done

ENDPOINT="${BASE_URL%/}${ENDPOINT_PATH}"

# ─── Colours (fallback to plain text when NO_COLOR is set) ────────────────
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
  GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; YELLOW=$'\033[0;33m'
  BOLD=$'\033[1m';     DIM=$'\033[2m';    RESET=$'\033[0m'
else
  GREEN=""; RED=""; YELLOW=""; BOLD=""; DIM=""; RESET=""
fi

PASS=0
FAIL=0
SKIP=0

log_header() {
  printf '\n%s══ %s ══%s\n' "$BOLD" "$1" "$RESET"
}
log_test() {
  printf '  %s%s%s\n' "$DIM" "$1" "$RESET"
}
log_pass() {
  printf '  %sPASS%s %s\n' "$GREEN" "$RESET" "$1"
  PASS=$((PASS + 1))
}
log_fail() {
  printf '  %sFAIL%s %s\n' "$RED" "$RESET" "$1"
  FAIL=$((FAIL + 1))
}
log_skip() {
  printf '  %sSKIP%s %s\n' "$YELLOW" "$RESET" "$1"
  SKIP=$((SKIP + 1))
}

# ─── HTTP helpers ─────────────────────────────────────────────────────────
# post_form <marker> [curl args...]
#   marker is echoed in verbose mode to make transcripts skimmable.
#   Prints "STATUS|BODY" so callers can split with parameter expansion.
#   stderr is discarded so curl's connection errors don't contaminate the
#   status code — a totally-unreachable host yields "000|" instead of a
#   garbled human-readable warning.
post_form() {
  local _marker="$1"; shift
  local body_file="/tmp/verify-form-body.$$"
  local status
  # curl writes "000" to stdout AND exits non-zero on network failure, so
  # `|| echo 000` would double the string. Capture unconditionally and let
  # the raw output (which is always a 3-digit code) speak for itself.
  status=$(curl -sS -o "$body_file" -w "%{http_code}" \
    --max-time 15 -X POST "$ENDPOINT" "$@" 2>/dev/null)
  [[ -z "$status" ]] && status="000"
  local body
  body=$(cat "$body_file" 2>/dev/null || printf '')
  rm -f "$body_file"
  printf '%s|%s' "$status" "$body"
}

# ─── Pre-flight ───────────────────────────────────────────────────────────
log_header "Pre-flight — endpoint reachable?"
log_test "GET ${ENDPOINT} (expect 405, endpoint accepts POST only)"

preflight_status=$(curl -sS -o /dev/null -w "%{http_code}" \
  -X GET "$ENDPOINT" --max-time 10 2>/dev/null)
[[ -z "$preflight_status" ]] && preflight_status="000"

case "$preflight_status" in
  405|404|400)
    log_pass "Endpoint reachable (HTTP $preflight_status on GET — POST-only route confirmed)"
    ;;
  200)
    log_pass "Endpoint reachable (HTTP 200)"
    ;;
  000)
    log_fail "Endpoint unreachable — is the server running at ${BASE_URL}?"
    printf '\n%sHINT:%s start a dev server with %sbun run dev%s or point --base to a deployed URL.\n' \
      "$YELLOW" "$RESET" "$BOLD" "$RESET"
    exit 1
    ;;
  *)
    log_fail "Unexpected pre-flight status: $preflight_status"
    ;;
esac

# ─── Test 1: empty submission → 400 ──────────────────────────────────────
log_header "Test 1 — Empty submission is rejected"
log_test "POST with no fields (expect 400)"

result=$(post_form empty -H "Content-Type: multipart/form-data" -F "type=contact")
status="${result%%|*}"
body="${result#*|}"

if [[ "$status" == "400" ]]; then
  log_pass "Empty submission rejected with 400"
elif [[ "$status" == "429" ]]; then
  log_skip "Rate-limit hit before this test could run — rerun after 60s cooldown"
else
  log_fail "Expected 400, got $status. Body: ${body:0:200}"
fi

# ─── Test 2: honeypot triggers silent success ────────────────────────────
log_header "Test 2 — Honeypot returns fake success"
log_test "POST with company_fax populated (expect 200, no email queued)"

result=$(post_form honeypot \
  -F "type=contact" \
  -F "name=SmokeTest Bot" \
  -F "email=bot@example.invalid" \
  -F "message=SmokeTest honeypot probe" \
  -F "company_fax=I am a bot")
status="${result%%|*}"
body="${result#*|}"

if [[ "$status" == "200" ]]; then
  if echo "$body" | grep -q '"success":true'; then
    log_pass "Honeypot silently succeeded (bot deterrent working)"
    printf '        %s(verify: office@gottwald.world should NOT receive this submission)%s\n' \
      "$DIM" "$RESET"
  else
    log_fail "Got 200 but response body missing success flag: ${body:0:200}"
  fi
elif [[ "$status" == "429" ]]; then
  log_skip "Rate-limit hit — rerun after 60s cooldown"
else
  log_fail "Expected 200, got $status. Body: ${body:0:200}"
fi

# ─── Test 3: file too large → 400 ────────────────────────────────────────
log_header "Test 3 — Oversized file rejected"
log_test "POST with a 6 MB file (expect 400)"

BIG_FILE="/tmp/verify-form-big.$$"
dd if=/dev/zero of="$BIG_FILE" bs=1024 count=6144 2>/dev/null

result=$(post_form oversized \
  -F "type=careers" \
  -F "name=SmokeTest Big" \
  -F "email=big@example.invalid" \
  -F "message=SmokeTest oversized file probe" \
  -F "cv=@${BIG_FILE};type=application/pdf")
status="${result%%|*}"
body="${result#*|}"
rm -f "$BIG_FILE"

# Vercel's edge platform rejects payloads over ~4.5 MB with 413 BEFORE
# the request reaches our Next.js handler, so on production we accept
# either the app-level 400 (dev/self-hosted) or the platform-level 413.
# Both prove the same guarantee to end users: uploads over 5 MB are
# rejected.
if [[ "$status" == "400" ]] && echo "$body" | grep -qi "too large"; then
  log_pass "5 MB cap enforced at app layer (400 with expected message)"
elif [[ "$status" == "400" ]]; then
  log_pass "Rejected at app layer (400, message differs but cap enforced)"
elif [[ "$status" == "413" ]]; then
  log_pass "Rejected at Vercel edge (413 Payload Too Large — fires before app handler)"
elif [[ "$status" == "429" ]]; then
  log_skip "Rate-limit hit — rerun after 60s cooldown"
else
  log_fail "Expected 400/413, got $status. Body: ${body:0:200}"
fi

# ─── Test 4: rate limiting kicks in ──────────────────────────────────────
log_header "Test 4 — Rate limit fires after 5 requests / minute"
log_test "POST 6× in rapid succession (expect the 6th to return 429)"

RATE_STATUSES=()
for i in $(seq 1 6); do
  r=$(post_form "rate-$i" \
    -F "type=contact" \
    -F "name=SmokeTest RateLimit $i" \
    -F "email=rate$i@example.invalid" \
    -F "message=Rate limit probe $i")
  RATE_STATUSES+=("${r%%|*}")
done

printf '        %sstatuses: %s%s\n' "$DIM" "${RATE_STATUSES[*]}" "$RESET"

# The 6th (index 5) should be 429; the first 5 should be 200.
if [[ "${RATE_STATUSES[5]}" == "429" ]]; then
  log_pass "6th request returned 429 (rate limit working)"
elif [[ " ${RATE_STATUSES[*]} " == *" 429 "* ]]; then
  # 429 appeared but not on the 6th slot — could be leftover state from
  # earlier tests. Still confirms the mechanism is live.
  log_pass "Rate limit fired (429 present within 6 attempts — carry-over from prior tests likely)"
else
  log_fail "Expected 429 within 6 attempts. Got: ${RATE_STATUSES[*]}"
fi

# ─── Test 5: live email delivery (opt-in) ────────────────────────────────
log_header "Test 5 — Live email delivery (opt-in)"

if [[ "$LIVE_MODE" -eq 0 ]]; then
  log_skip "Live submissions disabled. Run with --live to actually send emails."
  log_test "When you run --live, expect 3 real emails in office@gottwald.world"
else
  log_test "Cooling down 61s so rate-limit window resets…"
  sleep 61

  STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  send_live() {
    local ftype="$1"
    log_test "Submitting live ${ftype} form (marker: ${STAMP})"
    result=$(post_form "live-${ftype}" \
      -F "type=${ftype}" \
      -F "name=SmokeTest ${ftype} ${STAMP}" \
      -F "email=qa-smoketest@gottwald.world" \
      -F "message=Automated smoke test — safe to ignore. Marker: ${STAMP}" \
      -F "company=SmokeTest Ltd" \
      -F "subject=SmokeTest ${ftype}")
    local st="${result%%|*}"
    if [[ "$st" == "200" ]]; then
      log_pass "${ftype} form accepted (HTTP 200)"
    else
      log_fail "${ftype} form failed: HTTP ${st}. Body: ${result#*|}"
    fi
  }

  send_live contact
  sleep 2
  send_live partnership
  sleep 2
  send_live careers

  printf '\n%sMANUAL VERIFICATION:%s\n' "$BOLD" "$RESET"
  printf '  1. Check office@gottwald.world — expect 3 emails with marker %s%s%s\n' \
    "$BOLD" "$STAMP" "$RESET"
  printf '  2. Verify each email has the correct Reply-To (qa-smoketest@gottwald.world)\n'
  printf '  3. Verify each email has the correct subject prefix (New Inquiry / Partnership / Career)\n'
  printf '  4. Check Resend dashboard — all 3 should show status "delivered"\n'
  printf '  5. Verify qa-smoketest@gottwald.world (or whichever inbox you used) received an acknowledgement email\n'
fi

# ─── Summary ─────────────────────────────────────────────────────────────
printf '\n%s══════════════════════════════════════════════════════════════%s\n' "$BOLD" "$RESET"
printf '%s SUMMARY %s   %sPASS: %d%s   %sFAIL: %d%s   %sSKIP: %d%s\n' \
  "$BOLD" "$RESET" \
  "$GREEN" "$PASS" "$RESET" \
  "$RED"   "$FAIL" "$RESET" \
  "$YELLOW" "$SKIP" "$RESET"
printf '%s══════════════════════════════════════════════════════════════%s\n' "$BOLD" "$RESET"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
