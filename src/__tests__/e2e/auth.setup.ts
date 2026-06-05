import { test as setup, expect } from './base-test';;
import fs from 'fs';
import path from 'path';

const authDir = '.auth';

setup('authenticate all workers', async ({ browser }) => {
  // Increase timeout for this heavy setup
  setup.slow(); 
  
  console.log('[E2E Setup] Starting multi-user authentication...');
  
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  const numTesters = 10;
  const testPassword = process.env.E2E_TEST_PASSWORD || 'password';

  // Helper to authenticate a single user
  const authenticateUser = async (email: string, targetFile: string) => {
    console.log(`[E2E Setup] Authenticating ${email}...`);
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto('/login');
      const emailInput = page.getByTestId('e2e-email-input');
      await expect(emailInput).toBeVisible({ timeout: 15000 });
      
      await emailInput.fill(email);
      await page.getByTestId('e2e-password-input').fill(testPassword);
      await page.getByTestId('e2e-login-submit').click();

      // Wait for redirect to dashboard
      await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 25000 });
      
      await context.storageState({ path: targetFile });
      console.log(`[E2E Setup] Success: ${email} -> ${targetFile}`);
    } finally {
      await context.close();
    }
  };

  // Authenticate Testers
  for (let i = 0; i < numTesters; i++) {
    const testEmail = `tester-${i}@directly.social`;
    const authFile = path.join(authDir, `user-${i}.json`);
    await authenticateUser(testEmail, authFile);
  }

  // Authenticate Admins
  console.log('[E2E Setup] Authenticating admins...');
  for (let i = 0; i < 10; i++) {
    const adminEmail = `admin-${i}@directly.social`;
    const adminAuthFile = path.join(authDir, `admin-${i}.json`);
    await authenticateUser(adminEmail, adminAuthFile);
  }

  // Save legacy fallbacks
  await authenticateUser('admin@directly.social', path.join(authDir, 'admin.json'));
  await authenticateUser('tester@directly.social', path.join(authDir, 'user.json'));
  
  console.log('[E2E Setup] All worker users and admins authenticated successfully.');
});
