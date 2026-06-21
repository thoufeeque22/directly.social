# Agent Orchestration & Workflow

> **MANDATORY:** All agents MUST use the centralized constants and patterns defined in [VARIABLES.md](VARIABLES.md). NEVER hardcode strings for branch names, state directories, verdicts, or commands.

## Core Mandates
- **Local Model Offloading (Zero Token Exhaustion Policy):** The Main Orchestrator and all sub-agents MUST aggressively offload high-token, repetitive, or read-heavy tasks to local models via `ollama_chat` or the `cavecrew` subagents. The cloud orchestrator MUST act strictly as a high-level manager.
  - **Large Context / Whole-File Reviews (Audit Agent):** Use `qwen-coder-64k:latest` (64k context for large files/logs).
  - **Heavy Implementation / Deep Reasoning (Architect/Discovery):** Use `deepseek-coder-v2` or `llama3.1:70b`.
  - **Fast, Surgical Edits / Boilerplate (Dev Agent/Cavecrew Builder):** Use `qwen2.5-coder:1.5b` or `phi3.5`.
  - **Code Generation & Test Writing (QA/Doc Agent):** Use `codestral`.
  - **General Purpose / Reasoning Fallback:** Use `llama3.1:8b` or `gemma4:latest`.
- **Real-Time Auditing (Cavecrew Watcher):** The Orchestrator MUST schedule a background loop (using `phi3.5` or `qwen2.5-coder:1.5b`) to continuously monitor file saves and provide 1-line real-time architectural warnings *as code is written*, rather than waiting for the formal Audit phase.
- **Active Inquisitiveness (Collaborative Inquiry):** AI agents MUST act as collaborative partners, not just execution machines. If any request, requirement, or technical path is ambiguous, the agent MUST stop and ask the user for clarification before proceeding. "Guessing" is a terminal violation.
- **Strict Initialization:** Before any work begins, the Orchestrator MUST follow this **Dependency Rule**: `Ticket Description -> Git Branch -> Artifact`.
  1. Fetch the ticket description (body) from GitHub (e.g., using `mcp_github_get_issue`).
  2. Check the current branch. If NOT on the target feature branch (`FEATURE_BRANCH_PATTERN`):
     a. Switch to `MAIN_BRANCH` and pull latest (`git checkout main && git pull`).
     b. Create the dedicated feature branch (`git checkout -b <FEATURE_BRANCH_PATTERN>`).
  3. **MANDATORY:** Verify the branch exists and matches the full slug before proceeding.
  4. Create an initial phase Artifact using `write_to_file` in `ARTIFACT_DIR` containing the ticket ID, branch name, and current status.
  5. Skip if an Artifact for the ticket already exists in the current conversation.
- **Manual Environment Management:** The User always manages the development server (`pnpm dev`), the E2E test server (`http://localhost:3000`), and network tunnels (e.g., `tailscale funnel`) manually. AI agents MUST NOT attempt to start, restart, check the connectivity of these services, or modify/enable any Playwright `webServer` configuration. ALL E2E tests are strictly bound to `http://localhost:3000`.
- **Strict Sequential Workflow:** ALL tickets MUST follow the `PHASE_ORDER`.
- **Guardrail Mandates (Terminal Violations):**
  1. **Issue-First Protocol:** Before starting any work, the Orchestrator MUST ensure a corresponding GitHub issue exists. If the task is new or doesn't have an ID, the Orchestrator MUST invoke the `project-agent` to create the issue FIRST.
  2. **No Direct Main Push:** AI agents are STRICTLY FORBIDDEN from merging into or pushing directly to the `MAIN_BRANCH`. ALL code changes MUST live on a dedicated feature branch (`FEATURE_BRANCH_PATTERN`).
  3. **PR-Only Handoff:** The final handoff to the user MUST be for **Pull Request creation**. The agent must never perform the final merge locally.
  4. **Artifact-First Protocol:** NEVER start a phase without first writing or updating an Artifact in `ARTIFACT_DIR` (see `VARIABLES.md`).
- **Phase Termination & Failure Protocol:**
  1. **Atomic Phases:** An agent MUST NOT proceed to the next phase autonomously. It MUST write its final Artifact with `RequestFeedback: true`, set its **Verdict**, and return control to the Orchestrator.
  2. **Next Step Suggestion:** Upon completing a phase, the agent MUST explicitly suggest the next sub-agent in the sequence to the user.
  3. **Immediate Stop on Failure:** If any phase (especially `Audit` or `QA`) results in a **FAIL** verdict, the current round MUST terminate immediately.
  4. **Round 2+ Entry Point:** If a round fails during `Audit` or `QA`, the next round MUST begin with `dev-agent`. The sequence restarts from `Development`.
- **Human-in-the-Loop Workflow (HARD STOP):** ALL transitions between agent phases MUST be mediated by the user. **The Orchestrator MUST immediately HALT execution and return control to the User after writing a phase Artifact. The Orchestrator is STRICTLY FORBIDDEN from automatically chaining to the next phase or running multiple sub-agents in a single turn without explicit user approval.**
  1. **Inquiry-First Protocol:** The initial turn of any planning agent (`Product`, `Discovery`) SHOULD focus on asking questions to resolve ambiguity. If the agent is in doubt, it MUST set its Verdict to **NEEDS-INFO** and present its questions to the user.
  2. **Artifact-First Protocol (Robust Updates):** Agents MUST write their final Artifact using `write_to_file` to `ARTIFACT_DIR` with `ArtifactMetadata.RequestFeedback: true` BEFORE terminating. This natively pauses the Orchestrator and presents a "Proceed" UI to the user.
  3. **Manual Review:** The user reviews the Artifact and the ticket state.
  4. **Explicit Approval & Auto-Commit:** When the User provides approval to proceed to the next phase, the Orchestrator MUST automatically commit any pending changes from the current phase before starting the next one. The commit message MUST follow the `COMMIT_MSG_PATTERN`.
- **Traceable Status:** EVERY agent MUST update their section with a clear **Verdict** before handoff.

## Tiered Testing Strategy
To maintain speed and context efficiency, the project uses a tiered testing model based on tags (`@smoke`, `@regression`):

- **Smoke Suite (`@smoke`):** Critical paths only (Login, Main Dashboard load, Core Upload start). Must take < 60 seconds.
- **Regression Suite (`@regression`):** Broad feature coverage (Settings, AI generation, Gallery, Filtering).
- **Full Suite:** The complete test directory, including long-running E2E and edge-case unit tests.

### Agent Test Mandates
- **dev-agent:** MUST use `ARCHITECT_SKILL`. MUST run `SMOKE_TEST_CMD` and `LINT_CMD`. May skip `BUILD_CMD` on fast-iteration loops if already run for the current changeset.
- **audit-agent:** READ-ONLY. Focus on Security, Privacy (PII), and Performance (Web Vitals).
- **qa-agent:** MUST run `REGRESSION_TEST_CMD`. May run targeted tests for high-impact features.
- **Human-in-the-Loop:** The **User** SHOULD run the full suite (`pnpm test`) before final merge.

> All command identifiers (`SMOKE_TEST_CMD`, `REGRESSION_TEST_CMD`, etc.) are defined in `VARIABLES.md`.

## Artifact Templates
Each phase MUST produce an Artifact in `ARTIFACT_DIR` with `RequestFeedback: true`. Paths and directory constants are in `VARIABLES.md`.

Required fields in every Artifact:
1. **Verdict** — from `PHASE_SPECIFIC_VERDICTS` in `VARIABLES.md`.
2. **Current Round** — iteration number.
3. **Phase-Specific Data** — e.g. Socratic Log, Root Cause Analysis, Gap Analysis, Failures.

> **Round 2+:** Dev artifacts MUST include Root Cause Analysis + Remediation Strategy. Audit/QA artifacts MUST include Gap Analysis explaining why previous checks failed.


## Agent Specific Workflows

### Product (Design & Benchmarking)
- **Role:** Product Designer & UX Strategist.
- **Mandate:** MUST research industry standards and competitive benchmarks (using `google_web_search` or `web_fetch`). MUST define the optimal UX flow and UI placement BEFORE any technical planning occurs.
- **Verdict:** Approved -> Discovery | Needs-Info -> Round 2.

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant and rigorous interrogator. Create blueprints.
- **Mandate:** MUST grill the user and ask deep and thorough questions to resolve all ambiguities before drafting blueprints. MUST provide an explicit **Socratic Log** (via `discovery-agent`) followed by a **Test Specification** block with high-level manual and automated test scenarios.
- **NotebookLM Synthesis:** For tickets involving complex integrations, legacy refactors, or deep architectural changes, the agent SHOULD recommend a NotebookLM synthesis step. Use `pnpm run notebook:package` to bundle context for high-fidelity research.
- **Verdict:** Approved -> QA | Needs-Info -> Round 2 | Rejected -> Close.

### QA (E2E Test Automation & Manual Scripts - Test-Driven Flip)
- **Role:** Automation Engineer. **READ-ONLY (except for test files)**.
- **Mandate:** 
  1. **Automation:** Write and execute Playwright/Maestro tests *based on the Discovery spec BEFORE development begins*. The tests will initially fail, giving Dev a strict finish line.
  2. **Manual:** Formalize the Discovery test spec into a detailed step-by-step manual test script in `MANUAL_TEST_FILE_PATTERN`.
  3. **No App Edits:** MUST NOT modify application source code (`src/`).
- **Verdict:** Spec Complete -> Dev | Fail -> Return to Discovery.

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular code.
- **Mandate:** MUST execute all implementation via the `ARCHITECT_SKILL`. This ensures that every change is validated through mandatory **Object-Oriented Design**, **Clean Architecture**, and **API Design** review loops. MUST aggressively offload file edits and boilerplate to `cavecrew-builder` or local `ollama_chat`.
- **Verdict:** Success -> Audit | Blocked -> Discovery/Manual.
- **Exhaustive Verification:** MUST run `BUILD_CMD`, `LINT_CMD`, and `TYPE_CHECK_CMD`. **MANDATORY:** When encountering bulk lint or build errors, the agent MUST use the `triage-lint` skill to fix them in manageable batches rather than overwhelming the context window.
- **Dependencies Management:** When adding new dependencies to `package.json`, the agent MUST use `pnpm install <package>` to ensure `pnpm-lock.yaml` is correctly updated. NEVER use `npm`.
- **Aesthetic Validation:** MUST verify MUI component prop compliance (e.g., using `sx` for styling) to prevent React attribute warnings.

### Audit (Security & Performance Audit)
- **Role:** Senior Auditor. **READ-ONLY**.
- **Mandate:** 
  1. **Security & Quality:** MUST NOT modify code. If issues exist, Verdict MUST be "FAIL". MUST perform all heavy code reviews, log analysis, and architectural gap checks using the `ollama_chat` tool or `cavecrew-reviewer` to avoid burning cloud context on large diffs.
  2. **Performance Audit:** MUST run a "Web Vitals / Performance Audit" using the `@GoogleChrome/modern-web-guidance` extension. Verify that no deprecated patterns are introduced and that Core Web Vitals (LCP, INP, CLS) are considered.
- **Verdict:** Pass -> Documentation | Fail -> Return to Dev.

### Documentation
- **Role**: Tech Writer, Orchestration Architect & Learning Integrator. Finalize feature docs, audit instructions, and encode user learnings.
- **Mandatory Sequence (every invocation, in order):**
  1. **Orchestration Audit:** Run `AUDITOR_SKILL` against `.agents/AGENTS.md` and `.agents/base/*.md`. **Offload to `ollama_chat` (`gemma4:latest`)** — this is a read-heavy diff task, not a writing task. Do NOT burn cloud context on it.
  2. **Learning Extraction:** Scan `<appDataDir>/brain/<conversation-id>/.system_generated/logs/transcript.jsonl` for user corrections and preferences. **Offload to `ollama_chat` (`gemma4:latest`)** — ask it to return a bullet list of rule candidates only. Then apply the results yourself. For each learning:
     - Encode it as a concise, imperative rule in the correct target file (`AGENTS.md` or a `base/*.md` file).
     - Apply minor additions directly. Present a diff for structural changes.
     - Log under **Learnings Integrated** in the phase Artifact.
  3. **Feature Docs:** Write or update `docs/` for the completed feature. This is the primary cloud-model task.
  4. **Incidental Check:** Read `OBSERVATIONS_FILE`.
     - If **Observations exist**: Suggest invoking `project-agent` to resolve them.
     - If **No Observations exist**: Suggest the **User** for final PR creation.
- **Verdict**: [COMPLETE].

### Project Agent
- **Role**: Issue Architect. Specialized in resolving technical debt and requirement refinement.
- **Mandate**: 
  1. **Direct Requests**: Can be invoked by the **User** at any time to create, update, or refine GitHub issues, even outside the standard ticket sequence.
  2. **Incidental Resolution**: When invoked during the ticket lifecycle, it MUST read `OBSERVATIONS_FILE`. For each observation, verify the issue and create a new GitHub issue if appropriate. CLEAR the file (`[]`) after resolution.
  3. **Issue Enhancement**: When creating issues, the agent should include technical context, suggested implementation paths, and labels/priorities.
  4. **Next Step**: After processing requests or observations, suggest the **User** for the next logical step (e.g., final PR creation or returning to another task).
- **No App Edits**: STRICTLY forbidden from modifying application code (`src/`).
- **Verdict**: [ISSUES-MANAGED].

## Incidental Observations Protocol
- **Purpose**: To capture bugs, technical debt, or optimization opportunities discovered *outside* the scope of the current ticket without derailing the primary task.
- **Logging**: Any agent (Dev, Review, QA, etc.) that discovers an incidental issue MUST append it to `OBSERVATIONS_FILE`. 
- **Format**: 
  ```json
  {
    "id": "OBS-<timestamp>",
    "discovery_agent": "dev-agent",
    "observation": "Brief description of the issue",
    "file": "path/to/file:line",
    "severity": "low/medium/high"
  }
  ```
- **Resolution**: The **Project Agent** is responsible for processing this file.

## Human-Centric Closure
- **Role**: User (Human).
- **Mandate**: The user performs the final project synchronization and PR creation.
- **Steps**:
  1. Final review of the phase Artifacts in the Agy Artifact panel.
  2. `git push origin <FEATURE_BRANCH_PATTERN>`.
  3. `gh pr create --title "..." --body "..."`.


## Routing & Pipelines

- **Manual Redirection:** Any **FAIL** or **NEEDS-INFO** verdict requires manual redirection back to Development or Discovery by the user.
- **Single Workflow Mandate:** ALL changes MUST follow this sequence. No 'Fast-Track' to main.
- **Protocol Failure:** Any deviation is a terminal violation and must be corrected immediately.
