# Technical Spec - Ticket #561: Fixing Flaky E2E Tests

## 1. Problem Statement
Playwright tests are intermittently failing with `ERR_CONNECTION_REFUSED` and timeouts in CI. This hinders reliable QA and deployment pipelines.

### Affected Tests
- `analytics.spec.ts`: `ERR_CONNECTION_REFUSED`
- `ticket-538-roles-cleanup.spec.ts`: `ERR_CONNECTION_REFUSED`
- `settings.spec.ts`: Timeout

## 2. Root Cause Analysis
1. **Race Condition in Server Startup**: `playwright.config.ts` uses `port: 3005` for health checks. This only verifies the port is open, not that the Next.js app is ready to serve requests.
2. **Hardcoded URLs**: `ticket-538-roles-cleanup.spec.ts` asserts against `http://localhost:3000/` while the server runs on port `3005`.
3. **Flaky Wait Strategies**: `settings.spec.ts` uses `networkidle`, which is unstable in modern apps with background polling/analytics.
4. **Blocking DB Operations**: Extensive use of `execSync` and direct Prisma client instantiation in `beforeAll` hooks may be causing intermittent crashes or slow responses during test initialization.

## 3. Proposed Implementation Plan

### Phase 1: Infrastructure Stabilization
- Update `playwright.config.ts`:
    - Replace `port: 3005` with `url: 'http://127.0.0.1:3005/'` in `webServer` config.
    - Increase `webServer.timeout` to 120s (already 600s, so this is fine).
    - Ensure `reuseExistingServer` is strictly `false` in CI.

### Phase 2: Test Script Corrections
- **`ticket-538-roles-cleanup.spec.ts`**:
    - Update assertions to use `baseURL` or relative paths.
    - Fix the expected URL in `expect(page.url()).toBe(...)`.
- **`analytics.spec.ts`**:
    - Ensure `PrismaClient` is disconnected in `afterAll`.
    - Add retries to `execSync` calls if they fail due to transient DB issues.
- **`settings.spec.ts`**:
    - Remove `page.waitForLoadState('networkidle')`.
    - Use explicit `page.waitForSelector()` for critical UI elements.
    - Split the monolithic `create, edit, and delete` test into smaller units.

### Phase 3: Validation
- Run tests locally with `workers: 1` and `workers: >1` to check for concurrency issues.
- Monitor CI runs for at least 5 consecutive successful passes.

## 4. Definition of Done (DoD)
- [ ] `playwright.config.ts` updated with robust health check.
- [ ] `ticket-538` hardcoded URL fixed.
- [ ] `settings.spec.ts` wait strategies updated.
- [ ] All 3 reported flaky tests pass consistently in CI.
- [ ] No regressions in other E2E tests.
