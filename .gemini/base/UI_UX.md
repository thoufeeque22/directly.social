# UI & Aesthetic Standards

## Aesthetic Principles
- **Material UI Aesthetic:** Prioritize a "humanly", professional, and polished UI design using Material UI (MUI).
- **Theme Awareness (Light/Dark/System):** Do NOT use hardcoded colors. Always use semantic CSS variables (e.g., `var(--background)`, `var(--text-primary)`) to ensure consistency across modes.
- **Human-Centric Design:** Focus on accessibility (A11y), clean spacing, clear visual hierarchy, and intuitive user flows.
- **Strict "No Emojis" Policy:** Emojis are strictly FORBIDDEN in user-facing UI components, labels, and buttons. Use MUI Icons instead. Emojis are only permitted in backend logs, CLI output, and internal documentation.

## Visual Components
- **Icons:** Exclusively use **Material UI Icons** (MUI). Avoid generic libraries unless MUI lacks a specific icon.
- **Visual Integrity Mandate:** All UI changes MUST be verified for contrast, visibility, and spacing. QA-agent MUST include specific tests for critical control visibility.

## Modular Form Standards

Forms exceeding 3 sections or 100 lines of total logic MUST be refactored into a **Modular Engine** pattern:

1.  **Context-First State:** Use React Context (Provider/Consumer) for all shared form state to eliminate prop-drilling.
2.  **Strict Modularity:** Components must adhere to the 100-line rule. Extract sub-sections into atomic components (e.g., `FieldGroup.tsx`, `FormActions.tsx`).
3.  **Pure Entry Points:** The main `index.tsx` should only contain the Provider wrap and the high-level layout component.
4.  **Logic Separation:** Extract business logic, media processing, and validation into specialized custom hooks (prefixed with `use`).
5.  **Types & Utils:** Keep context types and utility functions in separate `.types.ts` and `.utils.ts` files within the component directory.
