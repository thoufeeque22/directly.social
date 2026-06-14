export type VideoFormat = 'short' | 'long';

export type PublishingStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface BaseParams {
  userId: string;
  activityId: string;
  platform: string;
  accountId: string;
}

export interface VerificationParams extends BaseParams {}

export interface InitiationParams extends BaseParams {
  title: string;
  description: string;
  videoFormat: VideoFormat;
  filePath: string;
  storage: StorageProvider;
}

export interface PushParams extends InitiationParams {
  creationId: string;
  resumableUrl?: string;
  onProgress?: (percent: number) => void;
}

export interface PollingParams extends BaseParams {
  creationId: string;
}

export interface FinalizationParams extends BaseParams {
  creationId: string;
  title: string;
  description: string;
}

/**
 * (API-002): Standard interface for durable publishing activities.
 * (API-001): Decomposed into stage-specific interfaces.
 */
export interface PlatformActivity {
  preVerify(params: VerificationParams): Promise<void>;
  init(params: InitiationParams): Promise<{ creationId: string; resumableUrl?: string }>;
  push(params: PushParams): Promise<{ resumableUrl?: string; platformPostId?: string }>;
  poll(params: PollingParams): Promise<void>;
  finalize(params: FinalizationParams): Promise<{ id: string; permalink: string }>;
}

/**
 * (CA-002): Abstract file access behind a StorageProvider.
 */
export interface StorageProvider {
  resolvePath(stagedFileId: string, platform: string, activityId: string, accountId: string): Promise<string>;
  getFileSize(filePath: string): Promise<number>;
}

/**
 * (CA-001): Repository interface for publishing state.
 */
export interface PublishingRepository {
  fetchState(activityId: string, platform: string, accountId: string): Promise<Record<string, unknown> | null>;
  upsertState(activityId: string, platform: string, accountId: string, data: Record<string, unknown>): Promise<void>;
  updateProgress(activityId: string, platform: string, accountId: string, percent: number): Promise<void>;
}
