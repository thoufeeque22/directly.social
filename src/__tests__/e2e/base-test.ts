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
          errors.push(`Console error: ${msg.text()}`);
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
