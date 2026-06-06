import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const test = base.extend<{ 
  consoleChecker: void; 
  workerEmail: string; 
  adminEmail: string; 
  workerIndex: number;
  authRole: 'tester' | 'admin' | 'none';
}>({
  // Default values for our custom options
  authRole: ['tester', { option: true }],

  // Worker index fixture
  workerIndex: async ({}, use, testInfo) => {
    await use(testInfo.workerIndex);
  },

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

  // Automatic storage state selection based on worker index (Lazy Authentication)
  storageState: async ({ browser, authRole }, use, testInfo) => {
    // 1. Handle 'none' or unauthenticated projects
    if (authRole === 'none' || testInfo.project.name === 'landing-page') {
      console.log(`[Worker ${testInfo.workerIndex}] 🟢 Using unauthenticated state (authRole: ${authRole})`);
      await use({ cookies: [], origins: [] });
      return;
    }

    const workerIndex = testInfo.workerIndex;
    const prefix = authRole === 'admin' ? 'admin' : 'tester';
    const authFile = `.auth/v2-${prefix}-${workerIndex % 10}.json`;
    const fullPath = path.resolve(process.cwd(), authFile);

    // 2. Perform lazy login if file doesn't exist
    if (!fs.existsSync(fullPath)) {
      console.log(`[Worker ${workerIndex}] 🔑 Performing lazy login for ${prefix}-${workerIndex % 10}...`);
      
      const testEmail = `${prefix}-${workerIndex % 10}@directly.social`;
      const roleArg = prefix === 'admin' ? 'ADMIN' : 'USER';
      
      // Perform lazy seeding before logging in
      console.log(`[Worker ${workerIndex}] 🌱 Lazy seeding DB for ${testEmail}...`);
      require('child_process').execSync(`npx tsx src/__tests__/scripts/seed-e2e-user.ts ${testEmail} ${roleArg}`, { stdio: 'inherit' });
      if (prefix === 'tester') {
        require('child_process').execSync(`npx tsx src/__tests__/scripts/seed-e2e-schedule.ts ${testEmail}`, { stdio: 'inherit' });
      }
      
      const baseURL = testInfo.project.use.baseURL || 'http://localhost:3005';
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();
      const testPassword = process.env.E2E_TEST_PASSWORD || 'password';

      try {
        await page.goto('/login');
        await page.getByTestId('e2e-email-input').fill(testEmail);
        await page.getByTestId('e2e-password-input').fill(testPassword);
        
        await page.waitForTimeout(2000); // Wait for NextAuth CSRF token to initialize
        
        let loggedIn = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
          await page.getByTestId('e2e-login-submit').click();
          try {
            await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 15000 });
            loggedIn = true;
            break;
          } catch (e) {
            console.warn(`[Worker ${workerIndex}] ⚠️ Login attempt ${attempt} timed out for ${testEmail}, retrying...`);
          }
        }
        
        if (!loggedIn) {
          throw new Error(`Lazy login failed for ${testEmail} after retries.`);
        }
        
        if (!fs.existsSync('.auth')) fs.mkdirSync('.auth', { recursive: true });
        await context.storageState({ path: fullPath });
        console.log(`[Worker ${workerIndex}] ✅ Authentication successful for ${testEmail}`);
        
        if (workerIndex === 0) {
          await context.storageState({ path: path.join('.auth', `${prefix}.json`) });
        }
      } catch (error) {
        console.error(`[Worker ${workerIndex}] ❌ Lazy login failed for ${testEmail}:`, error);
        throw error;
      } finally {
        await context.close();
      }
    } else {
      console.log(`[Worker ${workerIndex}] 🏎️ Using existing auth state: ${authFile}`);
    }

    await use(authFile);
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
          if (text.includes('Failed to load resource: net::ERR_NAME_NOT_RESOLVED')) return;
          if (text.includes('A server with the specified hostname could not be found')) return;
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
