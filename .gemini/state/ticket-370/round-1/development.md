# Development: Ticket #370 - Data Integrity Audit

## 1. Implementation Plan
1. **Schema Update:** Modify `prisma/schema.prisma` to add `checksum` and `checksumType` to `GalleryAsset`.
2. **Checksum Utility:** Create `src/lib/utils/checksum.ts` for SHA-256 calculation (streaming support).
3. **Upload Pipeline Refactor:**
    - Update `src/lib/upload/chunk-assembler.ts` to calculate checksums.
    - Update `src/lib/upload/gallery-registration.ts` for checksum-based deduplication.
4. **Audit Service:** Create `src/lib/services/audit-service.ts`.
5. **Sanitization Utility:** Create `src/lib/utils/sanitization.ts` with Strategy Pattern.
6. **Worker Integration:** Update `src/lib/worker/worker.ts` to run periodic audits.

## 2. Implementation Log
- [ ] Schema Migration
- [ ] Checksum Utility
- [ ] Upload Pipeline Integration
- [ ] Audit Service
- [ ] Sanitization Utility
- [ ] Worker Integration

## 3. Verification
- [ ] Build Check (`npm run build`)
- [ ] Lint Check (`npm run lint`)
- [ ] Type Check (`npx tsc --noEmit`)
- [ ] Unit Tests (Checksum & Sanitization)
- [ ] Integration Tests (Audit Service)
