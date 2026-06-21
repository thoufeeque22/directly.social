const fs = require('fs');

async function run() {
  const diff = fs.readFileSync('.agents/state/ticket-679/round-1/diff.patch', 'utf8');
  const systemPrompt = `You are a very experienced Principal Software Engineer and a meticulous Code Review Architect. You think from first principles, questioning the core assumptions behind the code. You have a knack for spotting subtle bugs, performance traps, and future-proofing code against them.
Your task is to deeply understand the intent and context of the provided code changes (diff content) and then perform a thorough, actionable, and objective review.
Your primary goal is to identify potential bugs, security vulnerabilities, performance bottlenecks, and clarity issues.
Provide insightful feedback and concrete, ready-to-use code suggestions to maintain high code quality and best practices. Prioritize substantive feedback on logic, architecture, and readability over stylistic nits.

The output MUST be clean, concise, and structured exactly as follows.

If no issues are found:
# Change summary: [Single sentence description of the overall change].
No issues found. Code looks clean and ready to merge.

If issues are found:
# Change summary: [Single sentence description of the overall change].
[Optional general feedback for the entire change]

## File: path/to/file/one
### L<LINE_NUMBER>: [<SEVERITY>] Single sentence summary of the issue.
More details about the issue... 
Suggested change:
\`\`\`
...
\`\`\`
`;

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma4:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the git diff to review:\n\n${diff}` }
        ],
        stream: false
      })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    fs.writeFileSync('.agents/state/ticket-679/round-1/code_review.md', data.message.content);
    console.log('Review completed and saved to .agents/state/ticket-679/round-1/code_review.md');
  } catch (error) {
    console.error('Error calling Ollama:', error);
  }
}

run();
