# Discovery Report: Durable Workflow Orchestration for Video Publishing (Ticket #646)

## 1. Current Implementation Analysis

### State of the Art
- **Orchestration:** Manual `Promise.allSettled` loop in `src/lib/worker/server-distributor.ts`.
- **Infrastructure:** Background worker in `src/lib/worker/worker.ts` using `setInterval` (10s polling).
- **Platform Support:** Modular implementation for Instagram, Facebook, YouTube, and TikTok.
- **Persistence:** `PostPlatformResult` table tracks `status`, `resumableUrl`, and basic progress.

### Friction Points
1. **Lack of Durability:** If the Node process restarts or Vercel function times out, the entire distribution loop is lost or must be restarted from scratch.
2. **Zombie Processes:** Failed Meta container polling can block worker slots.
3. **Resumption Complexity:** While `resumableUrl` exists, there's no formal "Step Recovery" logic.
4. **Platform-Specific Deadlocks:** Slow platform processing (Meta) forces the worker to wait in a non-durable state.

## 2. Technical Evaluation: Workflow Engines

| Feature | Temporal | **Inngest (Recommended)** | BullMQ |
| :--- | :--- | :--- | :--- |
| **Architecture** | Cluster-based (Sidecar/External) | **Serverless-Native (Webhook)** | Redis-based |
| **Infra Overhead** | High (Requires Go/Rust binary) | **Zero (SaaS / Local Dev)** | Medium (Requires Redis) |
| **Vercel/Next.js** | Complex (SDK is heavy) | **Perfect (App Router Ready)** | Tricky (Worker needed) |
| **State** | Persistent in Cluster DB | **Persistent in Inngest Cloud** | Persistent in Redis |
| **Retry Logic** | Native & Advanced | **Native & Simple** | Basic |

**Recommendation:** **Inngest**. It aligns with the Next.js 15 / Vercel architecture and requires zero infrastructure changes.

## 3. Proposed Decomposition (Activity-Based)

The publishing flow will be refactored into a durable Inngest workflow:

1. **`publishing/start` (Trigger)**
   - Event containing `activityId`, `userId`, `platforms`.

2. **`activity:pre_verify`**
   - Validate file existence in `tmp/`.
   - Refresh OAuth tokens if `< 15m` remaining.
   - Check platform rate limits.

3. **`activity:init_container`**
   - Create Meta Containers / YouTube Resumable Sessions.
   - Persist `creationId` or `resumableUrl` to `PostPlatformResult`.

4. **`activity:push_media`**
   - Binary streaming to platform endpoints.
   - Supports range-based resumption.

5. **`activity:poll_status` (Wait Step)**
   - Inngest `step.waitForEvent` or `step.run` with exponential backoff.
   - Specifically for Meta's `status_code` polling.

6. **`activity:finalize`**
   - Commit the post and fetch the final permalink.

## 4. Persistent State Strategy

We will utilize the existing `PostPlatformResult` table with enhanced status mapping:
- `PENDING`: Waiting for discovery.
- `INITIALIZING`: Creating containers.
- `UPLOADING`: Pushing binary data.
- `PROCESSING`: Waiting for platform transcoding (Polling).
- `READY`: Polling finished, ready to finalize.
- `SUCCESS`: Published.
- `FAILED`: Terminal error.

## 5. Socratic Log & Interrogation

- **Feasibility:** Can we safely use Inngest on the current stack? **Yes.** It's HTTP-based and works with Vercel.
- **Strategic Alignment:** Does this solve a real problem? **Yes.** Publishing is currently the most fragile part of the system.
- **Dependency Check:** Does Inngest introduce a cost? **Free tier is generous**, but it is a SaaS dependency.
- **Fallback:** What if Inngest is down? We should maintain the `local.ts` distribution for non-critical logging.

## 6. Technical Specifications

- **Client:** `@inngest/sdk` integration in `src/lib/inngest/`.
- **Function:** `videoPublishingWorkflow` (Trigger: `publishing/queued`).
- **Steps:** Implement 5 discrete steps matching the decomposition above.
- **Concurrency:** Limit `facebook`/`instagram` steps to 2 concurrent per user to avoid Meta rate limits.

## 7. Test Specification

- **Success Scenario:** Publish to 3 platforms simultaneously; verify all steps complete and state is updated.
- **Recovery Scenario:** Kill the dev server mid-upload; verify Inngest resumes the step upon restart.
- **Token Expiry Scenario:** Mock a token expiry in Step 3; verify Step 1 (Refresh) is re-executed or handled.
- **Platform Failure:** Mock Meta `EXPIRED_CONTAINER` error; verify Step 2 is re-initialized.

## [2026-06-14 18:31:46] Verdict: NECESSARY
Performed deep dive into current publishing logic (server-distributor.ts). Evaluated Inngest vs Temporal; Inngest selected for Vercel/Next.js compatibility. Proposed 5-step activity decomposition. State persistence mapped to existing PostPlatformResult model. Ready for development.
