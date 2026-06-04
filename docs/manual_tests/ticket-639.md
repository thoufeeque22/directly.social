# Manual Test Script: Ticket #639 - Login Screen Theme Alignment

## Overview
**Ticket ID**: #639
**Goal**: Verify that the login screen is fully theme-aware, spans the full viewport width, and is free of visual 'split' artifacts in both light and dark modes.

## Prerequisites
- Access to the application in a browser.
- Browser DevTools available for theme switching emulation.

## Test Scenarios

### 1. Theme Awareness (Light Mode)
- **Steps**:
    1. Open the browser and navigate to the login page (`/login`).
    2. Ensure the system/browser is set to **Light Mode**.
    3. Observe the background color of the login screen.
- **Expected Result**: 
    - The background should be a consistent light color (defined by `hsl(var(--background))`).
    - There should be no "dark on left, light on right" split artifacts.
    - All text and icons should be clearly visible with appropriate contrast.

### 2. Theme Awareness (Dark Mode)
- **Steps**:
    1. While on the login page (`/login`), switch the system/browser to **Dark Mode**.
    2. Observe the background color transition.
- **Expected Result**:
    - The background should transition to a consistent dark color (defined by `hsl(var(--background))`).
    - The transition should be smooth and apply to the entire viewport.
    - There should be no remaining light artifacts or "split" backgrounds.
    - All text and icons should be clearly visible with appropriate contrast.

### 3. Layout Integrity (Viewport Spanning)
- **Steps**:
    1. Resize the browser window to various dimensions (Mobile, Tablet, Desktop).
    2. Observe the background container.
- **Expected Result**:
    - The background container should always span the full width and height of the viewport.
    - No scrollbars should appear unless the content exceeds the viewport height (e.g., on very small mobile screens).
    - The login card and feature section should be correctly centered or stacked as per the responsive design.

### 4. Native Bridge Verification (Optional/Mobile)
- **Steps**:
    1. Open the login page on a mobile device or emulator.
    2. Click on any login provider.
- **Expected Result**:
    - The "Unified Identity Check" modal should appear if on web.
    - If in a native wrapper context, it should trigger the bridge logic (observable via logs if debugging).
    - The modal should also be theme-aware.

## Verdict Criteria
- **PASS**: All scenarios meet the expected results. The background is uniform and responds correctly to theme changes.
- **FAIL**: Any scenario shows a "split" background, hardcoded colors that don't match the theme, or layout shifts that break the full-viewport requirement.
