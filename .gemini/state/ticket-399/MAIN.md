# Ticket 399: Add Support / Help Link

**Status:** IN_PROGRESS (QA Phase)

## Technical Specifications

- **Sidebar:** Modify `src/components/layout/Sidebar.tsx` to add a "Support" menu item linking to `/settings?tab=support` using a `HelpOutlineIcon`.
- **Settings Tabs:** Modify `src/components/settings/SettingsTabs.tsx` to include a new "Support" tab.
- **Settings Content:** Update `src/app/settings/SettingsContent.tsx` to conditionally render a new `<SupportTab />` component.
- **Support Component:** Create `src/components/settings/SupportTab.tsx` using MUI components (GlassCard, Typography, Button). It will feature a "Contact Us" button with `href="mailto:support@socialstudio.app"` (User has chosen Zoho Mail to host this inbox) and a placeholder section for "Help & FAQ".

## Test Specifications

- Verify Sidebar navigation to the Support tab.
- Verify the Support tab renders correctly with the `mailto:` link.
- Verify direct navigation to `/settings?tab=support` selects the correct tab.
# 📅 Timeline
- **[2026-06-01 18:16:12]**: DEV [SUCCESS] - Added Support tab in Settings and Sidebar linking to /settings?tab=support. Created SupportTab.tsx with mailto:support@socialstudio.app link and FAQ placeholders. Verified with build and lint.
- **[2026-06-01 18:20:23]**: REVIEW [PASS] - Audit Report:
- Hydration Check: Passed. No browser-only APIs (localStorage, window, etc.) are accessed outside of useEffect.
- Security Check: Passed. No external untrusted data used. The 'mailto:' link is a safe, hardcoded constant. No vulnerabilities found in SupportTab.tsx or related navigational setups.
- Performance Check: Passed. Minimal added bundle size. Basic MUI components are used cleanly. Does not impact LCP/INP.
- Style Check: Passed. Adheres to UI_UX.md. Uses GlassCard, typography, and standard MUI icons. No inline emojis. Follows the 100-Line rule.
- Verification: Build successfully compiled. Lint passed with 0 errors (existing warnings are unrelated).

All technical specifications for Ticket 399 are met.
- **[2026-06-01 18:27:38]**: QA [PASS] - **VERDICT:** PASS
**TEST SCENARIOS COVERED:**
- Verify Support link in sidebar for desktop and mobile views.
- Verify navigation to /settings?tab=support correctly functions.
- Verify Support tab content, specifically 'Support & Help' title.
- Verify 'Email Support' button has the correct mailto: href.
- Verify the presence of Frequently Asked Questions in the tab content.
**FAILED TESTS:** None
