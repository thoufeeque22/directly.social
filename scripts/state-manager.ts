/* eslint-disable max-lines */
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

/**
 * State Manager Script
 * Handles updates to MAIN.md and agent-specific markdown files in the ticket state directory.
 * 
 * Usage: 
 * npm run state:update -- --agent=<agent> --verdict=<verdict> --summary="<summary>" [--content="<content>"] [--file=<path_to_content_file>] [--status=<status>] [--ticket=<id>] [--round=<N>]
 */

async function run() {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      if (args[i].includes('=')) {
        const parts = args[i].split('=');
        const key = parts[0].slice(2);
        const value = parts.slice(1).join('=');
        params[key] = value;
      } else {
        const key = args[i].slice(2);
        const value = args[i + 1];
        if (value && !value.startsWith('--')) {
          params[key] = value;
          i++;
        } else {
          params[key] = 'true';
        }
      }
    }
  }

  const agent = params.agent;
  const verdict = params.verdict;
  const summary = params.summary;
  let content = params.content;
  const contentFile = params.file;
  let ticketId = params.ticket;
  const newStatus = params.status;
  const targetRound = params.round;

  if (!agent || !verdict || !summary) {
    console.error("❌ Usage: npm run state:update -- --agent=<agent> --verdict=<verdict> --summary=\"<summary>\" [--content=\"<content>\" | --file=<path>] [--status=<status>] [--ticket=<id>] [--round=<N>]");
    process.exit(1);
  }

  // Read content from file if provided
  if (contentFile) {
    try {
      content = await fs.readFile(contentFile, 'utf-8');
    } catch {
      console.error(`❌ Could not read content file: ${contentFile}`);
      process.exit(1);
    }
  }

  if (!ticketId) {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim();
      const match = branch.match(/feature\/(\d+)/) || branch.match(/ticket\/(\d+)/) || branch.match(/^(\d+)-/);
      if (match) ticketId = match[1];
    } catch {
      // Ignored
    }
  }

  if (!ticketId) {
    console.error("❌ Could not infer ticket ID from branch. Please pass --ticket=<id> explicitly.");
    process.exit(1);
  }

  const stateDir = path.join(process.cwd(), '.agents', 'state', `ticket-${ticketId}`);
  await fs.mkdir(stateDir, { recursive: true });

  const mainMdPath = path.join(stateDir, 'MAIN.md');
  let currentRound = 1;
  let mainMdContent = '';

  try {
    mainMdContent = await fs.readFile(mainMdPath, 'utf-8');
    const roundMatch = mainMdContent.match(/current_round:\s*(\d+)/);
    if (roundMatch) {
      currentRound = parseInt(roundMatch[1], 10);
    }
    
    // Explicit round override
    if (targetRound) {
      currentRound = parseInt(targetRound, 10);
      mainMdContent = mainMdContent.replace(/current_round:\s*\d+/, `current_round: ${currentRound}`);
    }

    if (newStatus) {
      mainMdContent = mainMdContent.replace(/status:\s*[a-zA-Z0-9_-]+/, `status: ${newStatus}`);
      mainMdContent = mainMdContent.replace(/- \*\*Current Status\*\*:.*$/m, `- **Current Status**: ${newStatus}`);
    }
  } catch {
    // MAIN.md doesn't exist, create it
    const roundToUse = targetRound ? parseInt(targetRound, 10) : 1;
    mainMdContent = `---
ticket_id: ${ticketId}
branch_name: feature/${ticketId}
goal: Auto-generated state file
status: ${newStatus || 'in-progress'}
current_round: ${roundToUse}
---

# 📋 Ticket Metadata
- **ID**: ${ticketId}
- **Branch**: feature/${ticketId}
- **Goal**: Auto-generated state file
- **Current Status**: ${newStatus || 'in-progress'}

# 🔄 Round History
- **Round ${roundToUse}**: [IN-PROGRESS]

# 📅 Timeline
`;
    currentRound = roundToUse;
  }

  // Format Date: YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  
  // Use a clean summary for the timeline (first line only or truncated)
  const timelineSummary = summary.split('\n')[0].slice(0, 200);
  const timelineEntry = `- **[${formattedDate}]**: ${agent.toUpperCase()} [${verdict}] - ${timelineSummary}\n`;
  
  if (!mainMdContent.includes('# 📅 Timeline')) {
    mainMdContent += '\n# 📅 Timeline\n';
  }
  
  if (mainMdContent.endsWith('\n')) {
    mainMdContent += timelineEntry;
  } else {
    mainMdContent += '\n' + timelineEntry;
  }
  
  await fs.writeFile(mainMdPath, mainMdContent, 'utf-8');

  // Write to agent file
  const roundDir = path.join(stateDir, `round-${currentRound}`);
  await fs.mkdir(roundDir, { recursive: true });

  const fileMap: Record<string, string> = {
    'product': 'product.md',
    'discovery': 'discovery.md',
    'dev': 'development.md',
    'review': 'review.md',
    'qa': 'qa.md',
    'doc': 'documentation.md',
    'project': 'project.md'
  };

  const fileName = fileMap[agent.toLowerCase()] || `${agent.toLowerCase()}.md`;
  const agentFilePath = path.join(roundDir, fileName);

  const finalContent = content || summary;
  const agentEntry = `\n## [${formattedDate}] Verdict: ${verdict}\n${finalContent}\n`;
  await fs.appendFile(agentFilePath, agentEntry, 'utf-8');

  console.log(`✅ State updated successfully for Ticket #${ticketId} (Round ${currentRound})`);

  // Auto-commit state changes
  try {
    console.log(`📦 Auto-committing state changes...`);
    execSync(`git add "${stateDir}"`, { stdio: 'inherit' });
    const commitMsg = `chore(state): [ticket-${ticketId}] ${agent} verdict ${verdict}`;
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
    console.log(`✅ State changes committed.`);
  } catch (e) {
    console.error(`⚠️ Failed to auto-commit state changes. They remain staged or untracked.`, (e as Error).message);
  }
}

run().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
