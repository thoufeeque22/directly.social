# Persistent Autonomous Orchestration

## Overview
This system enables continuous, multi-session autonomous task execution. The agent chain persists its state in `.gemini/state/ticket-<id>.json`, allowing any session to resume the pipeline exactly where it left off.

## State Machine
The `.gemini/state/ticket-<id>.json` file serves as the definitive source of truth. Every agent is responsible for:
1. Reading its input state from the context.
2. Executing its assigned directive.
3. Updating the context with its findings and results.
4. Setting the `last_agent` to the next agent in the sequence.

### State Management & Pruning
To maintain performance, state files are automatically pruned when they exceed **50KB** or **3 rounds** of activity. 
- **Archival:** Full context is moved to `.gemini/state/archive/`.
- **Summary:** The active file is reset with a high-level summary of decisions, lessons, and outcomes.

## Agent Specific Protocols

### Discovery DoR (Definition of Ready)
Before implementation begins, the `discovery-agent` must provide a comprehensive `TECHNICAL SPECS` block. This ensures all features have a clear rationale, dual-perspective (Advocate/Skeptic) audit, and defined impact radius before a single line of code is written.

### Visual Regression Protocol
For any UI changes, the `qa-agent` executes visual regression tests using Playwright.
- **Snapshots:** Captured in `verification/` for manual audit.
- **Goldens:** Compared against baseline images in `docs/visual/goldens/`.
- **Themes:** Verified in both Light and Dark modes.

## Lifecycle
- **Trigger:** `/autostart <ticket_id>` initializes the context.
- **Persistence:** The context is maintained in the root directory.
- **Auto-Resume:** Upon starting a new session, the agent *must* inspect `.gemini/state/ticket-<id>.json`. If an active pipeline is found, it automatically resumes.
- **Hooks:** `.gemini/hooks/post-task.sh` is executed between agent handoffs to ensure environment consistency.

## Agent Sequence
`discovery-agent` → `dev-agent` → `review-agent` → `qa-agent` → `doc-agent` → `project-agent`
