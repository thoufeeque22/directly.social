/* eslint-disable react-hooks/set-state-in-effect */
import { useRef, useState, useEffect } from 'react';

export function useVideoPlayer(draftFile: File | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (draftFile) {
      const url = URL.createObjectURL(draftFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setVideoUrl(null); 
    setThumbnailUrl(null);
  }, [draftFile]);

  const captureThumbnail = () => {
    if (videoRef.current && canvasRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && videoWidth > 0) {
        canvasRef.current.width = videoWidth || 320;
        canvasRef.current.height = videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        try { setThumbnailUrl(canvasRef.current.toDataURL('image/jpeg')); } catch (e) { console.error(e); }
      }
    }
  };

  return { videoRef, canvasRef, thumbnailUrl, videoUrl, captureThumbnail };
}
