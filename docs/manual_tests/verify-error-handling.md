# Manual Test: Graceful Error Handling & Boundaries

## Prerequisites
- Local development server running (`npm run dev`).
- Access to a web browser.
- (Optional) Sentry project configured to verify log ingestion.

## Test Case 1: Route-Level Error Boundary
1. **Navigate to:** `http://localhost:3000/test-error`.
2. **Expected Result:**
   - The page should not crash completely.
   - A semi-transparent "Glass Aesthetic" card should appear.
   - The message "Something went wrong" should be visible in red.
   - The specific error message "Intentional render error for testing boundaries" should be displayed.
   - A "Try again" button should be present.
3. **Action:** Click the "Try again" button.
4. **Expected Result:** The page attempts to re-render. Since `/test-error` throws consistently, the error boundary should persist.

## Test Case 2: Visual Integrity & Accessibility
1. **Navigate to:** `http://localhost:3000/test-error`.
2. **Visual Check:**
   - Ensure the error card has a blur effect (`backdrop-filter: blur(10px)`).
   - Ensure text contrast is high (White/Secondary text on dark/blurred background).
   - Ensure the "Try again" button is clearly visible and interactive.
3. **Accessibility Check:**
   - Tab through the page. The "Try again" button should be focusable and have a clear focus ring.

## Test Case 3: API Error Handling (Simulated)
1. **Action:** Trigger an API call that returns an `AppError` or a 500 status (e.g., via a known failing endpoint or by temporarily modifying an API route).
2. **Expected Result:**
   - The API should return a JSON response with `error` and `code` fields.
   - Example: `{ "error": "An unexpected error occurred", "code": "INTERNAL_SERVER_ERROR" }`.
   - The client-side logic should handle this response without crashing the UI, ideally showing a notification or a local error state.

## Test Case 4: Sentry Integration
1. **Action:** Trigger the error at `http://localhost:3000/test-error`.
2. **Verification:** Check the Sentry Dashboard for a new issue.
3. **Expected Result:** An issue with the title `Error: Intentional render error for testing boundaries` should be logged with the correct stack trace.
