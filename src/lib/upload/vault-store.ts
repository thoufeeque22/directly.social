/**
 * IndexedDB-based store for local vault directory handles.
 * Allows persisting directory permissions across sessions.
 */

const VAULT_DB = 'DirectlyVault';
const VAULT_STORE = 'vault_handles';
const HANDLE_KEY = 'connected_directory';

let cachedDb: IDBDatabase | null = null;

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

async function getDB(): Promise<IDBDatabase> {
  if (cachedDb) return cachedDb;
  cachedDb = await openVaultDB();
  return cachedDb;
}

export async function storeVaultHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  if (typeof window !== 'undefined') {
    const win = window as unknown as { __mockVaultHandle?: FileSystemDirectoryHandle | null };
    if (win.__mockVaultHandle !== undefined) {
      win.__mockVaultHandle = handle;
      return;
    }
  }
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE, 'readwrite');
    tx.objectStore(VAULT_STORE).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVaultHandle(): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window !== 'undefined') {
    const win = window as unknown as { __mockVaultHandle?: FileSystemDirectoryHandle | null };
    if (win.__mockVaultHandle !== undefined) {
      return win.__mockVaultHandle;
    }
  }
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE, 'readonly');
      const req = tx.objectStore(VAULT_STORE).get(HANDLE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearVaultHandle(): Promise<void> {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE, 'readwrite');
    tx.objectStore(VAULT_STORE).delete(HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
