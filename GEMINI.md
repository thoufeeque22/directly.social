# Social Studio App: Agent Instructions & Standards

This document serves as the root entry point for all AI agents. It defines the global mandates and links to domain-specific standards.

## Global Mandates

- **Orchestration Protocol Compliance:** The workflow defined in `.gemini/base/ORCHESTRATION.md` is **NON-NEGOTIABLE**. Skipping branch creation (`feature/<id>`), `main` synchronization, state file initialization, or per-agent commits is a terminal failure.
- **Verification Integrity:** Local verification MUST be exhaustive (e.g., `npm run build`, `npm run lint`). NEVER use 'surgical' or 'token-optimized' checks unless explicitly instructed by the user.
- **Single Workflow Enforcement:** Every task MUST involve the full chain of agents (Discovery, Development, Review, QA, Documentation, Project) as defined in the standard sequence.
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
