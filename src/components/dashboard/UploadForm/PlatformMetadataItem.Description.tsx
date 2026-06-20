import React, { useRef, useCallback } from 'react';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';
import UndoIcon from '@mui/icons-material/Undo';
import { PLATFORM_LIMITS } from '@/lib/core/constants';
import { inputStyle } from './PlatformMetadataFields.styles';
import { clearButtonStyle as globalClearStyle, undoButtonStyle } from './StandardMetadataFields.Title.styles';
import { AITier } from '@/lib/core/constants';
import { insertAtCursor } from '@/lib/utils/insertAtCursor';

interface PlatformDescriptionFieldProps {
  platform: string;
  isUploading: boolean;
  aiTier: string;
  value: string;
  showUndo: boolean;
  onChange: (p: string, v: string) => void;
  onClear: (p: string) => void;
  onUndo: () => void;
  onTierChange: (t: AITier) => void;
}

export const PlatformDescriptionField: React.FC<PlatformDescriptionFieldProps> = ({
  platform, isUploading, aiTier, value, showUndo, onChange, onClear, onUndo, onTierChange
}) => {
  const limits = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.default;
  const isOver = value.length > limits.description;
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

  const handleSnippetSelect = useCallback((snippet: string) => {
    const el = textareaRef.current;
    const { start, end } = cursorPosRef.current ?? { start: value.length, end: value.length };
    const newValue = insertAtCursor(value, snippet, '\n', start, end);
    onChange(platform, newValue);
    const needsSepBefore = start > 0 && !value.slice(0, start).endsWith('\n');
    const newCursor = start + snippet.length + (needsSepBefore ? 1 : 0);
    cursorPosRef.current = { start: newCursor, end: newCursor };
    requestAnimationFrame(() => {
      el?.setSelectionRange(newCursor, newCursor);
      el?.focus();
    });
  }, [value, platform, onChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
            {platform} Description
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="desc_generator" message="Try AI" tooltipText="Switch to Enrich tier" onClick={() => onTierChange('Enrich')} />
          )}
          {!isUploading && (
            <MetadataTemplates currentValue={value} category="description" onSelect={handleSnippetSelect} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
            {value.length}/{limits.description}
          </span>
          {showUndo && (
            <button type="button" onClick={onUndo} style={undoButtonStyle}>
              <UndoIcon sx={{ fontSize: 12 }} /> <span style={{ fontSize: '0.65rem' }}>Undo Clear</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea 
          ref={textareaRef}
          name={`description_${platform}`}
          placeholder={`Specific ${platform} description...`} 
          value={value} 
          onChange={(e) => onChange(platform, e.target.value)} 
          onBlur={handleTextareaBlur}
          rows={3} 
          style={{ ...inputStyle, resize: 'none', paddingRight: '2.5rem', borderColor: isOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
        />
        {value && (
          <button type="button" onClick={() => onClear(platform)} style={{ ...globalClearStyle, top: '0.75rem', transform: 'none' }}>✕</button>
        )}
      </div>
    </div>
  );
};