# UAT Script: Advanced Metadata & Templates (#364)

## Overview
This script verifies the ability to save, reuse, and manage metadata snippets (standard descriptions, bio links, credits) across posts, as well as the enforcement of character limits and global metadata inheritance.

## Prerequisites
- User must be logged in.
- At least one video file ready for a dummy upload.
- Accounts linked for multiple platforms (e.g., YouTube and TikTok).

## Scenario 1: Character Limit Validation (Global)
1. **Navigate** to the Upload Dashboard (`/`).
2. **Locate** the Global Video Title field.
3. **Type** a very long string (over 100 characters).
4. **Verify** the character counter turns red (e.g., `105/100`).
5. **Verify** a warning message appears indicating the limit is exceeded for some platforms.
6. **Verify** the input field border turns red.
7. **Expected Result:** Real-time visual feedback warns the user of character limit violations.

## Scenario 2: Saving and Using a Global Snippet (Happy Path)
1. **Navigate** to the Upload Dashboard (`/`).
2. **Select** a video file (or browse gallery).
3. **Type** a standard description in the "Description" field (e.g., "Follow me on IG: @socialstudio").
4. **Click** the "Snippets" button (bookmark icon) next to the description label.
5. **Click** "Save Current as Snippet".
6. **Enter** a name: "My IG Link".
7. **Click** "Save".
8. **Clear** the description field manually.
9. **Click** "Snippets" button again.
10. **Verify** "My IG Link" appears in the list.
11. **Select** "My IG Link".
12. **Expected Result:** The description field is automatically populated with "Follow me on IG: @socialstudio".

## Scenario 3: Platform-Specific Snippets & Limits
1. **Enable** "Separate titles/descriptions per platform" toggle.
2. **Select** at least two platforms (e.g., YouTube and TikTok).
3. **Find** the YouTube title field.
4. **Verify** the counter shows a `/100` limit.
5. **Find** the TikTok description field.
6. **Verify** the counter shows a `/4000` limit.
7. **Click** the "Snippets" button for YouTube description.
8. **Select** an existing snippet.
9. **Verify** only the YouTube description is updated.
10. **Expected Result:** Snippets can be independently applied and platform-specific constraints are displayed correctly.

## Scenario 4: Global Metadata Inheritance
1. **Navigate** to the Upload Dashboard (`/`).
2. **Fill** out the Global Title ("Global Title") and Global Description ("Global Description").
3. **Enable** the "Separate titles/descriptions per platform" toggle.
4. **Select** YouTube and TikTok.
5. **Fill** out the YouTube Title override ("YouTube Specific Title").
6. **Leave** all other platform-specific fields blank.
7. **Submit** the form (initiate upload/distribution).
8. **Verify** (via network request inspection or checking the resulting pending post state) that:
    - YouTube payload uses "YouTube Specific Title" and "Global Description".
    - TikTok payload uses "Global Title" and "Global Description".
9. **Expected Result:** Empty platform overrides seamlessly inherit values from the global metadata fields.

## Scenario 5: Managing Snippets (Edit & Delete) in Settings
1. **Navigate** to the Settings page (`/settings`).
2. **Locate** the "Reusable Snippets" section.
3. **Verify** all saved snippets are displayed.
4. **Click** the edit icon (pencil) on a snippet.
5. **Change** the name and the content.
6. **Click** "Save".
7. **Verify** the snippet updates in the list.
8. **Click** the trash icon on a snippet.
9. **Confirm** the deletion in the browser dialog.
10. **Verify** the snippet is removed from the list.
11. **Expected Result:** Snippets can be fully managed (edited and deleted) from the Settings page.

## Scenario 6: Edge Cases & UI Polish
1. **Attempt** to save a snippet when the description field is empty.
   - **Expected Result:** "Save Current as Snippet" button should be disabled.
2. **Open** the snippets dropdown and click the "X" or outside the menu.
   - **Expected Result:** Menu closes gracefully.
3. **Save** a very long snippet name.
   - **Expected Result:** UI should handle text wrapping or truncation without breaking layout.
