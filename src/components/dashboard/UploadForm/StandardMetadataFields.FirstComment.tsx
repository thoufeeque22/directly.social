'use client';

import React, { useRef, useCallback } from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { inputStyle } from './PlatformMetadataFields.styles';
import { MetadataTemplates } from './MetadataTemplates';
import { insertAtCursor } from '@/lib/utils/insertAtCursor';

export const FirstCommentField: React.FC = () => {
  const { firstCommentText, handleFirstCommentChange, isUploading } = useUploadFormContext();

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
    const { start, end } = cursorPosRef.current ?? { start: firstCommentText.length, end: firstCommentText.length };
    const newValue = insertAtCursor(firstCommentText, snippet, '\n', start, end);
    handleFirstCommentChange(newValue);
    const needsSepBefore = start > 0 && !firstCommentText.slice(0, start).endsWith('\n');
    const newCursor = start + snippet.length + (needsSepBefore ? 1 : 0);
    cursorPosRef.current = { start: newCursor, end: newCursor };
    requestAnimationFrame(() => {
      if (!el) return;
      el.setSelectionRange(newCursor, newCursor);
      el.focus();
    });
  }, [firstCommentText, handleFirstCommentChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
          Global First Comment
        </label>
        {!isUploading && (
          <MetadataTemplates
            currentValue={firstCommentText}
            category="first_comment"
            onSelect={handleSnippetSelect}
          />
        )}
      </div>
      <textarea 
        ref={textareaRef}
        name="firstComment"
        placeholder="Write a first comment for all platforms..." 
        value={firstCommentText} 
        onChange={(e) => handleFirstCommentChange(e.target.value)} 
        onBlur={handleTextareaBlur}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
      />
    </div>
  );
};
