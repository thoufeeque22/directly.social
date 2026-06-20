import React, { useRef, useCallback } from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';
import UndoIcon from '@mui/icons-material/Undo';
import { scanButtonStyle, undoButtonStyle, inputStyle, clearButtonStyle } from './StandardMetadataFields.Title.styles';
import { insertAtCursor } from '@/lib/utils/insertAtCursor';

export const TitleField: React.FC = () => {
  const {
    aiTier, isUploading, onTierChange, onVisualScan,
    title, handleTitleChange, titleUndo, handleUndoTitle, handleClearTitle
  } = useUploadFormContext();

  const inputRef = useRef<HTMLInputElement>(null);
  // Only preserve cursor position if the user blurred by clicking the snippet trigger.
  // If they clicked elsewhere first, reset to null (falls back to end-append).
  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const isSnippetTrigger = relatedTarget?.dataset?.testid === 'snippets-trigger';
    if (isSnippetTrigger) {
      cursorPosRef.current = {
        start: e.target.selectionStart ?? e.target.value.length,
        end: e.target.selectionEnd ?? e.target.value.length,
      };
    } else {
      cursorPosRef.current = null;
    }
  }, []);

  const MAX_TITLE = 100;
  const isNearLimit = title.length > MAX_TITLE * 0.9;
  const isOverLimit = title.length > MAX_TITLE;

  const handleSnippetSelect = useCallback((snippet: string) => {
    const el = inputRef.current;
    // Use the blurred position; fall back to end of string if never focused
    const { start, end } = cursorPosRef.current ?? { start: title.length, end: title.length };
    const newValue = insertAtCursor(title, snippet, ' ', start, end);
    handleTitleChange(newValue);
    const needsSepBefore = start > 0 && !title.slice(0, start).endsWith(' ');
    const newCursor = start + snippet.length + (needsSepBefore ? 1 : 0);
    cursorPosRef.current = { start: newCursor, end: newCursor };
    requestAnimationFrame(() => {
      el?.setSelectionRange(newCursor, newCursor);
      el?.focus();
    });
  }, [title, handleTitleChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label htmlFor="video-title" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            {aiTier === 'Generate' ? 'Video Prompt' : 'Video Title'}
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="title_generator" message="Try AI Title" tooltipText="Switch to Generate tier" onClick={() => onTierChange('Generate')} />
          )}
          {!isUploading && (
            <MetadataTemplates
              currentValue={title}
              category="title"
              onSelect={handleSnippetSelect}
            />
          )}
          {aiTier === 'Generate' && !isUploading && (
            <button type="button" onClick={async () => {
              const { getDraftFile } = await import('@/lib/upload/file-store');
              const file = await getDraftFile();
              if (file) await onVisualScan(file);
            }} style={scanButtonStyle}>Auto-Scan Video</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isOverLimit ? 'hsl(var(--destructive))' : isNearLimit ? '#ffb74d' : 'hsl(var(--muted-foreground))' }}>
            {title.length}/{MAX_TITLE}
          </span>
          {titleUndo && <button type="button" onClick={handleUndoTitle} style={undoButtonStyle}><UndoIcon sx={{ fontSize: 14 }} /> Undo Clear</button>}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input ref={inputRef} id="video-title" data-testid="video-title" type="text" name="title" 
          placeholder={aiTier === 'Generate' ? "Describe your video concept..." : "Catchy title..."}
          value={title} onChange={(e) => handleTitleChange(e.target.value)} required 
          onBlur={handleInputBlur}
          style={{ ...inputStyle, borderColor: isOverLimit ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
        />
        {title && <button type="button" onClick={handleClearTitle} style={clearButtonStyle}>✕</button>}
      </div>
      {isOverLimit && <p style={{ color: 'hsl(var(--destructive))', fontSize: '0.7rem', margin: 0, fontWeight: 500 }}>Title exceeds the 100 character limit for some platforms.</p>}
    </div>
  );
};
