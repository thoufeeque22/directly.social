export interface GalleryAsset {
  id: string;
  fileId: string;
  fileName: string;
  fileSize: number | null;
  expiresAt: string;
  createdAt: string;
  previewUrl?: string;
}
