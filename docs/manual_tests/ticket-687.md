# Manual Test Script for Ticket 687 (Technical SEO)

## Prerequisites
- Start the development server (`pnpm dev` or `pnpm build && pnpm start`)

## 1. Verify `robots.txt`
1. Navigate to `http://localhost:3000/robots.txt`
2. **Expected Outcome:** You should see a plaintext file.
3. Verify it contains `Allow: /` and `Disallow: /admin` (along with other disallowed paths like `/api`, `/media`).
4. Verify it contains a `Sitemap: https://<domain>/sitemap.xml` declaration.

## 2. Verify `sitemap.xml`
1. Navigate to `http://localhost:3000/sitemap.xml`
2. **Expected Outcome:** You should see an XML file.
3. Verify it contains URLs for `/`, `/docs`, `/privacy`, `/terms`, and `/philosophy`.
4. Verify the change frequency for `/` and `/docs` is `weekly`.
5. Verify the change frequency for `/privacy` and `/terms` is `monthly`.

## 3. Verify Canonical URLs
1. Navigate to `http://localhost:3000/docs`
2. Open DevTools (F12) -> Elements tab.
3. Search (Ctrl+F) for `rel="canonical"`.
4. **Expected Outcome:** The `<head>` should contain `<link rel="canonical" href="https://<domain>/docs">`.
5. Repeat for `/privacy`, `/terms`, and `/philosophy`.

## 4. Verify Breadcrumbs UI & Schema
1. Navigate to `http://localhost:3000/privacy`
2. **Expected Outcome (Visual):** A breadcrumb navigation trail should be visible below the header (e.g., "Home > Privacy Policy").
3. Open DevTools -> Elements tab.
4. Search for `BreadcrumbList`.
5. **Expected Outcome (Schema):** A `<script type="application/ld+json">` tag should be present containing structured data for the `BreadcrumbList`.
6. (Optional) Run the page URL through the Google Rich Results Test tool once deployed.
