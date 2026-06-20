import fs from 'fs';
import path from 'path';

const STATE_DIR = '.agents/state';
const ARCHIVE_DIR = path.join(STATE_DIR, 'archive');
const MAX_LINES = 100;
const MAX_ROUNDS = 3;

/**
 * Prunes a single state file if it exceeds thresholds.
 */
async function pruneFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const roundCount = (content.match(/^# Round \d+/gm) || []).length;

  if (lines.length > MAX_LINES || roundCount > MAX_ROUNDS) {
    console.log(`Pruning ${filePath} (Lines: ${lines.length}, Rounds: ${roundCount})`);

    // Create archive
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath);
    const archivePath = path.join(ARCHIVE_DIR, fileName.replace('.md', `-${timestamp}.md`));
    
    fs.writeFileSync(archivePath, content);
    console.log(`Archived to ${archivePath}`);

    // Extract frontmatter and metadata
    const frontmatterEnd = content.indexOf('---', 4) + 3;
    const frontmatter = content.substring(0, frontmatterEnd);
    
    const metadataEnd = content.indexOf('# Round', frontmatterEnd);
    const metadata = content.substring(frontmatterEnd, metadataEnd > -1 ? metadataEnd : content.length);

    // Construct pruned state with summary
    const summaryHeader = `\n# 📊 Summary (Archived Rounds 1-${roundCount})\n- **Key Decisions**: Extracted to ${path.basename(archivePath)}\n- **Verification Outcomes**: Build/Test results in archive.\n`;
    
    fs.writeFileSync(filePath, frontmatter + metadata + summaryHeader);
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

  const files = fs.readdirSync(STATE_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    await pruneFile(path.join(STATE_DIR, file));
  }
}

main().catch((err) => {
  console.error('Pruning script failed:', err);
  process.exit(1);
});
