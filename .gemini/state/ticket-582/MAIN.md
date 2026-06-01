---
ticket_id: 582
branch_name: feature/582-repo-cleanup
goal: Global repository cleanup and directory standardization
status: review
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 582
- **Branch**: `feature/582-repo-cleanup`
- **Goal**: Global repository cleanup and directory standardization
- **Current Status**: review

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-01 12:00:00]**: Ticket initialization and branch creation completed.
- **[2026-06-01 12:00:00]**: Discovery phase started by `discovery-agent`.
- **[2026-06-01 19:05:38]**: DISCOVERY [APPROVED] - ### Verdict: APPROVED

### Socratic Log
1. **Clutter Identification**: The root directory contains 'verification/' with task-specific screenshots that are no longer needed.
2. **Directory Ambiguity**: 'tmp/' usage is mixed.
3. **Script Fragmentation**: Scripts are split between 'scripts/' and 'src/__tests__/scripts/'.
4. **Configuration Cleanup**: 'tsconfig.tsbuildinfo' and other artifacts clutter the root.

### Technical Blueprint
1. **Visual Artifact Migration**:
   - Purge 'verification/'.
   - Update policy to use 'docs/visual/goldens' for permanent goldens.
2. **Script Consolidation**:
   - Move database seeding/cleanup scripts from 'scripts/' to 'src/__tests__/scripts/'.
3. **Root Directory Pruning**:
   - Remove temporary/orphaned files.
4. **Gitignore Audit**:
   - Clean up unused ignore patterns.

### Test Specification
- Verify root directory cleanliness.
- Verify script functionality after move.
- Verify '.gitignore' effectiveness.
- **[2026-06-01 19:12:04]**: DEV [SUCCESS] - ### Summary of Implementation
1. **Visual Artifact Purge**: Deleted the 'verification/' directory and cleared 'tmp/'.
2. **Script Consolidation**: 
   - Moved 'scripts/clear-activity.ts' -> 'src/__tests__/scripts/clear-activity.ts'.
   - Moved 'scripts/cleanup-neon.sh' -> 'src/__tests__/scripts/cleanup-neon.sh'.
   - Updated 'package.json' scripts to match new paths.
3. **Root Pruning**: Removed 'tsconfig.tsbuildinfo' and 'next-env.d.ts'.
4. **Gitignore Audit**: Refactored '.gitignore' for better organization and to ensure temporary files are properly ignored.

### Verification Results
- **Linting**: Passed (warnings only).
- **Build**: Successfully completed production build.
- **Structure**: Verified target directories contain expected files.
