# Ticket #646: Implement Durable Workflow Orchestration for Video Publishing

## Status
- **Current Phase:** Development
- **Round:** 1

## Summary
Implement a durable workflow orchestration layer using **Inngest** to ensure that video publishing jobs are resilient, traceable, and automatically retried upon failure. Inngest was selected for its serverless-friendly architecture and seamless integration with Next.js 15.

## Goals
- [x] Evaluate and select a workflow engine (Selected: **Inngest**).
- [ ] Install and configure `@inngest/sdk`.
- [ ] Decompose the publishing flow into distinct activities (`pre_verify`, `init`, `push`, `poll`, `finalize`).
- [ ] Implement state persistence for manual intervention or "Resume from Step X" functionality.
- [ ] Refactor platform providers to follow a standard `Activity` interface.

## Phase History

### Discovery (Round 1)
- [x] Research current video publishing implementation.
- [x] Evaluate workflow engine options (Inngest selected).
- [x] Define the activity interface and decomposition.
- [x] Create discovery report.

### Development (Round 1)
- [ ] Setup Inngest client and event definitions.
- [ ] Implement `videoPublishingWorkflow`.
- [ ] Refactor platform modules.
- [ ] Enhance database persistence.

## Artifacts
- N/A

# 📅 Timeline
- **[2026-06-14 18:31:46]**: DISCOVERY [NECESSARY] - Discovery complete. Recommended Inngest for durable publishing workflows.
