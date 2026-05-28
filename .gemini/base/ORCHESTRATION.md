# Agent Orchestration & Workflow

## Core Mandates
- **Strict Initialization:** Before any work begins, the Orchestrator MUST:
  1. Switch to `main` and pull latest (`git checkout main && git pull`).
  2. Create a dedicated feature branch (`feature/<id>-short-description`).
  3. Create a state file `.gemini/state/ticket-<id>.md` following the **Markdown Lifecycle Template**.
- **Traceable Status:** EVERY agent MUST update their specific section in the current `Round X` of the state file before handing off.
- **Direct Routing Focus:** Every agent MUST maintain unwavering focus on the `Goal` defined in the YAML frontmatter.
- **Context Preservation:** Updates to state files MUST be non-destructive merges. Bypassing state updates is a protocol violation.
- **Per-Agent Commits:** Every agent MUST stage and commit their modifications (including state file updates) immediately upon completion and BEFORE handoff to the next agent in the sequence. Collective "end-of-task" commits are prohibited to ensure maximum traceability.

## State Management & Pruning
- **Pruning Trigger:** If a state file (`.gemini/state/ticket-<id>.md`) exceeds **100 lines** or **3 rounds** of activity, it MUST be pruned.
- **Archival:** The full content is moved to `.gemini/state/archive/ticket-<id>-<timestamp>.md`.
- **Summary Initialization:** The active state file is reset with a `Summary` section containing:
  - `Key Decisions`: Major architectural or logic choices.
  - `Lessons Learned`: Failures or friction points encountered.
  - `Verification Outcomes`: Pass/Fail status of critical build/test steps.

## Markdown Lifecycle Template
Every state file MUST adhere to this structure (YAML Frontmatter + Markdown Sections):
```markdown
---
ticket_id: 123
branch_name: feature/...
goal: Concise goal statement
status: in-progress
---

# Round 1

## 🔍 Discovery
- **Strategic Importance**: ...
- **Dual-Agent Protocol**: ...
- **Technical Blueprint**: ...
- **Impact Radius**: ...
- **Production Readiness**: ...
- **Test Specification**: ...

## 🛠️ Development
- **Actions**: ...
- **Modified Files**: ...

## 🛡️ Review
- **Checklist**:
  - [ ] Modularity (50-line rule)
  - [ ] Zero-Any Policy
  - [ ] No Emojis
  - [ ] Security/Audit

## 🧪 QA
- **Scenarios**: ...
- **Results**: ...

## 📝 Documentation
- **Updates**: ...

## 📊 Project
- **Status**: ...
```

## Agent Specific Workflows

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant. Create blueprints and risk assessments.
- **Discovery Outcomes:**
  - **Approved (DoR Met):** Move to `dev-agent` for implementation.
  - **Rejected (Non-Viable):** Close the ticket. Provide a detailed rationale in the `findings` section explaining why the fix/feature is unnecessary, dangerous, or technically impossible.
  - **Parked (Deferred):** Move to `backlog`. Define specific "Re-evaluation Triggers" (e.g., "Wait for API v2", "Revisit after Q3 launch").
  - **Needs-Info:** Return to `discovery-agent` for Round 2 after user/technical clarification.
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
- **MANDATORY Exhaustive Verification:** Before handing off, the `dev-agent` MUST successfully execute the full verification suite (`npm run build` and `npm run lint`). **Token-optimized shortcuts (e.g., using `tsc` instead of a full `build`) are STRICTLY FORBIDDEN.** The build must pass to ensure Server-Side Rendering (SSR) and data hydration logic are fundamentally sound.

### Review (QA & Security Audit)
- **Role:** Senior QA & Security Auditor.
- **Audit Checklist:** Architecture, Secondary Impact, Security, Data, Modularity (50-line rule), State Compliance (Verify ticket state schema).

### QA (E2E Test Automation)
- **Role:** Expert Lead QA Automation Writer & Execution Engineer. Responsible for both Web (Playwright) and Native (Maestro) testing.
- **MANDATORY Full-Suite Execution:** The `qa-agent` MUST run the entire test suite (`npm test`) to ensure no regressions were introduced outside the modified files.
- **Visual Regression:** For UI changes, capture screenshots in `verification/` and compare against goldens in `docs/visual/goldens/` using `@visual` tagged tests.
- **Mobile Automation:** For UI changes, E2E tests MUST be executed on Desktop/Mobile emulation (Playwright). For changes affecting the Capacitor shell or native plugins, Native App Automation (Maestro) MUST be written (YAML flows) and executed on a running simulator/emulator.

### Documentation (Living Source of Truth)
- **Role:** Tech Writer & Architect.
- **System Optimization:** Analyze `category: "meta"` incidental observations and prune redundant rules.

### Project Agent (Management & Tracking)
- **Role:** Project Manager. Issue creation and Project Board sync.

## Routing & Pipelines
- **Standard Sequence:** `discovery` → `dev` → `review` → `qa` → `doc` → `project`.
- **Single Workflow Mandate:** ALL changes, including documentation and meta-updates, MUST follow the standard sequence. Every step MUST be accompanied by an atomic commit from the respective agent. The 'Fast-Track' to `main` is abolished to ensure auditability.
- **Branching Protocol:** ALL code and documentation changes require a feature branch created from an up-to-date `main` branch.
- **Protocol Failure:** Any deviation from this workflow (skipping initialization, bypassing agents, or omitting state updates) is considered a terminal protocol violation and must be corrected immediately.
