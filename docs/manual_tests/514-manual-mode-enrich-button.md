# UAT Manual Test Specification: Manual Mode AI Enrichment Button (Issue #514)

This test specification describes manual verification steps for validating the visibility and functionality of the "Polish with AI" button in Manual Mode.

## Prerequisites
1. User must be signed in with a valid account.
2. The user profile must have the AI Tier set to **Manual** (or forced via local storage).

## Test Case 1: Button Visibility & Layout
### Steps
1. Navigate to the main dashboard `/`.
2. Ensure the AI Tier selector is set to **Manual**.
3. Observe the bottom action row next to the primary submit button.

### Expected Results
- A button labeled **✨ Polish with AI** is clearly visible to the left of the **Post Video** button.
- The button maintains consistent styling aligned with the Material UI aesthetic (using `AutoAwesomeIcon` and curated theme styling).
- Both buttons sit elegantly side-by-side in a balanced flex layout.

---

## Test Case 2: Tier Transition Functionality
### Steps
1. Navigate to the dashboard in **Manual** Mode.
2. Click the **✨ Polish with AI** button.

### Expected Results
- The AI Tier selector immediately transitions to **Enrich**.
- The main action button changes its label from **Post Video** to **Review AI Strategy**.
- The **✨ Polish with AI** button gracefully disappears (as it is strictly dedicated to Manual Mode).
