# Ticket #372: API Rate Limiting

## Status
- Phase: Completed
- Verdict: PASS

## Description
Add middleware to protect API routes from abuse and ensure compliance with platform quotas.

## Round 1
- Discovery: [[discovery.md]] (COMPLETE)
- Development: [[development.md]] (COMPLETE)
- Review: [[review.md]] (COMPLETE)
- QA: [[qa.md]] (PASS)
- Documentation: [[documentation.md]] (COMPLETE)

# 📅 Timeline
- **[2026-06-01 23:01:48]**: DISCOVERY [NECESSARY] - # Discovery: API Rate Limiting (#372)

## SOCRATIC_LOG
1. **Feasibility:** High. Stack already includes `@upstash/ratelimit` and `@upstash/redis`. Infrastructure is ready in `src/lib/core/redis.ts`.
2. **Strategic Alignment:** Essential for controlling costs of AI and Media services. Protects against ban risks from 3rd-party APIs (TikTok, YouTube).
3. **Architectural Integrity:** Moving from manual per-route checks to a centralized `src/middleware.ts` follows Next.js best practices and ensures 100% coverage.
4. **Necessity/Priority:** High priority to prevent abuse as the app scales.
5. **External Dependencies:** Upstash Redis. Cost is negligible for current volume but provides critical safety.

## IMPACT ANALYSIS
- **Files Modified:**
    - `src/middleware.ts` (New)
    - `src/lib/core/ratelimit-config.ts` (Updated)
    - `src/app/api/chat/route.ts` (Refactor: Remove manual check)
    - `src/app/api/upload/init/route.ts` (Refactor: Remove manual check)
    - `src/app/api/upload/byos/presign/route.ts` (Refactor: Remove manual check)
- **Radius:** All API routes under `/api/*` will be intercepted.

## TECHNICAL SPECS
1. **Create `src/middleware.ts`**:
    - Import `auth` configuration.
    - Implement a path matcher:
        - `/api/ai/*`: 5 requests / 60s (User-based)
        - `/api/upload/*`, `/api/media/*`: 3 requests / 60s (User-based)
        - `/api/auth/*`: 5 attempts / 5m (IP-based)
        - `/api/tiktok-proxy`, `/api/ai/validate-key`: 5 requests / 60s (User-based)
        - Default `/api/*`: 10 requests / 10s (User-based/IP fallback)
    - Handle `Retry-After` header in 429 responses.
2. **Expand `src/lib/core/ratelimit-config.ts`**:
    - Add `authRateLimit` (Sliding window: 5, 5m).
    - Add `sensitiveRateLimit` (Sliding window: 5, 1m).
3. **Refactor Routes**:
    - Clean up manual `checkRateLimit` calls to avoid double-limiting and improve readability.
4. **Fail-Safe**:
    - Ensure `checkRateLimit` and middleware fail-open if Redis is unreachable to prevent hard outages in production during DB maintenance.

## TEST SPECIFICATION
### Happy Path
- Normal user browsing and interacting with AI chat within limits (1-4 req/min).
- Multiple users interacting simultaneously (ensuring independent buckets).

### Edge Scenarios
- Hit limit exactly (5th request in 60s for AI) -> Success. 6th request -> 429.
- Burst traffic (10 requests in 1 second) -> Should be caught by sliding window or global limit.

### Negative Scenarios
- Authenticated user hits AI limit but not Global limit.
- Unauthenticated user attempts brute force on `/api/auth/*` -> Blocked by IP.
- Upstash environment variables missing -> Requests proceed (Fail-open).
- **[2026-06-01 23:26:15]**: QA [FAIL] - # QA Report: Ticket #372 - API Rate Limiting

## Verdict: FAIL

## Test Scenarios Covered
1.  **Unit Tests**:
    *   getLimiterForPath: Verified correct limiter assignment for AI, Upload, Media, Auth, and Sensitive routes. (PASS)
    *   shouldBypassRateLimit: Verified bypass logic for E2E, Test, CI, and missing Redis URL scenarios. (PASS)
2.  **E2E Smoke Test**:
    *   Attempted to run Playwright E2E tests to verify API accessibility. (FAIL - Build Blocker)
3.  **Build Verification**:
    *   Executed npm run build to verify middleware integration. (FAIL)

## FAILED TESTS
1.  **Build Conflict**: 
    *   Error: Both middleware file ./src/src/middleware.ts and proxy file ./src/src/proxy.ts are detected. Please use ./src/src/proxy.ts only.
    *   Reason: Next.js 15/16 does not support multiple middleware files. src/proxy.ts (used for Auth) and src/middleware.ts (introduced for Rate Limiting) are in conflict.
    *   Impact: The application cannot be built or started in production mode.

## Test Gap Analysis
- Missing Build Check: The implementation phase did not include a full npm run build which would have revealed the middleware conflict.
- Middleware Redundancy: src/proxy.ts was already acting as a middleware for authentication. The new src/middleware.ts was added without merging the existing logic or deleting the conflicting file.
- Architectural Oversight: The registry-based approach in middleware.ts is good, but it must be the ONLY middleware file.
