import { test, expect } from './base-test';

test.describe('Technical SEO - Advanced (Ticket 687)', () => {
  test('robots.txt contains correct directives', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    
    // Check allow rules
    expect(text).toContain('Allow: /');
    
    // Check disallow rules
    expect(text).toContain('Disallow: /admin');
    expect(text).toContain('Disallow: /api');
    
    // Check sitemap directive
    expect(text).toContain('Sitemap:');
    expect(text).toContain('sitemap.xml');
  });

  test('sitemap.xml contains required public routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    
    // Check all routes are present
    expect(text).toContain('<loc>');
    // The exact hostname doesn't matter as much as the path, but let's check for endpoints
    const routes = ['/docs', '/privacy', '/terms', '/philosophy'];
    for (const route of routes) {
      expect(text).toContain(route);
    }
  });

  test('canonical URLs are set on public sub-pages', async ({ page }) => {
    await page.goto('/docs');
    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveCount(1);
    const href = await canonicalLink.getAttribute('href');
    expect(href).toContain('/docs');
  });

  test('breadcrumbs are rendered with JSON-LD schema on legal pages', async ({ page }) => {
    await page.goto('/privacy');
    
    // Visual check for breadcrumb nav
    const breadcrumbNav = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumbNav).toBeVisible();
    
    // Check JSON-LD schema
    const scriptTag = page.locator('script[type="application/ld+json"]').filter({ hasText: 'BreadcrumbList' });
    await expect(scriptTag).toHaveCount(1);
  });
});
