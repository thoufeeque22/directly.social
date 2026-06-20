import { useState, useEffect, useCallback, useMemo } from 'react';
import { LocalAsset, VaultService } from '@/lib/upload/vault-types';
import { createVaultService } from '@/lib/upload/vault-factory';

export type { LocalAsset };

export function useLocalVault() {
  const [connectionName, setConnectionName] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const service = useMemo<VaultService>(() => {
    return createVaultService();
  }, []);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedAssets = await service.getAssets();
      setAssets(loadedAssets);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let active = true;
    const init = async () => {
      const connected = await service.isConnected();
      if (!active) return;
      if (connected) {
        setConnectionName(service.getConnectionName());
      }
      const state = await service.queryPermission();
      if (!active) return;
      setPermissionState(state);
      if (state === 'granted') {
        await loadFiles();
      }
    };

    init();

    return () => {
      active = false;
      service.cleanup();
    };
  }, [service, loadFiles]);

  const connectDirectory = async () => {
    try {
      await service.connect();
      setConnectionName(service.getConnectionName());
      const state = await service.queryPermission();
      setPermissionState(state);
      if (state === 'granted') await loadFiles();
    } catch (e) { console.error(e); }
  };

  const restoreAccess = async () => {
    try {
      const granted = await service.requestPermission();
      if (granted) {
        setPermissionState('granted');
        await loadFiles();
      } else {
        const state = await service.queryPermission();
        setPermissionState(state);
      }
    } catch (e) { console.error(e); }
  };

  const disconnect = async () => {
    await service.disconnect();
    setConnectionName(null);
    setPermissionState('prompt');
    setAssets([]);
  };

  return {
    connectionName,
    permissionState,
    assets,
    isLoading,
    connectDirectory,
    restoreAccess,
    disconnect,
    refresh: loadFiles,
  };
}
