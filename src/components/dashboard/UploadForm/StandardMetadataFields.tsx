'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';

export const StandardMetadataFields: React.FC = () => {
  const {
    isPlatformSpecific, aiTier, isUploading, onTierChange, onVisualScan,
    title, handleTitleChange, titleUndo, handleUndoTitle, handleClearTitle,
    description, handleDescriptionChange, descUndo, handleUndoDesc, handleClearDesc,
    appendDescription
  } = useUploadFormContext();

  if (isPlatformSpecific) return null;

  return (
    <>
      {/* Title Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="video-title" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {aiTier === 'Generate' ? 'Video Prompt' : 'Video Title'}
            </label>
            {aiTier === 'Manual' && (
              <AINudge 
                featureKey="title_generator"
                message="Try AI Title"
                tooltipText="Switch to Generate tier to let AI write an engaging title"
                onClick={() => onTierChange('Generate')}
              />
            )}
            {aiTier === 'Generate' && !isUploading && (
              <button
                type="button"
                onClick={async () => {
                  const { getDraftFile } = await import('@/lib/upload/file-store');
                  const file = await getDraftFile();
                  if (!file) { alert("Please select a video file first."); return; }
                  await onVisualScan(file);
                }}
                style={{ background: 'hsla(var(--primary)/0.1)', border: '1px solid hsla(var(--primary)/0.3)', color: 'hsl(var(--primary))', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Auto-Scan Video
              </button>
            )}
          </div>
          {titleUndo && (
            <button type="button" onClick={handleUndoTitle} style={{ background: 'transparent', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              ↩️ Undo Clear
            </button>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            id="video-title"
            data-testid="video-title"
            type="text" 
            name="title" 
            placeholder={aiTier === 'Generate' ? "Describe your video concept..." : "Catchy title..."}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            style={{ background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%' }} 
          />
          {title && (
            <button type="button" onClick={handleClearTitle} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'hsla(var(--foreground)/0.1)', border: 'none', color: 'hsl(var(--muted-foreground))', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label htmlFor="video-description" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {aiTier === 'Generate' ? 'Context' : 'Description'}
            </label>
            {aiTier === 'Manual' && (
              <AINudge 
                featureKey="desc_generator"
                message="Try AI Polish"
                tooltipText="Switch to Enrich tier to automatically format and polish your description"
                onClick={() => onTierChange('Enrich')}
              />
            )}
            {!isUploading && (
              <MetadataTemplates 
                onSelect={(val) => appendDescription(val)} 
                currentContent={description} 
              />
            )}
          </div>
          {descUndo && (
            <button type="button" onClick={handleUndoDesc} style={{ background: 'transparent', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              ↩️ Undo Clear
            </button>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <textarea 
            id="video-description"
            data-testid="video-description"
            name="description" 
            placeholder={aiTier === 'Generate' ? "Specific keywords or links..." : "Video description..."}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={3}
            style={{ background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%', resize: 'none' }} 
          />
          {description && (
            <button type="button" onClick={handleClearDesc} style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', background: 'hsla(var(--foreground)/0.1)', border: 'none', color: 'hsl(var(--muted-foreground))', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
          )}
        </div>
      </div>
    </>
  );
};
