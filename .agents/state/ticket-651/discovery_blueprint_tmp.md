# Technical Blueprint & Test Specification: Local FileSystem Vault (Ticket #651)

## Verdict: APPROVED

## Socratic Log & Ambiguity Resolution

1. **Feasibility:**
   - **Web Support:** Using the File System Access API (`showDirectoryPicker`) is fully feasible and standard for Chromium-based browsers. For non-Chromium browsers (Firefox, Safari), we will detect the lack of `showDirectoryPicker` and display a clear, non-disruptive browser compatibility message.
   - **Cross-session Persistence:** Directory handles (`FileSystemDirectoryHandle`) can be persisted in IndexedDB on Chromium browsers. Since browsers revoke permissions upon page reload, we will check permission status on load using `queryPermission({ mode: 'readwrite' })`. If access is not active (i.e. `'prompt'`), we display a "Restore Access" warning alert. The user can click it to trigger the required user gesture and request permission via `requestPermission({ mode: 'readwrite' })`.
   - **Mobile Implementation:** Using `@capacitor/filesystem` allows native iOS/Android workspace directory mapping. We will check if we are on a native platform using `Capacitor.isNativePlatform()` and branch accordingly.

2. **Strategic Alignment:**
   - **Bandwidth & Storage Optimization:** The application enforces a 7-day auto-expiry on media files staged to the server to control hosting costs. The Local FileSystem Vault enables users to keep and preview massive video files on their own machines, only executing chunked uploads at the point of actual publication/post distribution, avoiding unnecessary server storage fees and client upload bandwidth.

3. **Architectural Integrity:**
   - **Separation of Concerns:** The vault directory listing and local blob-URL generation are kept purely client-side.
   - **Composer State Reuse:** The local vault items will hook directly into the composer's draft mechanism by writing chosen files to the existing `DirectlyDrafts` database (key: `draft_video`). The composer's existing logic will automatically read the `draftFile` object, render previews, and run visual scans. No core upload pipeline changes are needed.

4. **External Dependencies & Cost:**
   - **Capacitor Filesystem:** Requires adding `@capacitor/filesystem` (open source, no cost) to the dependencies. Web implementation relies entirely on native Web APIs (File System Access API & IndexedDB).

---

## Technical Blueprint

### 1. IndexedDB Vault Store
Create `src/lib/upload/vault-store.ts` to manage saving and retrieving the directory handle:
```typescript
const VAULT_DB = 'DirectlyVault';
const VAULT_STORE = 'vault_handles';
const HANDLE_KEY = 'connected_directory';

function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VAULT_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(VAULT_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeVaultHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE, 'readwrite');
    tx.objectStore(VAULT_STORE).put(handle, HANDLE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function getVaultHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openVaultDB();
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE, 'readonly');
      const req = tx.objectStore(VAULT_STORE).get(HANDLE_KEY);
      req.onsuccess = () => { db.close(); resolve(req.result || null); };
      req.onerror = () => { db.close(); resolve(null); };
    });
  } catch {
    return null;
  }
}

export async function clearVaultHandle(): Promise<void> {
  const db = await openVaultDB();
  const tx = db.transaction(VAULT_STORE, 'readwrite');
  tx.objectStore(VAULT_STORE).delete(HANDLE_KEY);
  tx.oncomplete = () => db.close();
}
```

### 2. Custom Hook: `useLocalVault`
Create `src/hooks/useLocalVault.ts` to coordinate local directory interaction and file list state:
```typescript
import { useState, useEffect, useCallback } from 'react';
import { getVaultHandle, storeVaultHandle, clearVaultHandle } from '@/lib/upload/vault-store';

export interface LocalAsset {
  id: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  previewUrl: string;
  file: File;
}

export function useLocalVault() {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [permissionState, setPermissionState] = useState<'granted' | 'prompt' | 'denied' | 'unsupported'>('prompt');
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = useCallback(async (dirHandle: FileSystemDirectoryHandle) => {
    setIsLoading(true);
    const localAssets: LocalAsset[] = [];
    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          if (file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv)$/i.test(file.name)) {
            localAssets.push({
              id: file.name,
              fileId: file.name,
              fileName: file.name,
              fileSize: file.size,
              previewUrl: URL.createObjectURL(file),
              file,
            });
          }
        }
      }
      setAssets(localAssets);
    } catch (e) {
      console.error('Failed to read vault directory', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('showDirectoryPicker' in window)) {
      setPermissionState('unsupported');
      return;
    }

    getVaultHandle().then(async (h) => {
      if (h) {
        setHandle(h);
        const state = await h.queryPermission({ mode: 'readwrite' });
        setPermissionState(state);
        if (state === 'granted') {
          loadFiles(h);
        }
      }
    });
  }, [loadFiles]);

  const connectDirectory = async () => {
    try {
      const h = await window.showDirectoryPicker({ mode: 'readwrite' });
      await storeVaultHandle(h);
      setHandle(h);
      setPermissionState('granted');
      loadFiles(h);
    } catch (e) {
      console.error('Directory connection rejected', e);
    }
  };

  const restoreAccess = async () => {
    if (!handle) return;
    try {
      const state = await handle.requestPermission({ mode: 'readwrite' });
      setPermissionState(state);
      if (state === 'granted') {
        loadFiles(handle);
      }
    } catch (e) {
      console.error('Permission request failed', e);
    }
  };

  const disconnect = async () => {
    await clearVaultHandle();
    setHandle(null);
    setPermissionState('prompt');
    setAssets([]);
  };

  return {
    handle,
    permissionState,
    assets,
    isLoading,
    connectDirectory,
    restoreAccess,
    disconnect,
    refresh: () => handle && loadFiles(handle),
  };
}
```

### 3. UI Component Structure
1. **`src/components/media/MediaLibrary.tsx`**
   - Add a custom `Tabs` selector at the top (Cloud Gallery vs. Local Vault).
   - Dynamically render the existing gallery view or the new `LocalVaultView`.
2. **`src/components/media/LocalVaultView.tsx`** (New component)
   - Integrates the `useLocalVault` hook.
   - Evaluates permission states:
     - **State A (Unconnected / No handle):** Center-aligned `Box` with `Paper` and a "Connect Local Directory" button.
     - **State B (Permission Expired):** Renders a warning card / `Alert` prompting to "Restore Access".
     - **State C (Active Connected Vault):** Shows the path name, "Refresh" / "Disconnect" buttons, and an asset grid of `LocalAsset` cards.
     - Cards will show a green chip `Local Vault` without expiration dates.
     - Clicking "Post" on a local asset writes the `File` to draft storage (`storeDraftFile(asset.file)`) and redirects to `/` (dashboard).
3. **`src/components/dashboard/UploadForm/MediaPicker.tsx`**
   - Add a tab for "Local Vault" in the modal.
   - Selecting a local vault card will invoke the form context's callback with the file object (`onFileChange(asset.file)`) and close the modal.

---

## Test Specification

### 1. Unit & Hook Testing (Vitest)
Create `src/__tests__/hooks/useLocalVault.test.ts` to verify hook state transitions:
- **Case 1 (Fresh Launch):** Mock `getVaultHandle` to resolve to `null`. Verify that `handle` is `null` and `permissionState` is `'prompt'`.
- **Case 2 (Access Expired):** Mock `getVaultHandle` to return a handle with `queryPermission` returning `'prompt'`. Verify that the initial hook state is in the expired state (`'prompt'`).
- **Case 3 (Connect Folder):** Mock `window.showDirectoryPicker` to return a directory handle. Call `connectDirectory()`. Verify that `storeVaultHandle` is called, handle state is updated, and files are loaded.
- **Case 4 (Filter Files):** Mock the directory contents to yield 1 `.mp4` file and 1 `.txt` file. Verify that only the `.mp4` file is present in `assets` with a valid blob URL.

### 2. End-to-End Testing (Playwright)
Create/extend `src/__tests__/e2e/local-vault.spec.ts`:
- **Case 1 (Browser Support Alert):** Emulate a browser without `showDirectoryPicker` support. Navigate to `/media` -> Local Vault tab. Assert the browser-unsupported warning is displayed.
- **Case 2 (Folder Connection & Badge Verification):** Mock the file picker response. Click "Connect Local Directory". Confirm directory list shows assets with the permanent green "Local Vault" chip and active video preview players.
- **Case 3 (Composer Redirection):** Connect directory -> click "Post" on a card. Verify URL redirects to `/`, composer is populated with the selected file, and the preview player loads the local blob-URL.
- **Case 4 (Restore Permission):** Emulate expired handle state. Confirm the alert "Access to the connected directory needs to be restored to read assets" is rendered. Click "Restore Access", mock browser consent, and verify that the warning alert disappears and the asset grid loads.
