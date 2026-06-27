<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Global Management Policies

> **Primary rules file for Agy (Antigravity).** `GEMINI.md` at the repo root is deprecated and no longer authoritative — these rules take precedence.

- **Phase Throttling (Human-in-the-Loop):** The Orchestrator MUST terminate its turn after calling exactly one sub-agent. NEVER chain sub-agents autonomously. ALL phase transitions (per `PHASE_ORDER` in [VARIABLES.md](base/VARIABLES.md)) MUST be approved by the user.
- **Artifact-First Protocol (replaces State-First):** Before invoking any sub-agent or performing any action, the Orchestrator MUST create or update an Artifact using Agy's native `write_to_file` tool into `<appDataDir>/brain/<conversation-id>/`. Do NOT write state to `.agents/state/ticket-<id>/` — that path is obsolete.
- **Ticket Initialization / Initialization Precedence:** Before starting work on a new ticket/task, strictly follow this orchestration:
  1. Checkout main (`git checkout main`)
  2. Pull latest changes (`git pull`)
  3. Create a new branch for the ticket (`git checkout -b <branch_name>`)
  4. Start working
  Every new ticket MUST also follow the workflow defined in [ORCHESTRATION.md](base/ORCHESTRATION.md).
- **Explicit Commit Permission & Auto-Handoff:** AI agents MUST NOT commit changes without user permission, EXCEPT during phase handoffs. As defined in [ORCHESTRATION.md](base/ORCHESTRATION.md), the Orchestrator automatically checkpoints changes upon handoff approval.
- **Strict Phase Guardrails (Test-Driven Transition):** The Orchestrator MUST NOT transition from the `Discovery` phase directly to the `Development` phase. Even when a technical blueprint is approved, the Orchestrator MUST force a stop to generate the automated E2E test scripts (`.spec.ts`) and manual test document in the `QA` phase FIRST. Writing application code (`src/`) before generating QA artifacts is a terminal violation.
- **Verification Integrity:** Local verification MUST be exhaustive (e.g., `pnpm run build`, `pnpm run lint`). NEVER use 'surgical' or 'token-optimized' checks unless explicitly instructed by the user.
- **Technical Excellence:** ALL code MUST adhere to the standards in [CORE.md](base/CORE.md). **MANDATORY:** Invoke the `arxitect:architect` skill for ALL new feature implementations and refactors.
- **Aesthetic Integrity:** ALL UI MUST adhere to the standards in [UI_UX.md](base/UI_UX.md) (MUI, Theme Awareness, No Emojis).
- **Manual Environment Management:** The User manages the dev server, the E2E test server (http://localhost:3000), and tunnels manually. Agents MUST NOT interfere.
- **Context Preservation:** Agents must never destructively overwrite artifact files.

## Standards Reference

1. **[Core Technical Standards](base/CORE.md)** — TypeScript Zero-Any, Next.js 15, 100-Line Modularity
2. **[UI & Aesthetic Standards](base/UI_UX.md)** — MUI, Theme Awareness, A11y, No Emojis
3. **[Production & Infrastructure](base/PRODUCTION.md)** — Performance, Security, Neon DB
4. **[Agent Orchestration & Workflow](base/ORCHESTRATION.md)** — Phase Sequence, Failure Protocols
5. **[Global Variables & Constants](base/VARIABLES.md)** — Branching, commands, skill names

*Agents MUST read the relevant base files before starting any task.*

---

# Strict AI Coding Guidelines & Rules

To ensure production-level stability and prevent build failures or linting warnings, ALL AI agents modifying this codebase MUST strictly adhere to the following rules:

### 1. TypeScript Strictness (Zero Tolerance for `any`)
- **NEVER use the `any` type.** There are zero exceptions.
- When parsing external data (API responses, JSON), use `unknown` and validate the shape or cast it explicitly to a defined interface/type.
- Inside `catch` blocks, always use `catch (error: unknown)`. Narrow it down before accessing properties: `const message = error instanceof Error ? error.message : String(error);`.
- Avoid arbitrary type assertions (`as Type`) unless absolutely necessary, and never chain `as unknown as Type` unless interacting with deeply incompatible external libraries.

### 2. Modern React & Next.js Conventions
- **React 19 / Next.js 15 Forms:** Use `action={...}` passing `FormData` instead of the legacy `onSubmit={...}` paired with `React.FormEvent`.
- **Client/Server boundaries:** Ensure `'use client'` is only used when hooks (`useState`, `useEffect`) or browser APIs are required.
- **Hydration & Storage:** Do not use `window` for global variables; use `globalThis` instead. **NEVER** read from `localStorage` or `sessionStorage` in a `useState` initializer or directly in the component body during render. Always use a `useEffect` hook to synchronize state with browser storage after the initial client-side mount to avoid SSR hydration mismatches.
- **Middleware Naming:** Since Next.js 16, the middleware file convention has changed. Always name the Next.js middleware file exactly `proxy.ts` inside the `src/` directory (or root). Do NOT name it `middleware.ts` (it is deprecated) and ensure the middleware logic is Edge-compatible (e.g., use `auth.config.ts` for NextAuth, do not import Prisma).


### 3. Strict Accessibility (A11y) Compliance
- Follow `eslint-plugin-jsx-a11y` rules flawlessly.
- **Labels:** Every `<input>` MUST have a corresponding `<label>` either wrapping it or linked via `htmlFor`/`id`.
- **Interactive Elements:** Do NOT add `onClick` handlers to non-interactive elements like `<div>` or `<span>`. Use semantic `<button>` tags. 
- If a custom wrapper element is absolutely necessary for styling over an input, prefer using a `<label>` as the wrapper so clicks automatically focus the input natively without needing `(input as HTMLInputElement).showPicker()`.

### 4. Code Quality & Cleanliness
- **No nested ternaries.** Avoid code like `condition1 ? result1 : condition2 ? result2 : result3`. Extract this into a mapping object (`Record<string, string>`) or a dedicated helper function.
- **Optional Chaining:** Prefer `obj?.prop?.sub` over verbose checks like `if (obj && obj.prop && obj.prop.sub)`.
- Use standard JS/TS features: `Array.prototype.some/every` instead of complex `reduce` loops, and `Date.now()` instead of `new Date().getTime()`.
- Avoid cognitive complexity: if a function exceeds 15 lines of dense logic, break it down into smaller helper functions.

### 5. Transient & State Files
- **Strictly No Transient Files in `.agents/`:** NEVER write `BRIEFING.md`, `progress.md`, `handoff.md`, `ORIGINAL_REQUEST.md`, or any other temporary orchestration state files to `.agents/` or its subdirectories. `.agents/state/ticket-*/` is **obsolete** — do NOT create new directories there.
- **Target Directory:** All phase artifacts and transient files MUST be written using Agy's native `write_to_file` tool to `<appDataDir>/brain/<conversation-id>/` (artifacts) or `<appDataDir>/brain/<conversation-id>/scratch/` (scratch files). These paths are injected into your context — use them directly.

### 6. Code Refactoring & Cleanup Hazards
- **Stale Imports/Variables:** When deleting or relocating UI components, always double-check for unused imports (e.g., `Image` from `next/image`) and orphaned props. `@typescript-eslint/no-unused-vars` will fail the build if these are left behind.
- **Type Casting & "Zero-Any" strictness:** Never lazily cast to `any` to bypass complex type errors (such as third-party SDK namespace collisions like `Stripe.Subscription`). Instead, use precise intersections (e.g., `as unknown as { id: string }`) or exact typing.
- **MUI Component Typings:** When using MUI components (like `<Typography>`), ensure you are using valid props (e.g., `sx={{ fontWeight: 'bold' }}`). Do not pass invalid HTML/CSS props directly unless explicitly supported, as it will trigger strict TypeScript React typings errors (`IntrinsicAttributes & ...`).
- **Callback `this` Context:** In test files (like `vi.fn(function(this: unknown) { ... })`), explicitly type `this` instead of letting it default to `any`, which violates the strict config.
