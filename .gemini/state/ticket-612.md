# Ticket #612: Critical: Systematic E2E Environment Breakdown (45 Failures)

## Status
- [x] Discovery
- [x] Development
- [/] Review
- [ ] QA
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
- [/] Pending Review.
