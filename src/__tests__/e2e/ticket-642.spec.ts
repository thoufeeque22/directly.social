import { test, expect } from './base-test';

test.describe('Ticket #642: Architectural Separation of Landing Page and Login Page', () => {

  test.describe('Guest User (Unauthenticated)', () => {
    test.use({ authRole: 'none' });

    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('/');
    });

    test('should see the landing page at root (/)', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'The Local-First Creator Studio', level: 1 })).toBeVisible();
      // Should see Get Started button
      await expect(page.locator('header').getByRole('link', { name: 'Get Started' })).toBeVisible();
    });

    test('Header Smart CTAs should point to /login', async ({ page }) => {
      const loginLink = page.locator('header').getByRole('link', { name: 'Login' });
      const getStartedLink = page.locator('header').getByRole('link', { name: 'Get Started' });
      
      await expect(loginLink).toHaveAttribute('href', '/login');
      await expect(getStartedLink).toHaveAttribute('href', '/login');
    });

    test('Hero Smart CTA should point to /login', async ({ page }) => {
      const heroCta = page.getByRole('link', { name: 'Get Started for Free' });
      await expect(heroCta).toHaveAttribute('href', '/login');
    });

    test('Pricing Smart CTA should point to /login', async ({ page }) => {
      // Find the first pricing card button that is not disabled
      const pricingCta = page.locator('button:has-text("Get Started")').first();
      // In our code, pricing CTAs are Links rendered as buttons
      const pricingLink = page.getByRole('link', { name: 'Get Started' }).first();
      await expect(pricingLink).toHaveAttribute('href', '/login');
    });

    test('Login Page should be minimal', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Directly Social', level: 1 })).toBeVisible();
      await expect(page.getByText('Sign in to manage your automated distribution')).toBeVisible();
      
      // Verify that landing page elements are NOT present
      await expect(page.getByText('The SaaS Tax is Over')).not.toBeVisible();
      await expect(page.getByText('Privacy First')).not.toBeVisible();
      await expect(page.getByText('Native Publishing')).not.toBeVisible();
    });
  });

  test.describe('Authenticated User', () => {
    test.use({ authRole: 'tester' });

    test('should see the dashboard at root (/)', async ({ page }) => {
      await page.goto('/');
      // Dashboard usually has "Upload & Automate" heading or similar
      await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible();
      // Should NOT see the Hero heading from landing page
      await expect(page.getByRole('heading', { name: 'The Local-First Creator Studio', level: 1 })).not.toBeVisible();
    });

    test('should see the landing page if navigating to / docs (verified separately)', async ({ page }) => {
        await page.goto('/docs');
        await expect(page.getByRole('heading', { name: 'Help Center & Guides', level: 2 })).toBeVisible();
    });

    test('Landing Page Smart CTAs should show Dashboard for authenticated user', async ({ page }) => {
      // Force navigation to landing page components if we can, 
      // but usually authenticated users seeing / are seeing dashboard.
      // However, if they go to /docs, they see the LandingHeader.
      await page.goto('/docs');
      
      const dashboardLink = page.locator('header').getByRole('link', { name: 'Dashboard' });
      await expect(dashboardLink).toBeVisible();
      await expect(dashboardLink).toHaveAttribute('href', '/');
    });
  });

  test.describe('Redundancy and Regressions', () => {
    test.use({ authRole: 'none' });

    test('Documentation page should function correctly', async ({ page }) => {
      await page.goto('/docs');
      await expect(page.getByRole('heading', { name: 'Help Center & Guides', level: 2 })).toBeVisible();
      
      // Check for categories
      await expect(page.getByText('Getting Started')).toBeVisible();
      await expect(page.getByText('Configuration (BYOK)')).toBeVisible();
      await expect(page.getByText('Philosophy & Reach')).toBeVisible();
    });
  });
});
