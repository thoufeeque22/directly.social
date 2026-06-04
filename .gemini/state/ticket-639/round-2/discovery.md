
## [2026-06-04 14:37:21] Verdict: NECESSARY
Full Discovery complete for Ticket #639. Technical path for below-the-fold expansion defined with HSL theme-awareness and responsive grid footer.

## [2026-06-04 16:15:24] Verdict: NECESSARY
### SOCRATIC_LOG

1. Feasibility Analysis:
- Dashboard Preview: Highly feasible using MUI Box/Skeleton and custom CSS. We can mimic the Activity Hub's ActivityCard and PreparationBar without real data fetching.
- FAQ Accordion: MUI's Accordion component is the standard choice. We will apply glassmorphism styles (backdrop-filter, hsla borders) via sx props to maintain aesthetic consistency.
- Pulse Effect: A simple keyframes animation in globals.css will handle the 'Live' indicators.
- Brand Glows: Using CSS filter: drop-shadow or box-shadow with brand-specific HSL colors for integration pills.

2. Strategic Alignment:
- These components reinforce 'Trust as a Service' (TaaS) by showing the actual interface and technical transparency (BYOS) before the user authenticates.

3. Architectural Integrity:
- We will continue the pattern of modular components in src/components/login/ and shared styles in LoginComponents.module.css.

---

### TECHNICAL SPECS

1. DashboardMockup Component (src/components/login/DashboardMockup.tsx)
- Container: Glassmorphism frame with a 'browser' top bar.
- Header: Mock 'Activity Hub' title with a 'Storage: R2 Connected' badge.
- Content: Single Mock Card with 'Published' state across YouTube, TikTok, and Instagram.

2. WorkflowSection Component (src/components/login/WorkflowSection.tsx)
- Layout: 3-step grid (Connect -> Compose -> Publish).
- Icons: StorageIcon, AutoAwesomeIcon, RocketLaunchIcon.

3. FAQSection Component (src/components/login/FAQSection.tsx)
- Component: MUI Accordion with glass styles.
- Content: Focus on Security, Data Ownership, and APIs.

4. Global & Local CSS
- src/app/globals.css: Define heartbeat animation and animate-heartbeat utility.
- src/components/login/LoginComponents.module.css: Styles for mockup, workflow, and brand glows.

---

### TEST SPECIFICATION

1. Happy Path
- Verify mockup, workflow, and FAQ render correctly.
- Verify accordion interactivity.

2. Edge Cases
- Mobile responsiveness (vertical stacking).
- Light/Dark mode accessibility for brand glows.

3. Negative Scenarios
- Ensure no layout shift (CLS) for the mockup container.
