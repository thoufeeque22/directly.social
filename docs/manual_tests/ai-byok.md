# AI BYOK (Bring Your Own Key) Manual Test

## Prerequisites
1. User has a valid account and is logged in.
2. User has a valid, funded API key for at least one of the supported providers:
   - **OpenAI**
   - **Anthropic**
   - **Google Gemini**
   - **Groq**

## Test Scenario: Adding and Using a BYOK

### Step 1: Navigate to AI Settings
1. Go to **Settings** from the sidebar.
2. Click on the **BYOK / AI** tab.
3. Verify the "AI Provider Keys (BYOK)" section is visible within the "AI Providers" card.

### Step 2: Validate and Save Keys (Repeat for each available provider)
1. **OpenAI**:
   - Select **OpenAI** from the Provider dropdown.
   - Select **GPT-5.5** from the Preferred Model dropdown.
   - Enter a valid OpenAI API key.
   - Click **Validate & Save Key**.
2. **Anthropic**:
   - Select **Anthropic** from the Provider dropdown.
   - Select **Claude 4.6 Sonnet** from the Preferred Model dropdown.
   - Enter a valid Anthropic API key.
   - Click **Validate & Save Key**.
3. **Google Gemini**:
   - Select **Google Gemini** from the Provider dropdown.
   - Select **Gemini 3.5 Pro** from the Preferred Model dropdown.
   - Enter a valid Gemini API key.
   - Click **Validate & Save Key**.
4. **Groq**:
   - Select **Groq** from the Provider dropdown.
   - Select **Llama 4 Maverick (17B)** from the Preferred Model dropdown.
   - Enter a valid Groq API key.
   - Click **Validate & Save Key**.

**Expected Results for each**:
- A loading spinner should appear.
- The UI should display a green success alert indicating the key was saved and validated.
- The saved key should appear in the "Saved Keys" list below, showing the provider name and the last 4 digits of the key.

### Step 3: Test Generation with BYOK
1. Go to the **Launch** or **Schedule** page.
2. Select a video and proceed to the AI metadata generation step.
3. Trigger generation.
4. **Expected Result**: 
   - Generation should complete successfully using the user's provided key.
   - (Verification for admins/devs: Check network logs or server logs to ensure the request context includes the `byokConfigs` for the active provider).

### Step 4: Handle Invalid Keys
1. Go back to **Settings > BYOK / AI**.
2. Select any provider.
3. Enter an intentionally invalid API key (e.g., `sk-invalid-12345`).
4. Click **Validate & Save Key**.
5. **Expected Result**:
   - The UI should display a red error alert indicating validation failed.
   - The key should NOT be saved in the "Saved Keys" list.

### Step 5: Removing a Key
1. In the **Saved Keys** list, locate a previously saved key.
2. Click the trash can (Delete) icon next to it.
3. **Expected Result**:
   - The key should be removed from the list immediately.
   - Refreshing the page should confirm the key is gone (cleared from browser LocalStorage).
