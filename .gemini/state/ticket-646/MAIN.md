---
ticket_id: 646
branch_name: feature/646-implement-durable-workflow-orchestration-for-video-publishing-inspired-by-postiz
status: qa
current_round: 2
---

# 📋 Ticket Metadata
- **ID**: 646
- **Branch**: `feature/646-implement-durable-workflow-orchestration-for-video-publishing-inspired-by-postiz`
- **Goal**: Implement a durable workflow orchestration layer using Inngest to ensure video publishing jobs are resilient and traceable.
- **Current Status**: qa

# 📝 Ticket Description
### Context
As we scale our video-first distribution, reliability is paramount. Social media APIs (especially Meta and TikTok) often involve long-running asynchronous processes where a "Media Container" is created, processed, and then finally published. Current simple timeout-based or one-off job attempts are prone to failure during platform outages or network glitches.

### Goal
Implement a durable workflow orchestration layer (inspired by Postiz's use of Temporal) to ensure that video publishing jobs are resilient, traceable, and automatically retried upon failure.

### Suggested Approach
1. **Workflow Engine Selection:** Evaluate **Temporal** (as used by Postiz) or a lighter Node-native alternative like **Inngest** or **BullMQ** with advanced retry logic.
2. **Activity Decomposition:** Split the publishing flow into distinct activities:
   - `pre_verify`: Validate video format/size locally.
   - `create_container`: Initial platform API handshake.
   - `poll_processing`: Durable polling with exponential backoff until the platform returns `FINISHED`.
   - `publish_broadcast`: Final live push.
3. **State Persistence:** Ensure each step's state is persisted in the database to allow for manual intervention or "Resume from Step X" functionality.

### Impact
This will eliminate "silent failures" during video uploads and provide a professional-grade audit trail for every publishing attempt, significantly improving user trust.

### Technical Implementation Hint
- Use the **Factory Pattern** (similar to Postiz's `SocialAbstract`) to define a standard `Activity` interface for all platform providers.
- Implement a `checkLoaded` polling activity with a configurable "Platform Propagation Delay" (e.g., 40s for Threads videos).

# 🔄 Round History
- **Round 1**: [FAILED @ Audit] - Path traversal in StorageProvider, unthrottled DB writes, PII leak in logs, and modularity violations.
- **Round 2**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-14 18:31:46]**: DISCOVERY [NECESSARY] - Discovery complete. Recommended Inngest for durable publishing workflows.
- **[2026-06-14 19:09:04]**: DEV [SUCCESS] - Initial implementation of Inngest workflow and activity pattern.
- **[2026-06-14 19:13:40]**: AUDIT [FAIL] - Security (Path Traversal), Performance (DB Throttling), and Modularity (100-line rule) failures.
- **[2026-06-14 19:14:51]**: DEV [SUCCESS] - Remediated Round 1 findings: sanitized paths, throttled writes, and modularized workflow.
- **[2026-06-14 20:00:00]**: PROJECT [SUCCESS] - Aligned branch name and state files with orchestration standards. Started Round 2.
- **[2026-06-14 19:59:00]**: DEV [SUCCESS] - Remediated type safety and linting violations.
- **[2026-06-14 20:01:22]**: AUDIT [PASS] - Verified durable workflow orchestration implementation with Zero-Any compliance, path traversal sanitization, and performance throttling.
