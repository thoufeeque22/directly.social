# Manual Test Script: Ticket 395 (Mobile UX: Safe Areas)

## Overview
Verify that the application's UI components (Header, Sidebar, Login, AIChatbot) correctly handle modern mobile safe areas (notches and home indicators).

## Setup
1. Open the application in **Google Chrome** or **Safari**.
2. Open **Developer Tools** (F12 or Cmd+Opt+I).
3. Enable **Device Mode** (Cmd+Shift+M).
4. Select a device with a notch, such as **iPhone 14 Pro** or **iPhone 15 Pro Max**.
5. Set zoom to **100%**.

---

## Test Scenarios

### 1. Header Verification
- **Steps**:
    1. Navigate to the dashboard.
    2. Ensure the device is in portrait mode.
- **Expected Result**:
    - The Header should be taller than usual.
    - The content (Logo, Search, Profile) should be pushed down, starting *below* the system notch area.
    - Check that no text is cut off or overlapping with the status bar.

### 2. Sidebar Verification
- **Steps**:
    1. Click the Hamburger menu to open the Sidebar.
- **Expected Result**:
    - The Sidebar logo should be pushed down by the safe area.
    - The navigation items should be clearly visible.
    - The "User Profile" section at the bottom should be *above* the home indicator area (bottom safe area).

### 3. Login Page Verification
- **Steps**:
    1. Log out or navigate to `/login`.
- **Expected Result**:
    - The background gradient should cover the entire screen (`viewport-fit=cover`).
    - The login card should be centered and not overlapping with the notch or home indicator.
    - In small mobile viewports (e.g., iPhone SE), the padding should include the safe area.

### 4. AI Chatbot (FAB & Drawer) Verification
- **Steps**:
    1. Navigate to any page where the AIChatbot button is visible.
    2. Click the AIChatbot button to open the chat window.
- **Expected Result**:
    - The floating action button (FAB) should be positioned *above* the home indicator.
    - When the drawer is open, the input area and any action buttons should have extra bottom padding to clear the home indicator.

### 5. Landscape Mode Verification
- **Steps**:
    1. Rotate the device to landscape mode in DevTools.
- **Expected Result**:
    - Content in `.page-content` should have side paddings to avoid being cut off by the notch (if applicable on the sides).
    - The Header should maintain side paddings.

---

## Verdict Check
- [ ] Header content visible and correctly padded?
- [ ] Sidebar content visible and correctly padded?
- [ ] Login page content centered and padded?
- [ ] AIChatbot FAB and Input padded?
- [ ] No overlaps with system UI in portrait or landscape?
