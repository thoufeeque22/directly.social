'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUploadStatus } from '@/hooks/useUploadStatus';
import { useHistory } from '@/hooks/useHistory';
import { HistoryFilters } from '@/components/history/HistoryFilters';
import { HistoryHeader } from '@/components/history/HistoryHeader';
import { HistoryEmptyState } from '@/components/history/HistoryEmptyState';
import { HistoryList } from '@/components/history/HistoryList';
import styles from './history.module.css';

function HistoryContent() {
  const {
    posts, pendingPost, nextCursor, loadingMore, activeResumingId,
    searchQuery, setSearchQuery, cancelledIds, processingIds,
    handleLoadMore, handleRetry, handleCancelPlatform, handleCancelAll,
    handleInPlaceResume, fileInputRef,
  } = useHistory();

  const stagingStatus = useUploadStatus();
  const reconciledPosts = pendingPost ? [pendingPost, ...posts] : posts;

  return (
    <div className={styles.historyPage}>
      <HistoryHeader fileInputRef={fileInputRef} />
      <GlassCard style={{ padding: '2rem' }}>
        <HistoryFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {reconciledPosts.length === 0 ? (
          <HistoryEmptyState searchQuery={searchQuery} />
        ) : (
          <HistoryList
            posts={reconciledPosts}
            cancelledIds={cancelledIds}
            processingIds={processingIds}
            activeResumingId={activeResumingId}
            stagingStatus={stagingStatus}
            onRetry={handleRetry}
            onCancelPlatform={handleCancelPlatform}
            onCancelAll={handleCancelAll}
            onInPlaceResume={handleInPlaceResume}
            nextCursor={nextCursor}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </GlassCard>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <React.Suspense fallback={<div className={styles.historyPage}><div className={styles.loading}>Loading Activity Hub...</div></div>}>
      <HistoryContent />
    </React.Suspense>
  );
}
