---
ticket_id: 663
branch_name: feature/663-enhance-legal-ui-refactor-docs
status: qa
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 663
- **Branch**: `feature/663-enhance-legal-ui-refactor-docs`
- **Goal**: Implement headers/footers on legal pages and refactor documentation to be user-focused.
- **Current Status**: qa

# 📝 Ticket Description
### Context
The application currently lacks a consistent UI for legal and documentation pages. Furthermore, the "Getting Started" guide combines basic user onboarding with technical setup (BYOS), which can be overwhelming for non-technical users.

### Problem/Goal
1.  **Legal Pages UI:** Implement headers and footers on the Privacy Policy and other legal pages to ensure brand consistency and navigation parity with the rest of the application.
2.  **Documentation Refactoring:** Restructure the "Getting Started" guide to focus exclusively on standard user onboarding. Move technical configurations, such as "Bring Your Own Server" (BYOS), to a dedicated technical or advanced section.

### Suggested Approach
- **UI:** Wrap legal page content in a layout that includes the application's standard `Header` and `Footer` components. Ensure these pages use Material UI components (e.g., `Container`, `Typography`) for consistent styling.
- **Docs:** Modify `docs/README.md` and related files to separate "Getting Started" (for users) from "Technical Setup" or "Advanced Configuration" (for developers/self-hosters).

### Impact
- **Professionalism:** Consistent headers/footers improve the perceived quality and trust of legal documents.
- **User Experience:** A simplified "Getting Started" guide reduces friction for new users, while technical users can still find advanced setup details in their own section.

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-14 14:15:00]**: Ticket initialized.
- **[2026-06-14 16:18:20]**: PRODUCT [APPROVED] - Proposed unified public layout for legal pages and persona-split docs.
- **[2026-06-14 16:42:20]**: DEVELOPMENT [SUCCESS] - Consolidated public routes under (public) group, implemented unified layout with headers/footers, and refactored documentation by persona.
- **[2026-06-14 17:34:27]**: DEVELOPMENT [SUCCESS] - Finalized comprehensive documentation and UI package including smart links, ToC anchors, grid balancing, and expanded feature guides.
- **[2026-06-14 17:36:27]**: DEVELOPMENT [SUCCESS] - Shortened card descriptions for better visual balance.
- **[2026-06-14 17:40:43]**: AUDIT [PASS] - Security and performance checks passed. Minor optimizations recommended for Next.js layout and dynamic imports.
- **[2026-06-14 18:19:13]**: DEVELOPMENT [SUCCESS] - Finalized comprehensive documentation and UI package.
