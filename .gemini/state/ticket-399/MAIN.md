# Ticket 399: Add Support / Help Link

**Status:** IN_PROGRESS (Dev Phase)

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
