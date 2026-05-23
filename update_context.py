import json
import datetime

# Read the file
with open('.gemini_agent_context.json', 'r') as f:
    data = json.load(f)

# Update root keys
data['last_agent'] = 'qa-agent'
data['next_agent'] = 'dev-agent'

# Create/Update round-4 qa-agent entry
if 'round-4' not in data:
    data['round-4'] = {}

data['round-4']['qa-agent'] = {
    "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "qa_verdict": "FAIL",
    "failure_details": "Playwright E2E tests failed with 14 failures. While 'polish-with-ai-button' tests passed, systemic regressions were observed across several modules (AI Chatbot, Schedule Navigation, Global Search, Analytics). Errors included 429 Too Many Requests, timeouts, and element visibility issues indicating broken data-seeding or race conditions despite the full project re-seed.",
    "expected_output": {
        "commands": ["npx playwright test"],
        "success_indicators": ["Zero failing E2E tests.", "Clean console output (no hydration warnings or 4xx/5xx)."]
    }
}

# Write back
with open('.gemini_agent_context.json', 'w') as f:
    json.dump(data, f, indent=2)
