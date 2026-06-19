import { useRef, useState } from 'react';
import { stageVideoFile } from '@/lib/upload/upload-utils';

interface UseMediaUploaderProps {
  fetchAssets: (search?: string) => Promise<void>;
}

export const useMediaUploader = ({ fetchAssets }: UseMediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddVideo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus("Preparing upload...");

      await stageVideoFile({
        file,
        onStatusUpdate: setUploadStatus,
        platforms: [],
        metadata: {
          title: file.name,
          isPublished: false
        }
      });

      setUploadStatus("Upload complete!");
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus(null);
        fetchAssets();
      }, 1500);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setUploadStatus(`Error: ${message}`);
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus(null);
      }, 3000);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return { isUploading, uploadStatus, fileInputRef, handleAddVideo, handleFileChange };
}
