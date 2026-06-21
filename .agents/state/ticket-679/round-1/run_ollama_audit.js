const fs = require('fs');

async function run() {
  const diff = fs.readFileSync('.agents/state/ticket-679/round-1/diff.patch', 'utf8');
  const supportTsx = fs.readFileSync('src/components/settings/SupportForm.tsx', 'utf8');
  const actionTs = fs.readFileSync('src/app/actions/support.ts', 'utf8');

  const systemPrompt = `You are a Senior Security & Performance Auditor.
Your task is to deeply understand the intent and context of the provided code changes and perform a thorough security and performance audit.
Focus on:
1. Security Vulnerabilities: Check for XSS, CSRF, missing authentication, missing authorization, injection flaws, data exposure, rate limiting implementation.
2. Web Vitals / Performance: Check for performance anti-patterns, large bundle sizes, missing use of Server Components where applicable, unnecessary client-side re-renders, and ensure Core Web Vitals (LCP, INP, CLS) are protected.

Provide your verdict as PASS or FAIL.
Format your output exactly as:
# Audit Report
## Verdict: [PASS or FAIL]
## Findings:
- [List findings here]
`;

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma4:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the git diff:\n${diff}\n\nHere is SupportForm.tsx:\n${supportTsx}\n\nHere is support.ts:\n${actionTs}` }
        ],
        stream: false
      })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    fs.writeFileSync('.agents/state/ticket-679/round-1/audit_output.md', data.message.content);
    console.log('Audit completed and saved to audit_output.md');
  } catch (error) {
    console.error('Error calling Ollama:', error);
  }
}

run();
