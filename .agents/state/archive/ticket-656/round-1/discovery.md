
## [2026-06-12 18:34:06] Verdict: NECESSARY
**SOCRATIC_LOG:**
- Identified critical logic flaw in LayoutWrapper.tsx where layout is hidden during session loading.
- Confirmed Footer is intentionally missing from App layout but recognized user's need for navigation links.
- Verified CSS clipping risk with 100dvh and inline height overrides.

**TECHNICAL SPECS:**
1. Refactor LayoutWrapper.tsx to show layout shell during 'loading' state for protected routes.
2. Replace inline height styles with flexbox rules (flex: 1) to prevent Header clipping.
3. Move Global Footer links (Privacy, Terms, Docs) into a Mini-Footer at the bottom of the Sidebar.

**TEST SPECIFICATION:**
- Verify Header visibility on first page load (authenticated).
- Verify Footer links presence in Sidebar.
- Verify 100dvh stability on mobile browsers.
