import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ consoleChecker: void; workerEmail: string }>({
  // Unique email for this worker
  workerEmail: async ({}, use, testInfo) => {
    const workerIndex = testInfo.workerIndex;
    await use(`tester-${workerIndex % 10}@directly.social`);
  },

  // Unique admin email for this worker
  adminEmail: async ({}, use, testInfo) => {
    const workerIndex = testInfo.workerIndex;
    await use(`admin-${workerIndex % 10}@directly.social`);
  },

  // Automatic storage state selection based on worker index
  storageState: async ({}, use, testInfo) => {
    // If we're in a setup project or similar, we might not want this
    const isSetup = testInfo.project.name === 'setup' || testInfo.project.name === 'landing-page';
    if (isSetup) {
      // Landing page specifically wants no auth
      if (testInfo.project.name === 'landing-page') {
        await use({ cookies: [], origins: [] });
      } else {
        await use(undefined);
      }
      return;
    }

    const workerIndex = testInfo.workerIndex;
    const authFile = `.auth/user-${workerIndex % 10}.json`;
    
    // Check if file exists, fallback to user.json if not
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.resolve(process.cwd(), authFile);
    
    if (fs.existsSync(fullPath)) {
      console.log(`[Worker ${workerIndex}] Using auth state: ${authFile}`);
      await use(authFile);
    } else {
      console.warn(`[Worker ${workerIndex}] Auth state NOT FOUND: ${authFile}. Falling back to .auth/user.json`);
      await use('.auth/user.json');
    }
  },

  consoleChecker: [
    async ({ page }, use) => {
      const errors: string[] = [];

      // Catch unhandled exceptions (crashes)
      page.on('pageerror', exception => {
        const msg = exception.message;
        // Ignore environment-specific noise
        if (msg.includes('access control checks')) return;
        if (msg.includes('ChunkLoadError')) return;
        if (msg.includes('TypeError: Load failed')) return;
        if (msg.includes('Intentional Render Error')) return;
        if (msg === 'null') return;
        
        errors.push(`Unhandled exception: ${msg}`);
      });

      // Catch console.error logs (React hydration errors, warnings, etc.)
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore known noise
          if (text.includes('429') || text.includes('Too Many Requests')) return;
          if (text.includes('Failed to load resource: the server responded with a status of 429')) return;
          if (text.includes('Failed to load resource: the server responded with a status of 404')) return;
          if (text.includes('Failed to load resource: the server responded with a status of 500')) return;
          if (text.includes('Failed to load resource: the server responded with a status of 503')) return;
          if (text.includes('Service Unavailable')) return;
          if (text.includes('Internal Server Error')) return;
          if (text.includes('Failed to fetch')) return;
          if (text.includes('authjs.dev')) return;
          if (text.includes('Load failed')) return;
          if (text.includes('Button failed to load')) return;
          if (text.includes('Intentional Render Error')) return;
          if (text === 'null') return;
          
          errors.push(`Console error: ${text}`);
        }
      });

      await use();

      if (errors.length > 0) {
        throw new Error(`Test failed due to runtime errors:\n${errors.join('\n')}`);
      }
    },
    { auto: true } // This ensures the fixture is run for every test automatically
  ],
});

export { expect };
