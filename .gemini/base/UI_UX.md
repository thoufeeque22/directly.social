# UI & Aesthetic Standards

- **Material UI Aesthetic:** Prioritize a "humanly", professional, and polished UI design.
- **Theme Awareness (Light/Dark/System):** Do not use hardcoded colors (e.g., `#0A0A0A`, `#1A1A1A`) for UI components. Always use semantic CSS variables (e.g., `var(--background)`, `var(--card)`, `var(--text-primary)`) to ensure consistent visual presentation across Light and Dark modes.
- **Icons:** Exclusively use **Material UI Icons** (MUI). Avoid generic icon libraries unless MUI lacks a specific icon.
- **No Emojis in UI:** Strictly forbid the use of emojis in user-facing UI components, labels, and buttons (use MUI Icons instead). Emojis ARE permitted in backend server logs, CLI output, and internal markdown documentation to aid visual scanning.
- **Human-Centric Design:** Focus on accessibility, clean spacing, clear visual hierarchy, and intuitive user flows.
- **Visual Integrity Mandate:** All UI changes MUST be verified not just for functional logic, but for visual accessibility (contrast, visibility, spacing). QA-agent MUST include specific Playwright tests that check for the visibility of critical controls (e.g., navigation arrows, labels).

## Modular Form Standards

Forms exceeding 3 sections or 100 lines of total logic MUST be refactored into a **Modular Engine** pattern:

1.  **Context-First State:** Use React Context (Provider/Consumer) for all shared form state to eliminate prop-drilling.
2.  **Strict Modularity:** Components must adhere to the 50-line rule. Extract sub-sections into atomic components (e.g., `FieldGroup.tsx`, `FormActions.tsx`).
3.  **Pure Entry Points:** The main `index.tsx` should only contain the Provider wrap and the high-level layout component.
4.  **Logic Separation:** Extract business logic, media processing, and validation into specialized custom hooks (prefixed with `use`).
5.  **Types & Utils:** Keep context types and utility functions in separate `.types.ts` and `.utils.ts` files within the component directory.
