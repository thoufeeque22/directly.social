# Social Studio App: Agent Instructions & Standards

This document serves as the root entry point for all AI agents. It defines the global mandates and links to domain-specific standards.

## Global Mandates

- **Phase Throttling (Human-in-the-Loop):** The Orchestrator MUST terminate its turn after calling exactly one sub-agent. NEVER chain sub-agents autonomously. ALL transitions between phases (`Discovery` -> `Dev` -> `Review` -> `QA` -> `Doc` -> `Project`) MUST be approved by the user. If any phase fails, the round stops immediately and recovery must begin in a new round (starting from `Development` for `Review`/`QA` failures).
- **State-First Protocol:** Before invoking any sub-agent or performing any action, the Orchestrator MUST create or update the Markdown state file in `.gemini/state/ticket-<id>/MAIN.md`.
- **Initialization Precedence:** Every new ticket MUST begin with: 
  1. `git checkout main && git pull`.
  2. `git checkout -b feature/<id>-<desc>`.
  3. Creation of the `.gemini/state/ticket-<id>/` directory and `MAIN.md` state file. 
  This sequence MUST complete before the first sub-agent is invoked.
- **Explicit Commit Permission:** AI agents MUST NEVER commit changes to the repository without explicit, per-commit permission from the user. Sub-agents (Dev, QA, Doc) ARE encouraged to commit their specific artifacts after successful verification and user approval, rather than waiting for the Project Agent. Before every commit, the agent MUST present a summary of changes and wait for user approval.
- **Verification Integrity:** Local verification MUST be exhaustive (e.g., `npm run build`, `npm run lint`). NEVER use 'surgical' or 'token-optimized' checks unless explicitly instructed by the user.
- **Zero-Any Policy:** Strict TypeScript enforcement across the entire codebase.
- **Modularity (50-Line Rule):** All source files must be ≤ 50 lines (automated via ESLint `max-lines`). Legacy files exceeding this limit must have `/* eslint-disable max-lines */` and be targeted for refactoring. Tests are exempt.
- **Centralized Schemas:** All validation logic MUST reside in `src/lib/schemas`.
- **API Documentation:** All Route Handlers MUST be documented at `/api/docs` (Swagger).
- **Human-Centric UI:** Prioritize accessibility, professional aesthetics (MUI), and no emojis.
- **Production Readiness:** Every feature must include robust error handling, security, and observability.
- **Context Preservation:** Agents must never destructively overwrite state files.

## Table of Contents

1.  **[Core Technical Standards](.gemini/base/CORE.md)**
    *   Next.js 15 & React 19 conventions.
    *   TypeScript strictness and TSX standards.
    *   Modularity and Legacy Debt Remediation.
2.  **[UI & Aesthetic Standards](.gemini/base/UI_UX.md)**
    *   Material UI (MUI) usage and Iconography.
    *   Accessibility (A11y) and Visual Integrity.
    *   Strict "No Emojis" policy.
3.  **[Production & Infrastructure](.gemini/base/PRODUCTION.md)**
    *   Performance, Security, and Observability.
    *   Neon Database branch management and cleanup.
4.  **[Agent Orchestration & Workflow](.gemini/base/ORCHESTRATION.md)**
    *   Ticket Initialization (git checkout main && git pull && check PRs).
    *   Mobile QA (Playwright Chrome/Safari emulation).
    *   Agent roles and specific workflows.
    *   Discovery Definition of Ready (DoR).
    *   Handoff protocols, State Pruning, and Pipeline routing.

---

*Agents MUST read the relevant base files before starting any task.*
