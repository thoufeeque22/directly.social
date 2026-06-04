import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Notebook Bundle Script
 * Packages project documentation and core context for NotebookLM synthesis.
 * Includes a basic PII/Secret scanner for safety.
 */

const BUNDLE_MANIFEST = [
  'docs/**/*',
  'GEMINI.md',
  '.gemini/base/*.md',
  'prisma/schema.prisma',
  'package.json',
];

const OUTPUT_DIR = path.join(process.cwd(), 'tmp/notebook-upload');

const SECRET_PATTERNS = [
  /API_KEY\s*=\s*['"][^'"]+['"]/gi,
  /_SECRET\s*=\s*['"][^'"]+['"]/gi,
  /DATABASE_URL\s*=\s*['"][^'"]+['"]/gi,
  /PASSWORD\s*=\s*['"][^'"]+['"]/gi,
  /sk-[a-zA-Z0-9]{20,}/g, // OpenAI/similar
  /ghp_[a-zA-Z0-9]{36,}/g, // GitHub
  /[a-zA-Z0-9._%+-]+@(?!(directly\.(ai|app)|example\.com|localhost))[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, // PII Email
];

function scanForSecrets(content: string, filePath: string): void {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`\x1b[31mERROR: Potential secret or PII detected in ${filePath}!\x1b[0m`);
      console.error(`Pattern match: ${pattern.source}`);
      console.error('Bundling halted for safety. Please redact secrets before packaging.');
      process.exit(1);
    }
  }
}

function ensureDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

async function bundle(): Promise<void> {
  console.log('📦 Starting Notebook Bundle process...');
  ensureDir(OUTPUT_DIR);

  let fileCount = 0;

  for (const pattern of BUNDLE_MANIFEST) {
    const files = glob.sync(pattern, { nodir: true });
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      scanForSecrets(content, file);

      // Flatten name with prefix
      // e.g., docs/architecture/OVERVIEW.md -> docs__architecture__OVERVIEW.md
      const flattenedName = file.replace(/\//g, '__');
      const destPath = path.join(OUTPUT_DIR, flattenedName);

      fs.copyFileSync(file, destPath);
      fileCount++;
    }
  }

  console.log(`\x1b[32m✅ Successfully bundled ${fileCount} files into ${OUTPUT_DIR}\x1b[0m`);
}

bundle().catch((err) => {
  console.error('Failed to bundle:', err);
  process.exit(1);
});
