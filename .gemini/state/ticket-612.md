# Ticket #612: Critical: Systematic E2E Environment Breakdown (45 Failures)

## Status
- [x] Discovery
- [x] Development
- [x] Review
- [/] QA
- [ ] Documentation
- [ ] Project Management

## 🔍 Discovery Findings
### Root Cause Analysis
1. **Server Overhead**: Running E2E against `next dev` causes high resource consumption and `ECONNRESET` under parallel load.
2. **Temp File Collisions**: Hardcoded `tmp/` paths lead to race conditions and `ENOENT` errors when multiple workers attempt to access/delete the same files.
3. **Data Inconsistency**: `prisma db seed` was not running reliably in the global setup.
4. **Stale Baselines**: Legitimate UI changes (e.g., #365) invalidated visual snapshots.

### Technical Blueprint (Implemented)
- **Server Execution**: Switched `playwright.config.ts` to use `npm run build && npm run start` for E2E tests.
- **Worker Isolation**: Refactored `src/lib/worker/worker.ts` to use unique paths based on `TEST_WORKER_INDEX`.
- **Seeding & Reset**: Implemented `src/__tests__/e2e/global-setup.ts` to run `clear-activity` and seeding once per test run.
- **Snapshot Update**: Updated visual regression snapshots.

## Goals
- [x] Diagnose and fix seeding infrastructure.
- [x] Resolve temporary file pathing and cleanup issues.
- [x] Improve test server stability under parallel load.
- [x] Update visual regression baselines.

## Progress
- [x] Initialized ticket and feature branch.
- [x] Created state file.
- [x] Completed Discovery phase with `discovery-agent`.
- [x] Approved for Development.
- [x] Switched E2E to production server mode.
- [x] Implemented global setup for seeding and cleanup.
- [x] Isolated worker temporary directories.
- [x] Updated visual snapshots.
- [x] Reduced workers to 1 for maximum stability.
- [x] Committed initial changes.
- [x] Remediated Reviewer feedback:
    - Removed hardcoded fallback password in `src/auth.ts` (Security Fix).
    - Restored and refined `TEST_WORKER_INDEX` logic in `src/lib/worker/worker.ts`.
    - Propagated worker context in `playwright.config.ts`.
    - Fixed type check failures in unit tests.
- [x] Review approved by `review-agent`.
- [/] QA phase in progress.

## 🛡️ Review Recap
### Remediations
1. **Security**: Removed hardcoded `'social-studio-e2e-secret'`. `E2E_TEST_PASSWORD` is now strictly enforced.
2. **Isolation**: `TEST_WORKER_INDEX` is now correctly propagated to the web server, allowing for future parallel scaling while maintaining file-system integrity.
3. **Quality**: Fixed legacy type errors in `useActivityData.test.ts` and `stream-utils.test.ts`.

## 🧪 QA (Verification)
- [ ] Run full E2E suite (`npx playwright test`).
- [ ] Verify "Grand Canyon" data visibility.
- [ ] Confirm no `ECONNRESET` or `ENOENT` errors remain.
