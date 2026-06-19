
## [2026-06-17 18:07:50] Verdict: APPROVED
# Discovery Phase Report - Issue 648

## Verdict: APPROVED

## Technical Blueprint: Post Versioning Architecture

### 1. Database Schema Evolution (`prisma/schema.prisma`)
I will enhance `PostPlatformResult` to store explicit pre-publish overrides. This avoids creating a redundant table while maintaining the 1:1 relationship between a post-task and its platform destination.

```prisma
model PostPlatformResult {
  // Existing fields...
  overrideTitle       String?
  overrideDescription String?
  hashtags            String?
  firstCommentText    String?
  scheduledAt         DateTime? // Platform-specific staggering
  // ... rest of fields
}
```

### 2. Frontend State Evolution
The `UploadFormContext` will be expanded to support the "Global-First" unlinking logic.

- **State Changes (`useUploadFormState`):**
  - `overriddenPlatforms: string[]` (Tracks which platforms are customized)
  - `platformHashtags: Record<string, string>`
  - `platformFirstComments: Record<string, string>`
  - `platformSchedules: Record<string, string>`
- **Logic:**
  - `isOverridden(platform)`: Helper to check if a platform is customized.
  - `getValue(platform, field)`: Returns platform-specific value if overridden, otherwise returns the Global value.

### 3. Component Architecture
- **`PostComposerTabs`**: A new MUI-based orchestrator.
- **`SyncToggle`**: A small UI element in each platform tab to "Link/Unlink" from Global.
- **`StandardMetadataFields`**: Updated to include a `Hashtags` field.
- **`PlatformMetadataItem`**: Updated to show the "Synced" status and provide the override fields.

### 4. API & Service Layer
- **`UploadInitSchema`**: Update Zod schema to include the new override fields in the `platforms` array.
- **`ActivityService`**: Update `initializeActivity` to map these fields directly to the Prisma create call.

---

## Socratic Log (Interrogations)
1. **Q: How will the "Sync All" button work?**
   - **A:** It will clear the `overriddenPlatforms` array and all platform-specific Records, effectively resetting everything to match the Global tab.
2. **Q: Should we show platform-specific character limits in the Global tab?**
   - **A:** Yes. If any selected platform would fail validation with the current Global text, the Global tab should show a warning icon on the corresponding platform tab.
3. **Q: What about "First Comment"?**
   - **A:** We will add the schema and a read-only/placeholder field in the UI labeled "Coming Soon" to satisfy the roadmap requirement without building the full automation worker yet.

---

## Test Specification

### Automated Scenarios (Playwright)
- **TEST-001: Sync Inheritance** -> Type in Global, verify values appear in platform tabs (synced).
- **TEST-002: Override Isolation** -> Unlink LinkedIn, change text, verify Global remains unchanged.
- **TEST-003: Re-sync Logic** -> Click "Reset to Global" on an overridden tab, verify it inherits Global again.
- **TEST-004: Multi-Schedule** -> Set different times for TikTok and YouTube, verify API payload.

### Manual Scenarios
- Verify tab switching performance and focus management.
- Verify that "Hashtags" are properly appended/stored per platform rules.
- Verify MUI responsive behavior for many platform tabs (scrollable tabs).

## Next Step: Invoke `dev-agent` for implementation.
I recommend starting with the Prisma schema update and then moving to the `useUploadForm` hook evolution before building the UI components.
