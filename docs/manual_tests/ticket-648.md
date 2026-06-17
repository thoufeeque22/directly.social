# Manual Test Script: Multi-Platform Post Versioning (Ticket #648)

## Overview
Verify that the Post Composer correctly handles global metadata propagation and platform-specific overrides using the new tabbed interface.

## Prerequisites
1.  User is logged in.
2.  At least two social accounts (e.g., YouTube and Instagram) are connected.
3.  Development server is running at `http://localhost:3000`.

## Test Scenarios

### Scenario 1: Tab Navigation & Global Inheritance
1.  Go to the Dashboard.
2.  Select **YouTube** and **Instagram** from the platform selection list.
3.  Verify that a tabbed interface appears with "Global", "YouTube", and "Instagram" tabs.
4.  In the **Global** tab, enter `Master Title` in the title field and `Master Description` in the description field.
5.  Switch to the **YouTube** tab.
6.  Verify that it shows: "This platform is currently using global settings."
7.  Verify that there is a **"Customize for youtube"** button.
8.  Switch to the **Instagram** tab and verify the same.

### Scenario 2: Platform Override (Unlinking)
1.  In the **Instagram** tab, click **"Customize for instagram"**.
2.  Verify that the title and description fields appear, pre-filled with `Master Title` and `Master Description`.
3.  Change the Instagram title to `Instagram Special`.
4.  Change the Instagram hashtags to `#igreels #viral`.
5.  Switch back to the **Global** tab.
6.  Change the Global title to `Updated Master Title`.
7.  Switch to the **YouTube** tab (still synced).
8.  Click **"Customize for youtube"** and verify its title is `Updated Master Title`.
9.  Switch to the **Instagram** tab (overridden).
10. Verify its title is still `Instagram Special` (did not get updated by Global).

### Scenario 3: Re-syncing (Reset to Global)
1.  In the **Instagram** tab, click the **"Reset to Global"** button at the top right of the platform section.
2.  Verify that the customized fields disappear.
3.  Verify that the message "This platform is currently using global settings" reappears.
4.  Click **"Customize for instagram"** again.
5.  Verify the title is now `Updated Master Title` (re-inherited from Global).

### Scenario 4: Persistence
1.  Perform some overrides on YouTube (e.g., set a custom title).
2.  Refresh the browser page.
3.  Verify that YouTube still shows as overridden (with the primary dot indicator on the tab).
4.  Verify the custom title is still present in the YouTube tab.

### Scenario 5: Submission Payload
1.  Open the browser console or network tab.
2.  Fill in metadata for Global and one overridden platform.
3.  Click **"Post Video"**.
4.  Verify the `/api/upload/init` request payload contains the `overrideTitle`, `overrideDescription`, `hashtags`, etc., for the overridden platform, while the synced platform uses the Global values in its metadata object.
