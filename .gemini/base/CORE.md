# Core Technical Standards

## Project Architecture & Conventions
- **Next.js 15 & React 19:** Follow strict rules in `AGENTS.md`.
- **Zero-Any Policy:** Strict TypeScript enforcement.

## Technical & TSX Standards
- **Component Composition:** Prefer composition over deep prop-drilling. Use React Context or state management (Zustand) when sharing data across non-adjacent components.
- **Immutability:** Treat all state and props as immutable. Use functional updates (`setState(prev => ...)`) and array methods like `map`, `filter`, and `reduce` instead of mutations (`push`, `splice`).
- **Type Safety:** 
  - **No `any`:** Strict enforcement. Use `unknown` or defined interfaces/types if the type is truly dynamic.
  - **Strict Null Checks:** Handle `null`/`undefined` explicitly using optional chaining (`?.`) or type guards.
- **Functional Purity:** Keep components "pure". Extract business logic into custom hooks (`src/hooks/`) to separate side effects from rendering.
- **Naming Conventions:**
  - **Components:** PascalCase (e.g., `UploadHud.tsx`).
  - **Hooks:** camelCase starting with `use` (e.g., `useUploadStatus.ts`).
  - **Utilities:** camelCase (e.g., `formatCurrency.ts`).
- **Accessibility (A11y):** All interactive elements must have appropriate ARIA labels and roles. Ensure keyboard navigability.
- **Resource Management:** Always clean up side effects (event listeners, timers, subscriptions) in `useEffect` return functions.
- **API/Action Safety:** Validate incoming data with Zod schemas. Use `try-catch` for all async operations; log via Sentry; handle gracefully in UI.

## Global Architectural Standards
- **Modularity Enforcement (The 50-Line Rule):**
    - **New Files:** MUST be ≤ 50 lines.
    - **Legacy Files (> 50 lines):** Any new logic MUST be extracted into a new module. Do not add code to the existing monolith.
    - **Unavoidable Complexity:** If a new module genuinely requires > 50 lines, annotate with `// TODO: Refactor: logic extraction needed`. Keep it ≤ 100 lines and log in `.gemini/incidental_observations.json` with `category: "meta"` and `severity: "MED"`.
    - **Enforcement:** Review-agent performs a mandatory architectural audit during the handoff phase (prior to QA/E2E). It MUST reject any handoff that fails these standards and assign the task back to dev-agent for correction.

- **Legacy Debt Remediation Protocol:**
    - Files > 50 lines are classified as "Legacy".
    - All new features/fixes in legacy files MUST extract logic into new modules ≤ 50 lines.
    - **Mandatory Debt Reduction:** Every pull request touching a legacy file MUST include at least one extraction/refactor task (e.g., extracting a `use...` hook, utility, or sub-component).
    - **Debt Tracking:** Large legacy files must be registered in `docs/ARCHITECTURE.md` with an assigned "debt priority" (Critical/High/Medium).
