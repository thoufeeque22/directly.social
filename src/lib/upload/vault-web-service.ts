import { LocalAsset, VaultService } from './vault-types';
import { getVaultHandle, storeVaultHandle, clearVaultHandle } from './vault-store';

interface ExtendedDirectoryHandle extends FileSystemDirectoryHandle {
  queryPermission(o?: { mode: string }): Promise<PermissionState>;
  requestPermission(o?: { mode: string }): Promise<PermissionState>;
  values(): AsyncIterableIterator<FileSystemHandle>;
}

export class WebVaultService implements VaultService {
  private activeUrls = new Map<string, string>();
  private currentHandle: FileSystemDirectoryHandle | null = null;

  private revokeAll() {
    this.activeUrls.forEach(url => {
      try { URL.revokeObjectURL(url); } catch (e) { console.error('Failed to revoke URL', e); }
    });
    this.activeUrls.clear();
  }

  getHandle() { return this.currentHandle; }
  getConnectionName() { return this.currentHandle?.name || null; }

  async isConnected() {
    const h = await getVaultHandle();
    this.currentHandle = h;
    return !!h;
  }

  async connect() {
    const win = window as unknown as { showDirectoryPicker(o?: { mode: string }): Promise<FileSystemDirectoryHandle> };
    const h = await win.showDirectoryPicker({ mode: 'readwrite' });
    await storeVaultHandle(h);
    this.currentHandle = h;
  }

  async disconnect() {
    await clearVaultHandle();
    this.currentHandle = null;
    this.revokeAll();
  }

  async queryPermission() {
    if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) return 'unsupported';
    const h = this.currentHandle || (await getVaultHandle());
    if (!h) return 'prompt';
    this.currentHandle = h;
    if (typeof (h as unknown as { queryPermission?: unknown }).queryPermission !== 'function') return 'granted';
    return (h as unknown as ExtendedDirectoryHandle).queryPermission({ mode: 'readwrite' });
  }

  async requestPermission() {
    const h = this.currentHandle || (await getVaultHandle());
    if (!h) return false;
    this.currentHandle = h;
    if (typeof (h as unknown as { requestPermission?: unknown }).requestPermission !== 'function') return true;
    const state = await (h as unknown as ExtendedDirectoryHandle).requestPermission({ mode: 'readwrite' });
    return state === 'granted';
  }

  async getAssets(): Promise<LocalAsset[]> {
    const h = this.currentHandle || (await getVaultHandle());
    if (!h) return [];
    this.currentHandle = h;
    const localAssets: LocalAsset[] = [];
    const ext = h as unknown as ExtendedDirectoryHandle;
    const seenNames = new Set<string>();

    for await (const entry of ext.values()) {
      if (entry.kind === 'file' && /\.(mp4|mov|webm|mkv)$/i.test(entry.name)) {
        seenNames.add(entry.name);
        let url = this.activeUrls.get(entry.name);
        const file = await (entry as FileSystemFileHandle).getFile();
        if (!url) {
          url = URL.createObjectURL(file);
          this.activeUrls.set(entry.name, url);
        }
        localAssets.push({
          id: entry.name,
          fileName: entry.name,
          fileSize: file.size,
          url,
          getFile: async () => file,
        });
      }
    }

    for (const [name, url] of this.activeUrls.entries()) {
      if (!seenNames.has(name)) {
        try { URL.revokeObjectURL(url); } catch (e) { console.error('Failed to revoke URL', e); }
        this.activeUrls.delete(name);
      }
    }
    return localAssets;
  }

  cleanup() { this.revokeAll(); }
}
