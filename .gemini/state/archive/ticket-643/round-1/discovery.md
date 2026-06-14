
## [2026-06-04 17:30:45] Verdict: NECESSARY
## Technical Blueprint: Global Rebrand to Directly

### 1. Naming Mapping
- Brand Name: Social Studio -> Directly
- Identifier: SocialStudio -> Directly
- App ID: com.thoufeeque.socialstudio -> com.thoufeeque.directly
- URL Scheme: socialstudio:// -> directly://
- User Agent: SocialStudioApp -> DirectlyApp
- Support Email: socialstudio.support@gmail.com -> directly.support@gmail.com
- E2E Emails: tester@socialstudio.ai -> tester@directly.so

### 2. Implementation Strategy (Global Refactor)
- Phase A: UI & Metadata: Search and replace in src/, docs/, and README.md.
- Phase B: Mobile Configs: Update capacitor.config.ts, AndroidManifest.xml, strings.xml, and iOS pbxproj.
- Phase C: E2E & Tests: Update seed scripts and spec files.

### 3. Architectural Separation
- Move marketing components from src/app/login/ to src/app/page.tsx.
- Refactor src/app/page.tsx to handle both Marketing (guest) and Dashboard (auth) views.
- Simplify /login to a centered card.
