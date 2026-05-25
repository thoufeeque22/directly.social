# Manual Test: RBAC Separation and Endpoint Cleanup (#538)

## Purpose
Verify that the administrative and testing roles are strictly separated and that unused legacy endpoints (Roadmap and Launch) have been completely removed from the application.

## Prerequisites
1.  **Database Seeded:** Run `npm run seed:e2e` (or equivalent script that executes `src/__tests__/scripts/seed-e2e-user.ts`) to ensure `tester@socialstudio.ai` is a `USER` and `admin@socialstudio.ai` is an `ADMIN`.
2.  **Environment:** The application must be running in a development environment where the Credentials provider is enabled.

---

## Test Case 1: Admin Access (Positive Path)
**Goal:** Verify that a user with the `ADMIN` role can access restricted administrative pages.

1.  **Login:** Log in as `admin@socialstudio.ai`.
2.  **Navigate:** Go to `/admin/analytics`.
3.  **Expected Result:** 
    - The "Developer Analytics" dashboard renders correctly.
    - Charts (Feature Adoption, Platform Health) load data from the API.
    - No "Unauthorized" errors are displayed.
    - The sidebar shows the "Admin" or "Analytics" link.

---

## Test Case 2: User Access Restriction (Negative Path)
**Goal:** Verify that a user with the `USER` role is denied access to administrative pages.

1.  **Login:** Log in as `tester@socialstudio.ai`.
2.  **Navigate:** Manually type `/admin/analytics` in the browser address bar.
3.  **Expected Result:**
    - The page displays an "Unauthorized access - Admin role required" error (Alert).
    - The dashboard content (charts) is not visible.
    - The sidebar **does not** show the administrative link.

---

## Test Case 3: Legacy Endpoint Removal (Cleanup)
**Goal:** Verify that deleted endpoints return 404.

1.  **Navigate to Roadmap:** Go to `/roadmap`.
2.  **Expected Result:** The application returns a 404 Not Found page.
3.  **Navigate to Launch:** Go to `/launch`.
4.  **Expected Result:** The application returns a 404 Not Found page.
5.  **Check Sidebar:** Verify that no links to "Roadmap" or "Launch" are present in the navigation menu.

---

## Test Case 4: API Security
**Goal:** Verify that administrative API routes are protected.

1.  **Login:** Log in as `tester@socialstudio.ai`.
2.  **Direct Request:** Open the browser console or use a tool like `curl` to request `GET /api/admin/analytics`.
3.  **Expected Result:** The API returns a `401 Unauthorized` status code with the JSON body `{"error": "Unauthorized"}`.
