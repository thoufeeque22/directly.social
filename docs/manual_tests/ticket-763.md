# Manual Test Script: Configure Staging Environment & Isolation
**Ticket ID**: 763
**Branch**: feature/763-configure-staging-environment

## Prerequisites
- A staging instance is running and deployed on the VPS.
- You know the URL: `staging.directly.social`.
- You are connected to the allowed network IP (`84.40.153.137`).

## Test Cases

### 1. Caddy IP Access Control (Unauthorized IP)
1. Disconnect your phone from Wi-Fi (use Cellular data) to obtain an unauthorized IP.
2. Open a browser and navigate to `https://staging.directly.social`.
3. **Expected Result**: The connection is aborted or returns a 403 Forbidden. The site does not load.

### 2. Caddy IP Access Control (Authorized IP)
1. Connect to your primary Wi-Fi network (IP `84.40.153.137`).
2. Open a browser and navigate to `https://staging.directly.social`.
3. **Expected Result**: The staging site loads successfully.

### 3. SEO Protection (robots.txt)
1. Navigate to `https://staging.directly.social/robots.txt`.
2. **Expected Result**: The page displays:
   ```
   User-agent: *
   Disallow: /
   ```

### 4. Background Worker Isolation (Redis/BullMQ)
1. Trigger a background job on the staging site (e.g., attempt to send an email or process an image).
2. SSH into the VPS and check the staging worker logs (`directly-worker-staging`).
3. **Expected Result**: The job is processed by the staging worker.
4. Check the production worker logs.
5. **Expected Result**: The staging job does NOT appear in the production logs.
