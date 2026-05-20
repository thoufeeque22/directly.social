# AI BYOK (Bring Your Own Key) Manual Test

## Prerequisites
1. User has a valid account and is logged in.
2. User has a valid, funded API key for at least one of the supported providers (OpenAI, Anthropic, Google Gemini, Groq).

## Test Scenario: Adding and Using a BYOK

### Step 1: Navigate to AI Settings
1. Go to **Settings** from the sidebar.
2. Click on the **BYOK** tab.
3. Verify the "AI Provider Keys (BYOK)" wizard is visible.

### Step 2: Validate a Custom Key
1. Select **OpenAI** from the Provider dropdown.
2. Select **GPT-4o Mini** from the Preferred Model dropdown.
3. Enter your valid OpenAI API key.
4. Click **Validate & Save Key**.
5. **Expected Result**: 
   - A loading spinner should appear.
   - The UI should display a green success alert indicating the key was saved and validated.
   - The saved key should appear in the "Saved Keys" list below, showing the last 4 digits of the key.

### Step 3: Test Generation with BYOK
1. Go to the **Upload** page.
2. Upload a video and proceed to the AI generation step.
3. Ensure AI Generation is set to **Generate** or **Enrich**.
4. Trigger generation.
5. **Expected Result**: 
   - Generation should complete successfully.
   - (Verification for admins/devs: Check network logs to ensure the `/api/chat` or `/api/upload/init` payload includes the `byokConfigs` with your custom key).

### Step 4: Handle Invalid Keys
1. Go back to the **Settings > BYOK** page.
2. Select **Anthropic** from the Provider dropdown.
3. Enter an invalid API key (`sk-ant-invalid123`).
4. Click **Validate & Save Key**.
5. **Expected Result**:
   - The UI should display a red error alert indicating validation failed.
   - The key should NOT be saved in the "Saved Keys" list.

### Step 5: Removing a Key
1. In the **Saved Keys** list, locate the OpenAI key you added in Step 2.
2. Click the trash can (Delete) icon next to it.
3. **Expected Result**:
   - The key should be removed from the list immediately.
   - Navigating away and back to the page should confirm the key is gone (cleared from LocalStorage).
