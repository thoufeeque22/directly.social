import React, { useRef, useCallback } from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';
import UndoIcon from '@mui/icons-material/Undo';
import { undoButtonStyle, textareaStyle, clearButtonStyle } from './StandardMetadataFields.Description.styles';
import { insertAtCursor } from '@/lib/utils/insertAtCursor';

export const DescriptionField: React.FC = () => {
  const {
    aiTier, isUploading, onTierChange, description, handleDescriptionChange, 
    descUndo, handleUndoDesc, handleClearDesc
  } = useUploadFormContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPosRef = useRef<{ start: number; end: number } | null>(null);
  // Only preserve cursor position if the user blurred by clicking the snippet trigger.
  // If they clicked elsewhere first, reset to null (falls back to end-append).
  const handleTextareaBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
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

  const MAX_DESC = 2200;
  const isNearLimit = description.length > MAX_DESC * 0.9;
  const isOverLimit = description.length > MAX_DESC;

  const handleSnippetSelect = useCallback((snippet: string) => {
    const el = textareaRef.current;
    const { start, end } = cursorPosRef.current ?? { start: description.length, end: description.length };
    const newValue = insertAtCursor(description, snippet, '\n', start, end);
    handleDescriptionChange(newValue);
    const needsSepBefore = start > 0 && !description.slice(0, start).endsWith('\n');
    const newCursor = start + snippet.length + (needsSepBefore ? 1 : 0);
    cursorPosRef.current = { start: newCursor, end: newCursor };
    requestAnimationFrame(() => {
      el?.setSelectionRange(newCursor, newCursor);
      el?.focus();
    });
  }, [description, handleDescriptionChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label htmlFor="video-description" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            {aiTier === 'Generate' ? 'Context' : 'Description'}
          </label>
          {aiTier === 'Manual' && <AINudge featureKey="desc_generator" message="Try AI Polish" tooltipText="Switch to Enrich tier" onClick={() => onTierChange('Enrich')} />}
          {!isUploading && (
            <MetadataTemplates
              currentValue={description}
              category="description"
              onSelect={handleSnippetSelect}
            />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isOverLimit ? 'hsl(var(--destructive))' : isNearLimit ? '#ffb74d' : 'hsl(var(--muted-foreground))' }}>
            {description.length}/{MAX_DESC}
          </span>
          {descUndo && <button type="button" onClick={handleUndoDesc} style={undoButtonStyle}><UndoIcon sx={{ fontSize: 14 }} /> Undo Clear</button>}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea ref={textareaRef} id="video-description" data-testid="video-description" name="description" 
          placeholder={aiTier === 'Generate' ? "Specific keywords or links..." : "Video description..."}
          value={description} onChange={(e) => handleDescriptionChange(e.target.value)} rows={3} 
          onBlur={handleTextareaBlur}
          style={{ ...textareaStyle, borderColor: isOverLimit ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
        />
        {description && <button type="button" onClick={handleClearDesc} style={clearButtonStyle}>✕</button>}
      </div>
    </div>
  );
};
