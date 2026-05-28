# Core Technical Standards

## Project Architecture & Conventions
- **Next.js 15 & React 19:** Follow strict rules in `.gemini/AI_RULES.md`.
- **Zero-Any Policy:** Strict TypeScript enforcement.

## Technical & TSX Standards
- **Component Composition:** Prefer composition over deep prop-drilling. Use React Context or state management (Zustand) when sharing data across non-adjacent components.
- **Immutability:** Treat all state and props as immutable. Use functional updates (`setState(prev => ...)`) and array methods like `map`, `filter`, and `reduce` instead of mutations (`push`, `splice`).
- **Type Safety:** 
  - **No `any`:** Strict enforcement. Use `unknown` or defined interfaces/types if the type is truly dynamic.
  - **Strict Null Checks:** Handle `null`/`undefined` explicitly using optional chaining (`?.`) or type guards.
- **Functional Purity:** Keep components "pure". Extract business logic into custom hooks (`src/hooks/`) to separate side effects from rendering.
- **Centralized Validation:** 
  - **Schemas:** All Zod schemas MUST be stored in `src/lib/schemas/*.ts`.
  - **Shared Logic:** Reuse these schemas for both Route Handlers and Server Actions to ensure parity.
- **API Documentation:**
  - **Swagger/OpenAPI:** Every Route Handler (`app/api/.../route.ts`) MUST be documented in the centralized OpenAPI registry.
  - **Verification:** Ensure the documentation is accessible at `/api/docs`.
- **Naming Conventions:**
  - **Components:** PascalCase (e.g., `UploadHud.tsx`).
  - **Hooks:** camelCase starting with `use` (e.g., `useUploadStatus.ts`).
  - **Utilities:** camelCase (e.g., `formatCurrency.ts`).
- **Accessibility (A11y):** All interactive elements must have appropriate ARIA labels and roles. Ensure keyboard navigability.
- **Resource Management:** Always clean up side effects (event listeners, timers, subscriptions) in `useEffect` return functions.
- **API/Action Safety:** Validate incoming data with Zod schemas. Use `try-catch` for all async operations; log via Sentry; handle gracefully in UI.

## Global Architectural Standards
- **Modularity Enforcement (The 50-Line Rule):**
    - **Enforcement:** Automated via ESLint `max-lines` (error severity).
    - **Configuration:** `["error", { "max": 50, "skipBlankLines": true, "skipComments": true }]`.
    - **New Files:** MUST be ≤ 50 lines. ESLint will block builds if this is violated.
    - **Legacy Files (> 50 lines):** Grandfathered via `/* eslint-disable max-lines */`.
    - **Debt Reduction:** Any interaction with a legacy file MUST include logic extraction into new, compliant modules. Do not remove the disable flag until the file is < 50 lines.
    - **Tests:** `src/__tests__/**` is exempt from the 50-line rule to allow for comprehensive test suites.

- **Legacy Debt Remediation Protocol:**
    - Files > 50 lines are classified as "Legacy".
    - All new features/fixes in legacy files MUST extract logic into new modules ≤ 50 lines.
    - **Mandatory Debt Reduction:** Every pull request touching a legacy file MUST include at least one extraction/refactor task (e.g., extracting a `use...` hook, utility, or sub-component).
    - **Debt Tracking:** Large legacy files must be registered in `docs/ARCHITECTURE.md` with an assigned "debt priority" (Critical/High/Medium).
