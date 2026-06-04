# Manual Test Script: Ticket-634 - NotebookLM Formalization

## Overview
This test verifies the NotebookLM documentation synthesis workflow, including the bundling script and security scanner.

## Prerequisites
- Node.js and npm installed.
- Repository cloned and dependencies installed (`npm install`).

## Test Scenarios

### 1. Successful Bundling
**Steps:**
1. Open terminal in the project root.
2. Run `npm run notebook:package`.
3. Verify the output message: `✅ Successfully bundled X files into .../tmp/notebook-upload`.
4. Navigate to `tmp/notebook-upload/`.
5. Verify that files are present and their names are flattened (e.g., `docs__ARCHITECTURE.md`).
6. Verify core files like `GEMINI.md`, `package.json`, and `prisma/schema.prisma` are included.

**Expected Result:**
- The command exits with code 0.
- `tmp/notebook-upload/` contains flattened versions of all files in the manifest.

### 2. Secret Detection (Negative Test)
**Steps:**
1. Create a temporary file: `docs/test_secret.md`.
2. Add a secret to the file: `MY_SECRET_KEY` = `"sk_live_12345"` (replace with actual secret-like string).
3. Run `npm run notebook:package`.
4. Verify the command fails with an error message indicating a secret was detected.
5. Verify no new files were copied to `tmp/notebook-upload/` after the error (the directory is cleared at start).

**Expected Result:**
- The command exits with code 1.
- Console shows: `ERROR: Potential secret or PII detected in docs/test_secret.md!`.
- Bundling stops immediately.

### 3. PII Detection (Negative Test)
**Steps:**
1. Create a temporary file: `docs/test_pii.md`.
2. Add a personal email: `Contact me at john.doe (at) gmail.com`.
3. Run `npm run notebook:package`.
4. Verify the command fails with an error message indicating PII was detected.

**Expected Result:**
- The command exits with code 1.
- Console shows: `ERROR: Potential secret or PII detected in docs/test_pii.md!`.

### 4. Allowed Domain Exception (Positive Test)
**Steps:**
1. Create a temporary file: `docs/test_allowed.md`.
2. Add an allowed email: `support@directly.social`.
3. Run `npm run notebook:package`.
4. Verify the command succeeds.

**Expected Result:**
- The command exits with code 0.
- `support@directly.social` does not trigger the PII scanner.

## Cleanup
- Delete any temporary files created in `docs/` during testing.
- The `tmp/notebook-upload/` directory can be kept or deleted.
