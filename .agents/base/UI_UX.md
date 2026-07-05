# UI & Aesthetic Standards

## Aesthetic Principles
- **Creator Studio Aesthetic:** The app MUST feel like a warm, empathetic "Creator Studio" rather than a clinical "AI SaaS" tool. 
  - **Avoid Generic AI Tropes:** STRICTLY FORBID harsh neon colors (e.g., deep neon purples/blues), aggressive glassmorphism, and clinical radial "aura" glows. 
  - **Embrace Warmth:** Use warmer, earthy tones (like terracotta, warm amber, soft sage), organic design elements, softer shadows, and human-centric copy.
- **Material UI Aesthetic:** Prioritize a "humanly", professional, and polished UI design using Material UI (MUI).
- **Theme Awareness (Light/Dark/System):** STRICTLY PROHIBIT hardcoded color values (e.g., `white`, `#FFFFFF`, `black`). Always use theme-aware HSL variables (e.g., `hsl(var(--foreground))`, `hsl(var(--primary-foreground))`) defined in the global theme.
- **Human-Centric Design:** Focus on accessibility (A11y), clean spacing, clear visual hierarchy, and intuitive user flows. Verify all UI changes for contrast and visibility in both Light and Dark modes.
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

## Brand Identity

- **Full Brand Name:** `directly.social` (lowercase, with the dot). This is the primary brand identity and MUST be used in all user-facing UI (headers, footers, meta tags, marketing copy).
- **NEVER shorten to just "Directly"** — the word is a common English adverb and loses all brand recognition without `.social`.

- **Social Handles:** `@directlysocial` (no dot, no spaces).
- **Alt Text / SEO:** Always include the full form `directly.social` in page titles, Open Graph tags, and meta descriptions.
- **Logo Usage:** The logo must always render the full `directly.social` wordmark. Icon-only variants (e.g., favicons) may use the "d.s" monogram but never the word "Directly" alone.
