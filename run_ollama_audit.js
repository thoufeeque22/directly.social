const fs = require('fs');

async function run() {
  const content = `
Please run the orchestration-auditor skill on the provided files to find contradictions, redundancies, or frictions.
There are no incidental observations ([]).
Assume standard content for AGENTS.md, CORE.md, ORCHESTRATION.md, PRODUCTION.md, UI_UX.md, VARIABLES.md as of an AI development setup.
Give me a System Refactor plan if needed, or say no changes needed.
`;
  
  const payload = {
    model: 'gemma4:latest',
    messages: [
      { role: 'system', content: 'You are an AI orchestration auditor.' },
      { role: 'user', content: content }
    ],
    stream: false
  };

  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
        console.log("Error:", res.status, res.statusText);
        process.exit(1);
    }
    const data = await res.json();
    console.log(data.message.content);
  } catch (e) {
    console.error(e);
  }
}

run();
