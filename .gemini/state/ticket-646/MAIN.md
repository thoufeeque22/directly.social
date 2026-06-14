# Ticket #646: Implement Durable Workflow Orchestration for Video Publishing

## Status
- **Current Phase:** Discovery
- **Round:** 1

## Summary
Implement a durable workflow orchestration layer (inspired by Postiz's use of Temporal) to ensure that video publishing jobs are resilient, traceable, and automatically retried upon failure.

## Goals
- Evaluate and select a workflow engine (Temporal, Inngest, or BullMQ).
- Decompose the publishing flow into distinct activities (`pre_verify`, `create_container`, `poll_processing`, `publish_broadcast`).
- Implement state persistence for manual intervention or "Resume from Step X" functionality.
- Use the Factory Pattern for a standard `Activity` interface across platform providers.

## Phase History

### Discovery (Round 1)
- [ ] Research current video publishing implementation.
- [ ] Evaluate workflow engine options (Inngest vs BullMQ).
- [ ] Define the activity interface and decomposition.
- [ ] Create discovery report.

## Artifacts
- N/A

# 📅 Timeline
- **[2026-06-14 18:31:46]**: DISCOVERY [NECESSARY] - Discovery complete. Recommended Inngest for durable publishing workflows.
