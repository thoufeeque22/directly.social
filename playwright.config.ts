import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  testDir: './src/__tests__/e2e',
  globalSetup: './src/__tests__/e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 8,
  reporter: [['html', { open: 'never' }]],
  snapshotDir: 'docs/visual/goldens',
  use: {
    baseURL: 'http://127.0.0.1:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
    },
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/, use: { launchOptions: { slowMo: 0 } } },
    {
      name: 'landing-page',
      testMatch: /landing-page\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run build && npm run start -- -p 3005',
    env: {
      NEXT_DIST_DIR: '.next-e2e',
      NEXT_PUBLIC_E2E: 'true',
      NEXT_RUNTIME: 'nodejs',
      NEXTAUTH_URL: 'http://127.0.0.1:3005',
      AUTH_URL: 'http://127.0.0.1:3005',
      UPLOAD_TEMP_DIR: './tmp/e2e',
      E2E_TEST_PASSWORD: process.env.E2E_TEST_PASSWORD || 'password',
      NEXT_PUBLIC_SENTRY_DSN: '',
      DEBUG: 'prisma:client:pool',
      TEST_WORKER_INDEX: '0',
    },
    url: 'http://127.0.0.1:3005',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 600 * 1000,
  },
});
