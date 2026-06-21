<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
- **Strictly No Transient Files in `.agents/`:** NEVER write `BRIEFING.md`, `progress.md`, `handoff.md`, `ORIGINAL_REQUEST.md`, or any other temporary orchestration state files to `.agents/` or its subdirectories. 
- **Target Directory:** All such transient files MUST be written strictly to the directory defined by `TRANSIENT_STATE_DIR` in `VARIABLES.md` (e.g., `TRANSIENT_STATE_DIR/BRIEFING.md`, `TRANSIENT_STATE_DIR/progress.md`).
