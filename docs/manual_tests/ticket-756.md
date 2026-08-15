# Manual Test Script: Ticket #756 - Demo Video Onboarding Flow

## Scenario 1: Happy Path - Demo Mode Activation & Export
1. Go to Dashboard (empty state).
2. Click "Try a Demo Video".
   - Expected: Video stages, "Upload Your Video" transition button is visible.
3. Click "Export".
   - Expected: Video downloads with directly.social watermark.

## Scenario 2: Transition out of Demo Mode
1. While in Demo Mode, click "Upload Your Video".
   - Expected: Demo state clears, returning to empty state.

## Scenario 3: Negative Path - Real Uploads
1. Upload a real video via "Browse".
   - Expected: "Upload Your Video" transition button is NOT visible. Export doesn't have demo watermark.
