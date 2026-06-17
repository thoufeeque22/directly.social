# Discovery: Ticket #646 (Complete)

## Objective
Research the current video publishing flow and evaluate the best durable workflow engine for the project.

## Current State Analysis
- **Core Files:** `src/lib/worker/server-distributor.ts` and platform modules in `src/lib/platforms/`.
- **Mechanism:** Direct polling and one-off job attempts in a 10-second loop.
- **Pain Points:** "Zombie Polling" (polling jobs that lose context) and "Mid-Upload Crash" (no resumption capability).

## Engine Evaluation
### Option 1: Temporal
- **Verdict:** Rejected. High infrastructure overhead (requires Temporal Server).

### Option 2: Inngest
- **Verdict: SELECTED.** Event-driven, serverless-friendly, handles retries via HTTP, and ensures idempotency through `step.run`. Perfect fit for Next.js 15 and Vercel.

### Option 3: BullMQ
- **Verdict:** Rejected. Requires persistent workers and Redis, less ideal for a Vercel-first deployment than Inngest.

## Proposed Technical Specs
- **Workflow:** `videoPublishingWorkflow` in `src/lib/inngest/`.
- **Activities:**
  1. `pre_verify`: Validate format, size, and tokens.
  2. `init`: Platform API handshake (e.g., create Media Container).
  3. `push`: Upload binary content (support resumable uploads).
  4. `poll`: Durable polling with exponential backoff until `FINISHED`.
  5. `finalize`: Final push/broadcast.
- **Database:** Enhance `server-distributor.db.ts` to store `stepId`, `resumableUrl`, and granular statuses.

## Verification Strategy
- **Happy Path:** Full E2E publishing flow.
- **Resumption:** Fail at `push` and verify resumption from the last byte.
- **Token Refresh:** Verify mid-workflow token refresh logic.
- **Concurrency:** Ensure platform rate limits are respected.
