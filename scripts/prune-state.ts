import fs from 'fs';
import path from 'path';

// TODO: Refactor: logic extraction needed
const STATE_DIR = '.gemini/state';
const ARCHIVE_DIR = path.join(STATE_DIR, 'archive');
const MAX_SIZE_KB = 50;
const MAX_ROUNDS = 3;

/**
 * Prunes a single state file if it exceeds thresholds.
 */
async function pruneFile(filePath: string) {
  const stats = fs.statSync(filePath);
  const fileSizeKB = stats.size / 1024;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error(`Failed to parse ${filePath}:`, e);
    return;
  }

  const rounds = Object.keys(data).filter(key => key.startsWith('round-'));
  const roundCount = rounds.length;

  if (fileSizeKB > MAX_SIZE_KB || roundCount > MAX_ROUNDS) {
    console.log(`Pruning ${filePath} (Size: ${fileSizeKB.toFixed(2)}KB, Rounds: ${roundCount})`);

    // Create archive
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath);
    const archivePath = path.join(ARCHIVE_DIR, fileName.replace('.json', `-${timestamp}.json`));
    
    fs.writeFileSync(archivePath, content);
    console.log(`Archived to ${archivePath}`);

    // Create summary schema as per Ticket 571
    const summary = {
      key_decisions: data.summary?.key_decisions || "Summary extracted from archived rounds.",
      lessons_learned: data.summary?.lessons_learned || "Friction points documented in archive.",
      verification_outcomes: data.summary?.verification_outcomes || "Build/Test results in archive."
    };

    // Construct pruned state
    const prunedData = {
      ticket_id: data.ticket_id,
      branch_name: data.branch_name,
      ticket_goal: data.ticket_goal,
      ticket_description: data.ticket_description,
      acceptance_criteria: data.acceptance_criteria,
      pipeline_config: data.pipeline_config,
      last_agent: data.last_agent,
      next_agent: data.next_agent,
      last_updated_at: new Date().toISOString(),
      summary: summary
    };

    fs.writeFileSync(filePath, JSON.stringify(prunedData, null, 2));
    console.log(`Successfully pruned and summarized ${filePath}`);
  }
}

/**
 * Main execution loop
 */
async function main() {
  if (!fs.existsSync(STATE_DIR)) {
    console.log('No state directory found.');
    return;
  }

  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(STATE_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    await pruneFile(path.join(STATE_DIR, file));
  }
}

main().catch((err) => {
  console.error('Pruning script failed:', err);
  process.exit(1);
});
