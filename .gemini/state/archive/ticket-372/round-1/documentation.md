# Documentation: API Rate Limiting (#372)

## Overview
Implemented a centralized API rate-limiting system using Next.js 16 unified middleware (`src/proxy.ts`).

## Architecture
- **Middleware Layer**: Enforces limits on all `/api/*` routes before they reach business logic.
- **Registry Pattern**: Uses `rateLimitRegistry` with regex matching for flexible route-to-limiter mapping.
- **Fail-Open**: Ensures high availability by allowing requests if Redis is unreachable.
- **Identity-Based**: Limits by `userId` for authenticated routes and `IP` for auth/unauthenticated routes.

## Configuration
Limits are defined in `src/lib/core/ratelimit-config.ts`:
- **AI**: 5 req / 60s
- **Upload/Media**: 3 req / 60s
- **Auth**: 5 attempts / 5m (IP-based)
- **Sensitive**: 5 req / 60s
- **Global**: 10 req / 10s

## Developer Guide
- **Bypassing**: Set `NEXT_PUBLIC_E2E=true` or run in `test` environment to disable rate limiting.
- **Adding Routes**: Add a new entry to the `rateLimitRegistry` in `src/lib/core/rate-limit-registry.ts`.
- **Manual Checks**: Use `checkRateLimit()` in Server Actions (since they bypass middleware).

## Updated Docs
- `docs/architecture/SECURITY.md`: Updated Section 4 with technical details of the new system.
