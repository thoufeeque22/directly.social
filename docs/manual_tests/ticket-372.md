# Manual Test Script: Ticket #372 - API Rate Limiting

## Overview
This script verifies the implementation of API rate limiting using Upstash Ratelimit and Next.js Middleware.

## Prerequisites
- Local development environment.
- Upstash Redis environment variables configured (or temporary local Redis).
- `NEXT_PUBLIC_E2E` set to `false`.

## Test Scenarios

### 1. Verify Rate Limiting Bypass (Local Dev without Redis)
- **Setup**: Ensure `UPSTASH_REDIS_REST_URL` is NOT set in `.env`.
- **Action**: Make multiple requests to `/api/ai/models`.
- **Expected Result**: Requests should succeed (Fail-open) and NOT be rate limited.

### 2. Verify AI Route Rate Limit
- **Setup**: 
    - Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
    - Set `NEXT_PUBLIC_E2E=false`.
- **Action**: 
    - Make 5 requests to `/api/ai/generate` within 60 seconds.
    - Make a 6th request.
- **Expected Result**: 
    - First 5 requests succeed (200 OK).
    - 6th request fails with `429 Too Many Requests`.
    - Response body contains: `{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}`.
    - `Retry-After` header is present and contains a numeric value.

### 3. Verify Global Rate Limit
- **Setup**: Same as above.
- **Action**: 
    - Make 10 requests to a generic API route (e.g., `/api/health` or `/api/users/profile`) within 10 seconds.
    - Make an 11th request.
- **Expected Result**: 
    - 11th request fails with `429 Too Many Requests`.

### 4. Verify Auth Route (IP-based)
- **Setup**: Same as above.
- **Action**: 
    - From the same IP, make 6 requests to `/api/auth/signin` within 5 minutes.
- **Expected Result**: 
    - 6th request fails with `429`.
    - Limiter should be IP-based (verify by using a different IP/proxy if possible, though local test is usually enough to verify the logic).

### 5. Verify Build Conflict (Regression Check)
- **Action**: Run `npm run build`.
- **Expected Result**: Build should succeed without errors about multiple middleware files.
    - *Note: Current implementation has a conflict between `src/middleware.ts` and `src/proxy.ts`.*

## Cleanup
- Reset environment variables.
