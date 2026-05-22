import json
from datetime import datetime, timezone

with open('.gemini_agent_context.json', 'r') as f:
    data = json.load(f)

data['last_agent'] = 'qa-agent'
data['last_updated_at'] = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

if 'round-1' not in data:
    data['round-1'] = {}

data['round-1']['qa-agent'] = {
    "timestamp": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
    "qa_verdict": "FAIL",
    "failure_details": "1. Playwright tests capture a React hydration warning ('Warning: Prop `style` did not match.') during component load, caused by `aiTier` changing values between server and client rendering. 2. Several pre-existing/unrelated Playwright tests (e.g. byok/wizard.spec.ts, analytics.spec.ts) are failing with 500 Network errors or layout issues. As per QA rules, these failures prevent a PASS verdict.",
    "expected_output": {
        "commands": [
            "npx playwright test --reporter=list src/__tests__/e2e/polish-with-ai-button.spec.ts"
        ],
        "success_indicators": [
            "The 'Polish with AI' button test passes without hydration warnings.",
            "No React hydration errors occur on page load.",
            "All E2E tests pass with no 500 Network errors."
        ]
    }
}

with open('.gemini_agent_context.json', 'w') as f:
    json.dump(data, f, indent=2)
