# Manual Test Script: Ticket #582 - Global Repository Cleanup

## 📋 Metadata
- **Ticket ID**: 582
- **Feature**: Global repository cleanup and directory standardization
- **Branch**: `feature/582-repo-cleanup`

## 🧪 Test Scenarios

### Scenario 1: Root Directory Audit
**Goal**: Ensure the root directory is clean of temporary and orphaned artifacts.
1. Run `ls -F` in the project root.
2. **Expected**:
    - `verification/` directory is MISSING.
    - `tsconfig.tsbuildinfo` is MISSING.
    - `next-env.d.ts` is MISSING.
    - `tmp/` directory is EMPTY (except for `.gitignore`).

### Scenario 2: Relocated Script Functionality
**Goal**: Verify that scripts moved to `src/__tests__/scripts/` are still executable via `npm`.
1. Run `npm run clear-activity`.
2. **Expected**: The script should start executing. It may fail due to missing env vars in some environments, but it should NOT fail with a "File not found" error related to the path change.

4. **Expected**: The script should attempt to run.

### Scenario 3: Gitignore Integrity
**Goal**: Ensure local/temporary folders are correctly ignored.
1. Create a dummy directory: `mkdir .vercel`.
2. Run `git status`.
3. **Expected**: `.vercel/` should NOT appear in untracked files.
4. Delete the dummy directory: `rm -rf .vercel`.

## 🏁 Verdict
[PASS / FAIL]
