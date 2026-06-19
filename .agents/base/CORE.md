# Core Technical Standards

## Project Architecture & Conventions
- **Next.js 15 & React 19:** Follow strict rules in `.agents/AI_RULES.md`.
- **Zero-Any Policy:** Strict TypeScript enforcement across the entire codebase. Use `unknown` or explicit interfaces for dynamic data.
## Centralized Schemas
- All validation logic MUST reside in `src/lib/schemas`. Reuse these schemas for both Route Handlers and Server Actions.

## Centralized Application Constants (Source of Truth)
- **Hardcoding Policy:** AI agents MUST NOT hardcode application strings (Brand name, tagline, URLs) or operational identifiers (Emails, App IDs, User Agents).
- **Brand & UI:** Use the `BRAND` object from `src/lib/core/brand.ts` for all branding text.
- **Communication:** Use the `CONTACT_EMAILS` object from `src/lib/core/emails.ts` for support, legal, and privacy links.
- **Technical Config:** Use `APP_CONFIG` from `src/lib/core/config.ts` and `PLATFORMS` from `src/lib/core/constants.ts` for technical identifiers and limits.
- **Enforcement:** Reviewers (arxitect) MUST flag hardcoded app-level strings as violations.

## API Documentation (Swagger)

## Global Architectural Standards
- **Modularity Enforcement (The 100-Line Rule):**
    - **Enforcement:** Automated via ESLint `max-lines` (error severity).
    - **Configuration:** `["error", { "max": 100, "skipBlankLines": true, "skipComments": true }]`.
    - **New Files:** MUST be ≤ 100 lines. ESLint will block builds if this is violated.
    - **Legacy Files (> 100 lines):** Grandfathered via `/* eslint-disable max-lines */`.
    - **Debt Reduction Protocol:** Any interaction with a legacy file MUST include logic extraction into new, compliant modules. Do not remove the disable flag until the file is < 100 lines.
    - **Tests:** `src/__tests__/**` is exempt from the 100-line rule.

## Technical & TSX Standards
- **Component Composition:** Prefer composition over deep prop-drilling. Use React Context or state management (Zustand) when sharing data across non-adjacent components.
- **Immutability:** Treat all state and props as immutable. Use functional updates (`setState(prev => ...)`) and array methods like `map`, `filter`, and `reduce` instead of mutations.
- **Type Safety:** Handle `null`/`undefined` explicitly using optional chaining (`?.`) or type guards.
- **Hydration Integrity:** NEVER initialize state from `localStorage`, `window`, or other browser-only APIs in the `useState` initializer. To prevent SSR hydration mismatches, always initialize with a default value and use `useEffect` to load data from browser storage after the initial mount.
- **Functional Purity:** Keep components "pure". Extract business logic into custom hooks (`src/hooks/`) to separate side effects from rendering.
- **Naming Conventions:**
  - **Components:** PascalCase (e.g., `UploadHud.tsx`).
  - **Hooks:** camelCase starting with `use` (e.g., `useUploadStatus.ts`).
  - **Utilities:** camelCase (e.g., `formatCurrency.ts`).
- **Resource Management:** Always clean up side effects in `useEffect` return functions.
- **API/Action Safety:** Use `try-catch` for all async operations; log via Sentry; handle gracefully in UI.
