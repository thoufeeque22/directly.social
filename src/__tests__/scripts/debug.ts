import { test, expect } from '@playwright/test';
import { prisma } from '@/lib/core/prisma';

test('Run and catch error', async ({ page }) => {
  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

  await page.goto('/');
  // we are assuming we are logged in, but we need to log in first.
  // Actually, I can just write a unit test or integration test for `updateAiConsent` directly!
});
