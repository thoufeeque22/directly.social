'use client';

import React from 'react';
import styles from './schedule.module.css';
import { useScheduleEditor } from '@/hooks/useScheduleEditor';
import { CalendarView } from '@/components/schedule/CalendarView';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';
import { ScheduleTimelineView } from '@/components/schedule/ScheduleTimelineView';
import { ScheduleEmptyState } from '@/components/schedule/ScheduleEmptyState';
import { ScheduleEditModal } from '@/components/schedule/ScheduleEditModal';
import { AIContentReview } from '@/components/dashboard/AIContentReview';

export function ScheduleContent() {
  const editor = useScheduleEditor();

  if (editor.isLoading || !editor.isMounted) {
    return (
      <div className={styles.schedulePage}>
        <div className={styles.loading}>Loading scheduled posts...</div>
      </div>
    );
  }

  return (
    <div className={styles.schedulePage}>
      <ScheduleHeader 
        viewMode={editor.viewMode}
        currentDate={editor.currentDate}
        onNext={editor.nextPeriod}
        onPrev={editor.prevPeriod}
        onToday={editor.goToToday}
        onViewChange={editor.setViewMode}
      />

      {editor.posts.length === 0 ? (
        <ScheduleEmptyState />
      ) : (editor.viewMode === 'month' || editor.viewMode === 'week') ? (
        editor.currentDate && (
          <CalendarView 
            posts={editor.posts} 
            currentDate={editor.currentDate}
            viewType={editor.viewMode}
            onEditPost={(post) => editor.setEditingPost(post)} 
          />
        )
      ) : (
        <ScheduleTimelineView 
          posts={editor.posts}
          targetId={editor.targetId}
          onPublishNow={editor.handlePublishNow}
          onEdit={(post) => editor.setEditingPost(post)}
          onDelete={editor.handleDelete}
        />
      )}

      {editor.isReviewing && editor.editingPost && editor.aiPreviews && (
        <div className={styles.modalOverlay}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <AIContentReview 
              previews={editor.aiPreviews}
              onBack={() => editor.setIsReviewing(false)}
              onConfirm={editor.handleConfirmReview}
              isProcessing={editor.isSaving}
            />
          </div>
        </div>
      )}

      {editor.editingPost && !editor.isReviewing && (
        <ScheduleEditModal 
          editingPost={editor.editingPost}
          isSaving={editor.isSaving}
          isAILoading={editor.isAILoading}
          isCacheValid={editor.isCacheValid}
          onCancel={() => { editor.setEditingPost(null); editor.clearCache(); }}
          onUpdate={editor.handleUpdate}
          onAIBrainstorm={editor.handleAIBrainstorm}
          onResumeReview={() => editor.setIsReviewing(true)}
        />
      )}
    </div>
  );
}
