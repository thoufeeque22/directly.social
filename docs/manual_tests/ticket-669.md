# Manual Verification Script: TemplateManager & Composer UI additions (Ticket #669)

This document provides step-by-step manual test instructions to verify the refactored TemplateManager (Snippets tab) and the newly added Snippets functionality in the Composer UI.

## Prerequisites
1. Ensure the development server is running locally (typically at `http://localhost:3000`).
2. Ensure you are logged in or have access to the app (no auth blocker).
3. Have at least 2-3 sample snippets already created (or prepare to create one during testing).

---

## Test Scenario 1: Snippets Tab Navigation
### Steps
1. Navigate to the base URL (e.g. `http://localhost:3000`).
2. Navigate to the `/settings` page by clicking on the settings icon or navigating directly to `/settings`.
3. In the settings page layout, locate the tabs and click on the **Snippets** tab.
### Expected Results
* The page displays the Snippets management UI.
* The browser URL updates to `/settings?tab=snippets`.
* The search box and a list/grid of existing snippet cards are rendered correctly.

---

## Test Scenario 2: Text Search Filtering
### Steps
1. Locate the search box in the Snippets tab with the placeholder or label "Search...".
2. Type a search query matching the title, description, or first comment of an existing snippet.
3. Type a search query that does **not** match any existing snippet (e.g. `nonexistent_snippet_query`).
4. Click the "Clear Search" button that appears.
### Expected Results
* Snippets filter instantly in real-time as you type.
* Only matching snippets are visible when a valid query is typed.
* If no snippet matches the query, the UI displays the empty state: `"No matching snippets found for '<query>'"` along with a `"Clear Search"` button.
* Clicking "Clear Search" restores all snippets and clears the search input text.

---

## Test Scenario 3: Editing Snippets
### Steps
1. Locate an existing snippet card.
2. Click the **Edit** (pencil) icon (which should have `aria-label="Edit Snippet"`).
3. Observe the card's transformation into an editing form containing fields: Name (Title), Description, and First Comment.
4. Try clearing the **Name** input entirely.
5. Try clearing the **Description** input entirely.
6. Verify that helper text validation warnings appear for these mandatory fields (e.g. name or description cannot be empty).
7. Verify that the **Save** button becomes disabled.
8. Enter valid text into all fields (e.g. append `[Edited]` to Name, Description, and First Comment).
9. Click the **Save** button.
### Expected Results
* The card transitions into edit mode successfully when the Edit icon is clicked.
* The Save button is disabled and validation messages/helper text are visible if Name or Description is empty.
* Clicking Save saves the updated values to the backend and transitions the card back to view mode.
* The card displays the updated Name, Description, and First Comment (marked with a comment/forum icon).

---

## Test Scenario 4: Deleting Snippets
### Steps
1. Locate a snippet card you wish to delete.
2. Click the **Delete** (trash) icon (which should have `aria-label="Delete Snippet"`).
3. Observe the prompt that appears.
4. Click **Cancel** on the confirm dialog.
5. Click the **Delete** icon again and click **OK** (or accept) on the confirm dialog.
### Expected Results
* A native browser confirm dialog appears with a message asking if you are sure you want to delete the snippet.
* If you click Cancel, the snippet remains intact.
* If you click OK, the snippet is deleted and immediately removed from the list without requiring a manual page refresh.

---

## Test Scenario 5: Composer UI Snippets Additions
### Steps
1. Navigate to the main/dashboard composer page (e.g. `/` or `/composer`).
2. Locate the following input fields:
   * **Video Title**
   * **Global Description**
   * **Global Hashtags**
   * **Global First Comment**
3. Verify that a **Snippets** button appears next to the label of each of these four fields.
4. Type some initial text in the **Video Title** field (e.g. `My Video`). Click the **Snippets** button next to it, select a snippet, and verify how it is appended.
5. Type some initial text in the **Global Description** field. Click the **Snippets** button next to it, select a snippet, and verify how it is appended.
6. Type some initial text in the **Global Hashtags** field (e.g. `#fun`). Click the **Snippets** button next to it, select a snippet, and verify how it is appended.
7. Type some initial text in the **Global First Comment** field (e.g. `Check it out`). Click the **Snippets** button next to it, select a snippet, and verify how it is appended.
8. Enter a new value in one of the fields and click the **"Save Current as Snippet"** option or button associated with that field.
### Expected Results
* The Snippets button is visible next to the labels of Video Title, Global Description, Global Hashtags, and Global First Comment.
* Clicking the Snippets button lists available snippets.
* Selecting a snippet appends its value to the field with the correct separator:
  * **Video Title**: Appends with a space separator (e.g. `My Video <snippet_title>`).
  * **Global Description**: Appends with a space/default separator.
  * **Global Hashtags**: Appends with a space separator.
  * **Global First Comment**: Appends with a newline separator (e.g. `Check it out\n<snippet_comment>`).
* Clicking "Save Current as Snippet" successfully saves the current field value as a new snippet (it prompts for a name/title and saves the current content).
