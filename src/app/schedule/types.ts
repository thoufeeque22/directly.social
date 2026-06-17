export interface PlatformResult {
  id: string;
  platform: string;
  accountId: string | null;
}

export interface PostActivityEntry {
  id: string;
  title: string;
  description: string | null;
  videoFormat: string;
  scheduledAt: string;
  createdAt: string;
  isPublished: boolean;
  stagedFileId: string | null;
  platforms: PlatformResult[];
}
