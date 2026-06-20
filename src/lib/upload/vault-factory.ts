import { Capacitor } from '@capacitor/core';
import { VaultService } from './vault-types';
import { WebVaultService } from './vault-web-service';
import { MobileVaultService } from './vault-mobile-service';

export function createVaultService(): VaultService {
  return Capacitor.isNativePlatform()
    ? new MobileVaultService()
    : new WebVaultService();
}
