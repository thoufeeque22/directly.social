# Manual Test: Multi-Provider AI Strategy

**Issue**: #373, #369
**Objective**: Verify that the unified AI provider layer correctly routes requests to Gemini, Groq, or Ollama, respects user UI selection, and persists preferences across sessions.

## Prerequisites
1. Application running locally (`npm run dev`).
2. Valid API keys configured in `.env` or via BYOK Settings:
   - `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
   - `GROQ_API_KEY`
   - Ollama running locally on port 11434 (optional for fallback testing).
3. Authenticated user session.

## Test Cases

### 1. UI Selection & Persistence
**Steps:**
1. Navigate to the Dashboard.
2. In the Upload Form, select **Enrich** or **Generate** strategy.
3. Observe the new **AI Provider** selector.
4. Select a different provider (e.g., **Groq**).
5. Refresh the page.
6. Observe the selected strategy and provider.
**Expected Results:**
- The selected strategy and provider remain selected after page refresh (persisted via `localStorage` and DB).
- Switching devices (or logging out and back in) preserves the preferences (persisted via DB).

### 2. Execution with Selected Provider
**Steps:**
1. Select **Groq** as the AI Provider in the UI.
2. Upload a video and trigger AI metadata generation.
3. Observe the server logs.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: groq` (even if `ACTIVE_AI_PROVIDER` in `.env` is set to gemini).
- AI generation succeeds using the user's selected provider.

### 3. Automatic Fallback Chain (Respecting Primary)
**Steps:**
1. Select **Gemini** in the UI.
2. Temporarily invalidate your Gemini key (if using BYOK) or ensure the system key is invalid.
3. Ensure **Groq** is available.
4. Trigger AI generation.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: gemini`
- Server logs show: `AI Provider 'gemini' failed: ...`
- Server logs show: `Attempting AI generation with provider: groq`
- Generation succeeds via the fallback chain.
