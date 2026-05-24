export interface PlatformAccount {
  id: string;
  userId: string;
  provider: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
}

export interface PublishParams {
  userId: string;
  filePath: string;
  title?: string;
  description?: string;
  accountId?: string;
  onProgress?: (percent: number) => void;
}

export interface MetaPublishParams extends PublishParams {
  caption?: string; // Alias for description in IG
  videoId?: string;
  creationId?: string;
  musicId?: string;
}

export interface PlatformResult {
  success: boolean;
  id?: string;
  permalink?: string;
  error?: string;
}
