# Manual Test Script: Ticket 718 (Native Mobile Test Coverage)

## Overview
This test script verifies the native mobile flows (navigation, camera permissions, deep linking, pull-to-refresh) added in ticket 718.

## Prerequisites
- App must be compiled and running on an iOS or Android Simulator.
- You must have an active internet connection.

## Scenarios

### Scenario 1: Native Bottom-Tab Navigation
1. Launch the app on the simulator.
2. Tap "Login", enter "tester@directly.social" and "password", then tap "Authenticate Tester".
3. Verify the Dashboard ("Upload & Automate") is displayed.
4. Tap the "Activity Hub" icon in the bottom navigation tab.
5. Verify the "Activity Hub" screen loads.
6. Tap "Settings" in the bottom navigation tab.
7. Verify the "Settings" screen loads.
8. Tap "Upload & Automate" to return to the dashboard.

### Scenario 2: Camera Permissions
1. Launch the app and authenticate.
2. Ensure you are on the "Upload & Automate" dashboard.
3. Tap on "Take Photo".
4. A system-level camera permission dialog should appear.
5. Tap "Allow" or "Grant".
6. Verify the native camera view opens successfully.

### Scenario 3: Deep Linking & Routing
1. Launch the app and authenticate.
2. Close or background the app.
3. From the simulator terminal/browser, trigger the deep link: `directly://upload`.
4. The app should foreground.
5. Verify the "Upload & Automate" screen is displayed immediately.

### Scenario 4: Pull-to-Refresh
1. Launch the app and authenticate.
2. On the "Upload & Automate" screen, swipe down from the top.
3. Verify the loading spinner appears.
4. Verify the screen data refreshes without crashing the application.
