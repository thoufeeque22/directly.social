# Agent Orchestration & Workflow

## Core Mandates
- **Strict Initialization:** Before any work begins, the Orchestrator MUST:
  1. Switch to `main` and pull latest (`git checkout main && git pull`).
  2. Create a dedicated feature branch (`feature/<id>-short-description`).
  3. Create a state file `.gemini/state/ticket-<id>.json` based on the task description.
- **Traceable Status:** EVERY agent involved in the pipeline (Discovery, Dev, QA, etc.) MUST update the `steps` and `status` in the `ticket-<id>.json` file before handing off.
- **Direct Routing Focus:** Every agent MUST maintain unwavering focus on the `ticket_goal` defined in the ticket state file.
- **Context Preservation:** Updates to state files MUST be non-destructive merges.
- **Handoff & Commit:** Every agent MUST stage and commit their modifications before transition.

## State Management & Pruning
- **Pruning Trigger:** If a state file (`.gemini/state/ticket-<id>.json`) exceeds **50KB** or **3 rounds** of activity, it MUST be pruned.
- **Archival:** The full context is moved to `.gemini/state/archive/ticket-<id>-<timestamp>.json`.
- **Summary Initialization:** The active state file is reset with a `summary` block containing:
  - `key_decisions`: Major architectural or logic choices.
  - `lessons_learned`: Failures or friction points encountered.
  - `verification_outcomes`: Pass/Fail status of critical build/test steps.

## Agent Specific Workflows

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant. Create blueprints and risk assessments.
- **Discovery Definition of Ready (DoR):** Before handing off to `dev-agent`, the `discovery-agent` MUST provide a `TECHNICAL SPECS` block that includes:
  1. **Strategic Importance:** Explicit rationale for "Why now?" and impact of skipping/deferring.
  2. **Dual-Agent Protocol:** Synthesis of Advocate/Skeptic perspectives.
  3. **Technical Blueprint:** Detailed file paths, data flow, and logic.
  4. **Impact Radius:** List of affected modules and potential side-effects.
  5. **Production Readiness:** Plan for Logging, Caching, and Rate-limiting.
  6. **Test Specification:** Required E2E scenarios (Happy/Edge/Negative).

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular, maintainable code.
- **Path-Based Specialization:** Systems Specialist (logic/API) vs UX Specialist (components/styling).

### Review (QA & Security Audit)
- **Role:** Senior QA & Security Auditor.
- **Audit Checklist:** Architecture, Secondary Impact, Security, Data, Modularity (50-line rule).

### QA (E2E Test Automation)
- **Role:** Expert Lead QA Automation Writer & Execution Engineer.
- **Visual Regression:** For UI changes, capture screenshots in `verification/` and compare against goldens in `docs/visual/goldens/` using `@visual` tagged tests.
- **Mobile Automation:** For UI changes, all E2E tests MUST be executed on both Desktop and Mobile emulation projects (Chrome/Safari) to ensure cross-platform compatibility within the Capacitor shell.

### Documentation (Living Source of Truth)
- **Role:** Tech Writer & Architect.
- **System Optimization:** Analyze `category: "meta"` incidental observations and prune redundant rules.

### Project Agent (Management & Tracking)
- **Role:** Project Manager. Issue creation and Project Board sync.

## Routing & Pipelines
- **Standard Sequence:** `discovery` → `dev` → `review` → `qa` → `doc` → `project`.
- **Fast-Track Protocol:** Meta-updates and documentation can go direct to `main`.
- **Branching Protocol:** App code changes require a feature branch. Always create feature branches from an up-to-date `main` branch.
