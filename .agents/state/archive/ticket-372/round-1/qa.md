# QA: API Rate Limiting (#372)

## Test Scenarios
1. **Unit Tests**: Verified registry matching and bypass logic. (PASS)
2. **Build Verification**: Verified that unified middleware (`src/proxy.ts`) builds successfully in Next.js 16. (PASS)
3. **E2E Smoke Test**: Verified API accessibility in test environments. (PASS)

## Results
### Unit Tests (Vitest)
- `getLimiterForPath`: All route patterns correctly map to their respective limiters.
- `shouldBypassRateLimit`: Bypass triggers correctly for E2E, Test, CI, and missing infrastructure.

### Build Verification
- Resolved conflict between `middleware.ts` and `proxy.ts` by merging into a unified `src/proxy.ts`.
- Confirmed build success with `npm run build`.

### Manual Verification Steps
To verify rate limiting locally:
1. Set `NEXT_PUBLIC_E2E=false`.
2. Ensure `UPSTASH_REDIS_REST_URL` and `TOKEN` are set.
3. Rapidly refresh an AI Chat or Upload endpoint.
4. Observe `429 Too Many Requests` response with `Retry-After` header.

## QA Verdict: PASS
