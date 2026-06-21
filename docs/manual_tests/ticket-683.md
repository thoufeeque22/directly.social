# Manual Test Script: System Status Dashboard (Ticket #683)

## Overview
Verify the UI layout, responsiveness, theme-awareness, and accessibility (A11y) of the new System Status dashboard page.

## Prerequisites
1. Run the local development server: `pnpm run dev`.
2. Open the browser and navigate to `http://localhost:3000`.
3. If necessary, log in to access the authenticated layouts.

---

## Test Scenarios

### Scenario 1: Responsive Grid Layout & Wrapping
1. Navigate to the System Status page at `/status`.
2. Open Chrome DevTools and toggle the device toolbar.
3. **Mobile Viewport (375px)**:
   - Set the viewport width to `375px`.
   - Verify that the layout stacks vertically into a single column.
   - Ensure the hero banner, service list, performance uptime metrics, and past incidents are fully readable without horizontal scrolling.
4. **Tablet Viewport (768px)**:
   - Set the viewport width to `768px`.
   - Verify that the elements wrap and stack cleanly.
   - Ensure no components overlap or have truncated text.
5. **Desktop Viewport (1200px)**:
   - Set the viewport width to `1200px` or wider.
   - Verify the page displays a split-column layout:
     - Main content (8 columns): System status hero, core platform services, external integration APIs, and past incidents timeline.
     - Sidebar (4 columns): Performance uptime metrics and scheduled maintenance panels.

### Scenario 2: Light/Dark Theme Switching & Contrast
1. Navigate to the System Status page at `/status`.
2. Use the application's theme toggle (typically in the header/nav) to switch from **Dark Mode** to **Light Mode**.
3. Verify that:
   - Card background colors, text colors, and borders adjust dynamically to match the light theme.
   - Contrast ratios for text on status indicator cards (e.g., green, yellow, red backgrounds) remain high and WCAG AA/AAA compliant.
4. Switch back to **Dark Mode**.
5. Verify that:
   - Backgrounds transition back to premium dark tones.
   - Text remains clear, readable, and is not hidden by hardcoded colors.
   - Status icons (CheckCircleIcon, WarningIcon, ErrorIcon, BuildIcon) display correct theme-aware colors without being washed out.

### Scenario 3: Accessibility (A11y) Keyboard Focus & Screen Reader Attributes
1. Navigate to `/status`.
2. Do not use the mouse. Use the `Tab` key to navigate the page.
3. Verify that:
   - Focus outline is clearly visible on the interactive elements (e.g. the manual "Refresh" button, accordion headers).
   - Pressing `Space` or `Enter` while focused on the "Refresh" button triggers the status refresh behavior.
4. Right-click the "System Status" hero banner or page title and select **Inspect**.
5. Verify that:
   - The status updates text wrapper has `aria-live="polite"` and `aria-atomic="true"` attributes so that screen readers announce updates when status refreshes.
6. Use the `Tab` key to focus on the Tooltip helper icon next to the "External APIs" section.
7. Verify that:
   - The tooltip helper text (e.g. describing BetterStack monitoring API) becomes visible upon keyboard focus or hover, and remains visible while focused.
