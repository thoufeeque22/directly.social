# Manual Test: Multi-Provider AI Strategy

**Issue**: #373
**Objective**: Verify that the unified AI provider layer correctly routes requests to Gemini, Groq, or Ollama, and that the automatic fallback chain works as expected.

## Prerequisites
1. Application running locally (`npm run dev`).
2. Valid API keys configured in `.env`:
   - `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
   - `GROQ_API_KEY`
   - Ollama running locally on port 11434 (optional for fallback testing).
3. Authenticated user session.

## Test Cases

### 1. Default Provider (Gemini)
**Steps:**
1. Set `ACTIVE_AI_PROVIDER=gemini` in `.env` (or leave unset, as Gemini is the default).
2. Upload a video and trigger AI metadata generation (Generate mode, any platform).
3. Observe the server logs.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: gemini`
- Server logs show: `AI generation succeeded with provider: gemini`
- Generated title, description, and 5 hashtags are returned correctly.

### 2. Groq Provider
**Steps:**
1. Set `ACTIVE_AI_PROVIDER=groq` in `.env`.
2. Restart the dev server (`npm run dev`).
3. Trigger AI metadata generation.
4. Observe the server logs.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: groq`
- Response should be noticeably faster than Gemini (Groq specializes in low-latency inference).
- Output format (title, description, hashtags) matches exactly.

### 3. Ollama Local Fallback
**Steps:**
1. Set `ACTIVE_AI_PROVIDER=ollama` in `.env`.
2. Ensure Ollama is running locally (`ollama serve`).
3. Restart the dev server and trigger AI generation.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: ollama`
- Generation completes using the local model.

### 4. Automatic Fallback Chain
**Steps:**
1. Set `ACTIVE_AI_PROVIDER=gemini` in `.env`.
2. Temporarily set `GEMINI_API_KEY=invalid-key` to force Gemini failure.
3. Ensure `GROQ_API_KEY` is valid.
4. Trigger AI generation.
**Expected Results:**
- Server logs show: `Attempting AI generation with provider: gemini`
- Server logs show: `AI Provider 'gemini' failed: ...`
- Server logs show: `Attempting AI generation with provider: groq`
- Server logs show: `AI generation succeeded with provider: groq`
- The user receives valid output without seeing any error.

### 5. AI Chat Assistant
**Steps:**
1. Open the AI Chat assistant in the app.
2. Ask "What posts do I have scheduled?"
3. Observe the response.
**Expected Results:**
- The chat uses the provider specified by `ACTIVE_AI_PROVIDER`.
- Tool calls (list_upcoming_posts) execute correctly.
- A natural language summary is returned.
