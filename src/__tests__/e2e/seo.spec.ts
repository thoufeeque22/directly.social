import { test, expect } from './base-test';
import { BRAND } from '../../lib/core/brand';

test.describe('Technical SEO Foundation', () => {
  // Ensure we start unauthenticated to see the landing page
  test.use({ authRole: 'none' });

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
  });

  test('should display correct document title for landing page', async ({ page }) => {
    await expect(page).toHaveTitle(`${BRAND.name} | The Native Social Media Creator Studio`);
  });

  test('should have correct description, keywords, canonical, and robots tags', async ({ page }) => {
    // Description check
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', 'Publish native Short, Reel, and TikTok video formats directly using your own API keys. No middleware servers, no markups, complete data privacy, and Bring Your Own Storage (BYOS).');

    // Keywords check
    const keywords = page.locator('meta[name="keywords"]');
    await expect(keywords).toHaveAttribute('content', 'social media manager, native social client, auto poster, tiktok scheduler, instagram reels scheduler, youtube shorts poster, privacy first social tool, bring your own keys, byos storage, short-form video distribution');

    // Canonical link check
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', BRAND.url);

    // Robots check
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'index,follow');
  });

  test('should have correct OpenGraph and Twitter metadata tags', async ({ page }) => {
    // OpenGraph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', `${BRAND.name} - The Native Social Media Client`);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', 'Stop paying the SaaS tax. Publish native shorts, reels, and TikToks directly from your device using your own keys and cloud storage.');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', BRAND.url);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', BRAND.name);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${BRAND.url}/og-image.png`);

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', `${BRAND.name} - The Native Social Media Client`);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Publish native video content directly using your own API keys. No markups, no middleware database, and complete data privacy.');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${BRAND.url}/og-image.png`);
    await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute('content', '@directlysocial');
  });

  test('should embed correct Schema.org JSON-LD structured data graph', async ({ page }) => {
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toBeAttached();

    const scriptContent = await jsonLdScript.innerHTML();
    const data = JSON.parse(scriptContent);

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@graph']).toHaveLength(3);

    const organization = data['@graph'].find((obj: any) => obj['@type'] === 'Organization');
    expect(organization).toBeDefined();
    expect(organization['@id']).toBe(`${BRAND.url}/#organization`);
    expect(organization.name).toBe(BRAND.name);
    expect(organization.url).toBe(BRAND.url);
    expect(organization.logo.url).toBe(`${BRAND.url}/logo.png`);
    expect(organization.sameAs).toEqual([
      'https://github.com/thoufeeque22/directly.social',
      'https://x.com/directlysocial',
      'https://discord.gg/directly',
    ]);

    const softwareApplication = data['@graph'].find((obj: any) => obj['@type'] === 'SoftwareApplication');
    expect(softwareApplication).toBeDefined();
    expect(softwareApplication['@id']).toBe(`${BRAND.url}/#software`);
    expect(softwareApplication.name).toBe(BRAND.name);
    expect(softwareApplication.applicationCategory).toBe('BusinessApplication');
    expect(softwareApplication.operatingSystem).toBe('Web, iOS, Android');
    expect(softwareApplication.offers.priceCurrency).toBe('USD');
    expect(softwareApplication.offers.offers[0].name).toBe('Local Core');
    expect(softwareApplication.publisher['@id']).toBe(`${BRAND.url}/#organization`);

    const webSite = data['@graph'].find((obj: any) => obj['@type'] === 'WebSite');
    expect(webSite).toBeDefined();
    expect(webSite['@id']).toBe(`${BRAND.url}/#website`);
    expect(webSite.name).toBe(BRAND.name);
    expect(webSite.url).toBe(BRAND.url);
    expect(webSite.description).toBe(BRAND.tagline);
    expect(webSite.publisher['@id']).toBe(`${BRAND.url}/#organization`);
  });
});
