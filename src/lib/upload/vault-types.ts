export interface LocalAsset {
  id: string;
  fileName: string;
  fileSize: number;
  url: string;
  getFile(): Promise<File>;
}

export interface VaultService {
  isConnected(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAssets(): Promise<LocalAsset[]>;
  queryPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'>;
  requestPermission(): Promise<boolean>;
  getConnectionName(): string | null;
  cleanup(): void;
}

