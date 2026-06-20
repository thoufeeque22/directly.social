import { Capacitor } from '@capacitor/core';
import { LocalAsset, VaultService } from './vault-types';
import { checkMobilePermissions, requestMobilePermissions, listMobileAssets, getMobileFile } from './vault-mobile';

export class MobileVaultService implements VaultService {
  async isConnected(): Promise<boolean> {
    return true;
  }

  async connect(): Promise<void> {
    await requestMobilePermissions();
  }

  async disconnect(): Promise<void> {
    // no-op for mobile filesystem
  }

  async queryPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    return checkMobilePermissions();
  }

  async requestPermission(): Promise<boolean> {
    const result = await requestMobilePermissions();
    return result === 'granted';
  }

  async getAssets(): Promise<LocalAsset[]> {
    const assets = await listMobileAssets();
    return assets.map(a => ({
      id: a.name,
      fileName: a.name,
      fileSize: a.size,
      url: Capacitor.convertFileSrc(a.uri),
      getFile: () => getMobileFile(a.name),
    }));
  }

  getConnectionName(): string | null {
    return 'Mobile Vault';
  }

  cleanup(): void {
    // no-op
  }
}
