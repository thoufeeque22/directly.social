# Development: Ticket #646

## Objective
Implement durable workflow orchestration using Inngest.

## Tasks
- [ ] Install `@inngest/sdk`.
- [ ] Create Inngest client in `src/lib/inngest/client.ts`.
- [ ] Define event schemas in `src/lib/inngest/events.ts`.
- [ ] Implement `videoPublishingWorkflow` in `src/lib/inngest/functions/video-publishing.ts`.
- [ ] Refactor platform modules (`src/lib/platforms/`) to export activity functions.
- [ ] Update `src/lib/worker/server-distributor.ts` to trigger Inngest.
- [ ] Update database schema/functions to store granular status and `resumableUrl`.

## Implementation Plan
1. **Infrastructure:** Install Inngest SDK and setup the client.
2. **Abstractions:** Define the standard `Activity` interface using the Factory Pattern.
3. **Workflow logic:** Implement the multi-step Inngest function with `step.run`.
4. **Integration:** Hook into the existing distribution trigger.

## Verification
- Unit tests for activity functions.
- Integration tests for the Inngest workflow (mocking the Inngest environment if possible).
- Manual verification of "Resume from Step X" by simulating failures.

## [2026-06-14 19:09:04] Verdict: SUCCESS
Implemented durable video publishing workflow with Inngest and activity pattern. Refactored platforms to follow a standard activity interface. Introduced InfrastructureRegistry for dependency inversion. Verified type safety and architectural compliance.

