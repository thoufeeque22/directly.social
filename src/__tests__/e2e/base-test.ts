import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ consoleChecker: void }>({
  consoleChecker: [
    async ({ page }, use) => {
      const errors: string[] = [];

      // Catch unhandled exceptions (crashes)
      page.on('pageerror', exception => {
        errors.push(`Unhandled exception: ${exception.message}`);
      });

      // Catch console.error logs (React hydration errors, warnings, etc.)
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore known noise
          if (text.includes('429') || text.includes('Too Many Requests')) return;
          if (text.includes('Failed to load resource: the server responded with a status of 429')) return;
          
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
