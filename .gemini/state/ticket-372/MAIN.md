# Ticket #372: API Rate Limiting

## Status
- Phase: Discovery
- Verdict: IN_PROGRESS

## Description
Add middleware to protect API routes from abuse and ensure compliance with platform quotas.

## Round 1
- Discovery: [[discovery.md]]
- Development: PENDING
- Review: PENDING
- QA: PENDING
- Documentation: PENDING

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
