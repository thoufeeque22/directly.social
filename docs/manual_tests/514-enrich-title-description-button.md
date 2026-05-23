# Manual Test: Enrich Title & Description Button (Issue #514)

This manual test suite validates the integration and functionality of the "Polish with AI" action button within the post creation form under Manual Mode.

## Prerequisites

- Application is running locally (`npm run dev` or a production build).
- Authenticated user account.
- A test video file ready for upload.

---

## Test Case 1: Button Visibility and Layout in Manual Mode

### Steps
1. Navigate to the main Dashboard page.
2. Select a video file (either upload a file or select from the Browse Gallery modal).
3. Under the **AI Automation Tier** selector, ensure **Manual** is selected.
4. Fill in the **Video Title** and **Description** fields.
5. Scroll down to the bottom action area.
6. Observe the button layout.

### Expected Results
- The **Polish with AI** button (featuring the Material UI `AutoAwesomeIcon` "sparkles" icon) is rendered directly to the left of the **Post Video** button.
- The button matches the application's premium glass-morphic visual styling with a subtle gradient background: `linear-gradient(135deg, hsla(var(--primary) / 0.1), hsla(var(--primary) / 0.05))`.
- The layout is balanced: the "Polish with AI" button has a `flex` ratio of 1, and the primary "Post Video" button has a slightly wider `flex` ratio of 1.2.

---

## Test Case 2: Transition from Manual to Enrich Tier

### Steps
1. Perform steps 1-5 from Test Case 1.
2. Open the browser's developer console (F12 / Cmd+Opt+I) and clear the console log.
3. Click the **Polish with AI** button.
4. Observe the UI changes immediately after clicking.
5. Check the developer console for any warnings or hydration errors.

### Expected Results
- The **AI Automation Tier** selector automatically switches to **Enrich**.
- The bottom action buttons dynamically update:
  - The **Polish with AI** button disappears.
  - The primary submit button updates from **Post Video** (Rocket icon) to **Review AI Strategy** (Sparkles icon).
- The **AI Style Selector** panel dynamically fades into view above the platform selector.
- The **AI Strategy** status message panel is displayed: "AI Strategy: Refining draft in Professional style." (or the selected style).
- The browser console remains 100% clean of hydration mismatch warnings or error logs.

---

## Test Case 3: Submission via the Upgraded Tier

### Steps
1. Complete the transition flow from Test Case 2.
2. Choose at least one social media account platform.
3. Click **Review AI Strategy**.
4. Observe that the application successfully transitions to the preview/review screen with the polished suggestions.

### Expected Results
- The application processes the draft using the Enrich AI flow.
- The user is presented with the review view for the generated content, proving a successful transition.
