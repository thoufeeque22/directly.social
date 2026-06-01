# Ticket 399: Support Email

## Verdict
NECESSARY

## Socratic Log
1. **Feasibility:** Technically straightforward. Adding a new Settings tab or Sidebar link and a simple UI component using Material UI (MUI) is well within the current stack capabilities.
2. **Strategic Alignment:** Essential for user trust and retention. Providing a clear path to support and FAQs improves UX.
3. **Architectural Integrity:** Cleanly integrates. We can add a "Support" tab to the existing `SettingsTabs` and a new `SupportTab.tsx` component, adhering to the 100-Line Modularity rule.
4. **Necessity/Priority:** Labeled as low priority but part of the roadmap. Necessary for a production-ready application.
5. **External Dependencies & Cost:** Minimal. Opting for a `mailto:` link instead of a complex contact form avoids adding third-party email providers (like SendGrid/Resend) for now, keeping costs at zero.

## Technical Specs
- Modify `src/components/settings/SettingsTabs.tsx` to include a new "Support" tab with a `HelpOutlineIcon`.
- Update `src/app/settings/SettingsContent.tsx` to render `<SupportTab />` when `activeTab === 'support'`.
- Create a new component `src/components/settings/SupportTab.tsx`:
  - Use MUI `GlassCard`, `Typography`, `Button`, and `List`/`ListItem` to build the UI.
  - Include a "Contact Us" section with a `Button` that has `href="mailto:support@socialstudio.app"`.
  - Include a "Help & FAQ" section with external links or placeholder links (e.g., `/docs/faq`).
- Modify `src/components/layout/Sidebar.tsx` to add a "Support" menu item linking to `/settings?tab=support` with a `HelpOutlineIcon`.

## Test Specification
- **Happy Path:**
  - User clicks on "Support" in the Sidebar and is navigated to `/settings?tab=support`.
  - The "Support" tab in Settings correctly displays the `mailto:` link and FAQ links.
  - Clicking the email button opens the default mail client with `support@socialstudio.app`.
- **Edge Cases:**
  - User directly navigates to `/settings?tab=support` and the tab is highlighted correctly.
- **Negative Scenarios:**
  - N/A (Standard static routing and UI rendering, no complex state).

# 📅 Timeline
- **[2026-06-01 18:04:40]**: DISCOVERY [NECESSARY] - # Ticket 399: Support Email

## Verdict
NECESSARY

## Socratic Log
1. **Feasibility:** Technically straightforward. Adding a new Settings tab or Sidebar link and a simple UI component using Material UI (MUI) is well within the current stack capabilities.
2. **Strategic Alignment:** Essential for user trust and retention. Providing a clear path to support and FAQs improves UX.
3. **Architectural Integrity:** Cleanly integrates. We can add a "Support" tab to the existing `SettingsTabs` and a new `SupportTab.tsx` component, adhering to the 100-Line Modularity rule.
4. **Necessity/Priority:** Labeled as low priority but part of the roadmap. Necessary for a production-ready application.
5. **External Dependencies & Cost:** Minimal. Opting for a `mailto:` link instead of a complex contact form avoids adding third-party email providers (like SendGrid/Resend) for now, keeping costs at zero.

## Technical Specs
- Modify `src/components/settings/SettingsTabs.tsx` to include a new "Support" tab with a `HelpOutlineIcon`.
- Update `src/app/settings/SettingsContent.tsx` to render `<SupportTab />` when `activeTab === 'support'`.
- Create a new component `src/components/settings/SupportTab.tsx`:
  - Use MUI `GlassCard`, `Typography`, `Button`, and `List`/`ListItem` to build the UI.
  - Include a "Contact Us" section with a `Button` that has `href="mailto:support@socialstudio.app"`.
  - Include a "Help & FAQ" section with external links or placeholder links (e.g., `/docs/faq`).
- Modify `src/components/layout/Sidebar.tsx` to add a "Support" menu item linking to `/settings?tab=support` with a `HelpOutlineIcon`.

## Test Specification
- **Happy Path:**
  - User clicks on "Support" in the Sidebar and is navigated to `/settings?tab=support`.
  - The "Support" tab in Settings correctly displays the `mailto:` link and FAQ links.
  - Clicking the email button opens the default mail client with `support@socialstudio.app`.
- **Edge Cases:**
  - User directly navigates to `/settings?tab=support` and the tab is highlighted correctly.
- **Negative Scenarios:**
  - N/A (Standard static routing and UI rendering, no complex state).
