import React from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export interface ScheduleEditModalActionsProps {
  isAILoading: boolean;
  isCacheValid: boolean;
  onAIBrainstorm: () => void;
  onResumeReview: () => void;
}

export function ScheduleEditModalActions({
  isAILoading,
  isCacheValid,
  onAIBrainstorm,
  onResumeReview
}: ScheduleEditModalActionsProps) {
  return (
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
  );
}
