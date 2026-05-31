import { useState } from 'react';
import { ReviewContext } from '@/components/dashboard/DashboardClient.types';

export function useDashboardLocalState() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [reviewContext, setReviewContext] = useState<ReviewContext | null>(null);
  const [galleryFileId, setGalleryFileId] = useState<string | null>(null);
  const [galleryFileName, setGalleryFileName] = useState<string | null>(null);
  const [customStyleText, setCustomStyleText] = useState('');

  return {
    isReviewing, setIsReviewing,
    isScheduled, setIsScheduled,
    scheduledAt, setScheduledAt,
    reviewContext, setReviewContext,
    galleryFileId, setGalleryFileId,
    galleryFileName, setGalleryFileName,
    customStyleText, setCustomStyleText,
  };
}
