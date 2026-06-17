import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from '@/app/schedule/schedule.module.css';
import { PostActivityEntry } from '@/app/schedule/types';

export interface ScheduleEditModalProps {
  editingPost: PostActivityEntry;
  isSaving: boolean;
  isAILoading: boolean;
  isCacheValid: boolean;
  onCancel: () => void;
  onUpdate: (formData: FormData) => void;
  onAIBrainstorm: () => void;
  onResumeReview: () => void;
}

export function ScheduleEditModal({
  editingPost,
  isSaving,
  isAILoading,
  isCacheValid,
  onCancel,
  onUpdate,
  onAIBrainstorm,
  onResumeReview
}: ScheduleEditModalProps) {
  const formatToLocalDatetime = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <div className={styles.modalOverlay}>
      <GlassCard className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit Scheduled Post</h2>
        <form action={onUpdate}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.75rem' }}>
            {isCacheValid && (
              <button
                type="button"
                onClick={onResumeReview}
                style={{
                  background: 'hsla(var(--primary)/0.05)',
                  color: 'hsl(var(--primary))',
                  border: '1px solid hsla(var(--primary)/0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                <SkipNextIcon sx={{ fontSize: 18 }} /> Resume Review
              </button>
            )}
            <button
              type="button"
              onClick={onAIBrainstorm}
              disabled={isAILoading}
              style={{
                background: 'hsla(var(--primary)/0.1)',
                color: 'hsl(var(--primary))',
                border: '1px solid hsla(var(--primary)/0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                opacity: isAILoading ? 0.7 : 1
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 18 }} /> {isAILoading ? 'Brainstorming...' : (isCacheValid ? 'Regenerate Strategy' : 'Brainstorm Strategies & Polish')}
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-title" className={styles.formLabel}>Title</label>
            <input 
              id="edit-title"
              name="title" 
              defaultValue={editingPost.title} 
              className={styles.formInput} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-description" className={styles.formLabel}>Description</label>
            <textarea 
              id="edit-description"
              name="description" 
              defaultValue={editingPost.description || ''} 
              className={styles.formTextarea} 
              rows={3} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-scheduledAt" className={styles.formLabel}>Scheduled Date & Time</label>
            <label 
              htmlFor="edit-scheduledAt"
              className={styles.datePickerWrapper}
            >
              <span className={styles.dateIcon}>
                <CalendarMonthIcon sx={{ fontSize: 20 }} />
              </span>
              <input 
                id="edit-scheduledAt"
                type="datetime-local" 
                name="scheduledAt" 
                defaultValue={formatToLocalDatetime(editingPost.scheduledAt)} 
                className={styles.formInputWithIcon} 
                required 
              />
            </label>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={`${styles.actionButton} ${styles.secondaryAction}`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`${styles.actionButton} ${styles.primaryAction}`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
