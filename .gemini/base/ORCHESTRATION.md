# Agent Orchestration & Workflow

## Core Mandates
- **Ticket Initialization:** Before starting work on a new ticket, the Main Agent (Orchestrator) MUST switch to the `main` branch, pull the latest changes (`git checkout main && git pull`), and check for any existing open PRs related to the ticket to avoid duplicate work.
- **Direct Routing Focus:** Every agent MUST maintain unwavering focus on the `ticket_goal`, `ticket_description`, and `acceptance_criteria` defined in `.gemini/state/ticket-<id>.json`. incidental discoveries MUST be logged to `.gemini/incidental_observations.json`.
- **Context First:** Always check `.gemini/state/ticket-<id>.json` for current state before acting.
- **Context Preservation Mandate:** Every update to `.gemini/state/ticket-<id>.json` AND `.gemini/incidental_observations.json` MUST be a non-destructive merge.
- **Handoff & Commit Rule:** Every agent MUST stage and commit all files they have modified as part of the current task.

## State Management & Pruning (Ticket 571)
- **Pruning Trigger:** If a state file (`.gemini/state/ticket-<id>.json`) exceeds **50KB** or **3 rounds** of activity, it MUST be pruned.
- **Archival:** The full context is moved to `.gemini/state/archive/ticket-<id>-<timestamp>.json`.
- **Summary Initialization:** The active state file is reset with a `summary` block containing:
  - `key_decisions`: Major architectural or logic choices.
  - `lessons_learned`: Failures or friction points encountered.
  - `verification_outcomes`: Pass/Fail status of critical build/test steps.

## Active Tasks
- [Refactor Platform Layer (#563)](.gemini/state/ticket-563.json) - In Progress (feature/563-refactor-platform-distribution)

## Agent Specific Workflows

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant. Create blueprints and risk assessments.
- **Discovery Definition of Ready (DoR) (Ticket 572):** Before handing off to `dev-agent`, the `discovery-agent` MUST provide a `TECHNICAL SPECS` block that includes:
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
- **Visual Regression (Ticket 573):** For UI changes, capture screenshots in `verification/` and compare against goldens in `docs/visual/goldens/` using `@visual` tagged tests.

### Documentation (Living Source of Truth)
- **Role:** Tech Writer & Architect.
- **System Optimization:** Analyze `category: "meta"` incidental observations and prune redundant rules.

### Project Agent (Management & Tracking)
- **Role:** Project Manager. Issue creation and Project Board sync.

## Routing & Pipelines
- **Standard Sequence:** `discovery` → `dev` → `review` → `qa` → `doc` → `project`.
- **Fast-Track Protocol:** Meta-updates and documentation can go direct to `main`.
- **Branching Protocol:** App code changes require a feature branch. Always create feature branches from an up-to-date `main` branch.
