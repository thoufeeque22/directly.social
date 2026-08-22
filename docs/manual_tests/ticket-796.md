# Manual Test Script: Ticket 796 - AI Processing Consent

## Objective
Verify that users are explicitly forced to consent to AI processing before uploading their first video for AI generation, and that this consent is securely stored and remembered for subsequent uploads.

## Prerequisites
- A local running instance of the application (`pnpm dev`).
- An account with `genAITermsAcceptedAt` set to `null` in the database. (You can create a new account or use Prisma Studio to set an existing account's consent to `null`).

## Test Cases

### Test Case 1: Consent Checkbox Enforcement
1. Log in to the application with the prerequisite account.
2. Navigate to the main upload area.
3. Select a valid video file from your file system.
4. If presented with a tier selection, select an AI processing tier (e.g., "Generate").
5. **Expected Result:**
   - A consent checkbox labeled "I understand that my video will be processed by AI..." (or similar) is visible at the bottom of the form.
   - The checkbox is UNCHECKED by default.
   - The primary action button (e.g., "Post Video" or "Review AI Strategy") is visually disabled and cannot be clicked.

### Test Case 2: Granting Consent
1. With the form in the state from Test Case 1, click the consent checkbox to check it.
2. **Expected Result:**
   - The primary action button immediately becomes enabled.
3. Click the primary action button to submit the form.
4. **Expected Result:**
   - The video upload and AI processing flow begins normally.
   - The user's `genAITermsAcceptedAt` field in the database is now updated to the current timestamp.

### Test Case 3: Consent Persistence (No Repeated Check)
1. After successfully completing Test Case 2, complete the flow or return to the main dashboard.
2. Refresh the page to ensure the NextAuth session re-evaluates.
3. Select another video to upload.
4. **Expected Result:**
   - The consent checkbox is NO LONGER visible.
   - The primary action button is immediately ENABLED by default.
   - The user can proceed with the upload without checking any boxes.
