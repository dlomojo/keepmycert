# Security Review

## Overview
This document summarizes a manual security assessment of the KeepMyCert codebase (Next.js + Supabase).
The review focused on server-side API routes, Supabase integrations, storage handling, and supporting
utilities. Findings are grouped by severity with remediation guidance.

## High Severity Findings

### 1. Unsigned OAuth `state` Allows Calendar Account Linking Attacks
- **Location:** `src/app/api/calendar/connect/route.ts`, `src/app/api/calendar/callback/route.ts`
- **Impact:** An attacker can forge the base64-encoded `state` payload with a victim's email, complete
  the Google OAuth flow, and have their own Google tokens stored on the victim's account. This enables
  calendar event injection and potential data exfiltration without the victim's consent.
- **Evidence:** The `state` parameter is only base64-encoded JSON that includes the user's email and a
  timestamp; no signature or server-side verification exists before persisting tokens.【F:src/app/api/calendar/connect/route.ts†L30-L41】【F:src/app/api/calendar/callback/route.ts†L26-L56】
- **Recommendation:** Sign or encrypt the state (e.g., HMAC with a server-side secret) and validate it
  before use, or store state server-side (DB/Redis) keyed by a random nonce issued to the browser.

### 2. Public Document Parsing Endpoint Leaks Sensitive Files and API Capacity
- **Location:** `src/app/api/parse-document/route.ts`
- **Impact:** The route is unauthenticated and uploads user-supplied files to a *public* Vercel Blob.
  Attackers can host arbitrary files, enumerate URLs, or trick users into uploading private certificates
  that become publicly accessible. Additionally, any unauthenticated caller can exhaust the OpenAI API
  quota using the project's key.
- **Evidence:** Files are uploaded with `{ access: 'public' }` and the response exposes `blob.url`, while
  no session or rate limiting is performed.【F:src/app/api/parse-document/route.ts†L8-L84】
- **Recommendation:** Require authentication, store files privately, rotate the OpenAI key, and gate the
  endpoint behind strict rate limiting/abuse detection.

### 3. Supabase Storage Path Traversal via Raw Filenames
- **Location:** `src/app/api/upload-cert/route.ts`
- **Impact:** User-provided filenames are only whitespace-normalized before inclusion in the storage
  path. Crafted filenames containing `../` or similar sequences can escape the intended user directory,
  overwriting other users' files or application assets within the bucket.
- **Evidence:** `safeName` is derived using `file.name.replace(/\s+/g, '-')` with no further sanitization
  before composing the upload path.【F:src/app/api/upload-cert/route.ts†L58-L68】
- **Recommendation:** Sanitize filenames rigorously (strip path separators, control characters, etc.) or
  generate server-side UUIDs to avoid user-controlled paths altogether.

### 4. Unauthenticated Career Seed Endpoint Enables Data Tampering
- **Location:** `src/app/api/career/seed/route.ts`
- **Impact:** Anyone can POST to this route and re-populate critical lookup tables (`career_*`).
  Attackers could poison guidance content or degrade the service for all users.
- **Evidence:** The route runs large `supabaseAdmin.insert(..., { upsert: true })` operations without
  any authentication or authorization checks.【F:src/app/api/career/seed/route.ts†L11-L151】
- **Recommendation:** Restrict access (e.g., admin auth, signed cron token) or remove the endpoint from
  production builds entirely.

## Medium Severity Findings

### 5. Missing CSRF Protection on Profile & Notification Mutations
- **Location:** `src/app/api/update-profile/route.ts`, `src/app/api/notifications/route.ts`
- **Impact:** Both routes rely on Auth0 cookie sessions but lack CSRF validation, allowing malicious
  sites to trigger state-changing requests in the background when a victim is logged in.
- **Evidence:** Neither handler validates CSRF tokens nor origin headers before mutating user data or
  notification state.【F:src/app/api/update-profile/route.ts†L5-L33】【F:src/app/api/notifications/route.ts†L34-L68】
- **Recommendation:** Enforce CSRF checks (reuse `validateCSRF`) or require same-site POSTs via custom
  headers coupled with verification.

### 6. Military Verification Proxy Exposes Client Credentials
- **Location:** `src/app/api/verify-military/route.ts`
- **Impact:** The API exchanges OAuth codes using the application's ID.me client secret without
  validating the associated `state`. Attackers can replay arbitrary codes, potentially leaking whether
  they are valid and abusing the credential exchange endpoint.
- **Evidence:** The handler blindly posts the provided `code` along with `client_secret` and returns a
  boolean result with no state checking.【F:src/app/api/verify-military/route.ts†L1-L25】
- **Recommendation:** Require the browser to pass back a server-issued anti-CSRF/state token and reject
  stale or untrusted codes; consider moving the exchange entirely client-side if secrets are not needed.

## Low Severity & Informational Notes

- `src/app/api/test-db/route.ts` exposes Supabase project URLs and aggregate counts without auth, which
  may aid reconnaissance. Lock the route down or remove it from production.【F:src/app/api/test-db/route.ts†L1-L21】
- Environment helper `src/lib/env.ts` hard-throws when variables are absent. While type-safe, missing
  values in production will crash handlers; consider graceful fallbacks during startup checks.【F:src/lib/env.ts†L1-L39】
- Rate limiting in `src/lib/rate-limit.ts` is in-memory and per-instance; distributed deployments (e.g.,
  Vercel) won't share counters, so abuse may slip through. Consider a shared store.【F:src/lib/rate-limit.ts†L1-L86】

## Suggested Next Steps
1. Prioritize fixes for the high-severity findings, starting with OAuth state protection and the
   document parsing endpoint.
2. Add regression tests or monitoring around sensitive routes once remediated.
3. Establish a regular security review cadence and integrate automated scans (SAST/DAST) into CI.

---
Prepared by: Security Review Bot
Date: 2025-11-13T01:34:41Z
