import fs from 'fs';
import path from 'path';

const LOG_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), 'logs');
const IS_VERCEL = !!process.env.VERCEL;

type LogScope = 'app' | 'worker' | 'audit' | 'auth';

/**
 * Returns the current date in YYYY-MM-DD format for folder organization.
 */
const getDateFolder = () => new Date().toISOString().split('T')[0];

/**
 * Ensures the target directory exists and appends the message to the scope-specific log file.
 */
const writeToFile = (scope: LogScope, message: string) => {
  if (IS_VERCEL) return;

  const dateDir = path.join(LOG_ROOT, getDateFolder());
  const logFile = path.join(dateDir, `${scope}.log`);

  try {
    // 1. Ensure the daily directory exists
    if (!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir, { recursive: true });
    }
    // 2. Append the message
    fs.appendFileSync(logFile, message);
  } catch (err) {
    console.error(`❌ [LOGGER] Failed to write to ${scope}.log:`, err);
  }
};

export const createLogger = (defaultScope: LogScope = 'app') => ({
  info: (message: string, ...args: unknown[]) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [INFO] ${message} ${args.length ? JSON.stringify(args) : ''}\n`;
    
    console.log(`[INFO] ${message}`, ...args);
    writeToFile(defaultScope, formattedMessage);
  },

  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    const errorDetail = error instanceof Error ? error.stack : JSON.stringify(error);
    const formattedMessage = `[${timestamp}] [ERROR] ${message} | Detail: ${errorDetail}\n`;
    
    console.error(`❌ [ERROR] ${message}`, error);
    writeToFile(defaultScope, formattedMessage);
  },

  warn: (message: string, ...args: unknown[]) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [WARN] ${message} ${args.length ? JSON.stringify(args) : ''}\n`;
    
    console.warn(`⚠️ [WARN] ${message}`, ...args);
    writeToFile(defaultScope, formattedMessage);
  }
});

// Default shared logger
export const logger = createLogger('app');

// Specialized loggers
export const workerLogger = createLogger('worker');
export const auditLogger = createLogger('audit');
export const authLogger = createLogger('auth');
