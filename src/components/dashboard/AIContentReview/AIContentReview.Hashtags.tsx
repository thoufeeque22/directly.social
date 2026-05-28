import React, { useState } from 'react';
import { tagStyle } from './AIContentReview.styles';

interface HashtagsProps {
  hashtags: string[];
  platformName: string;
  isLimited: boolean;
  onUpdate: (tags: string[]) => void;
}

export const ReviewHashtags: React.FC<HashtagsProps> = ({ hashtags, platformName, isLimited, onUpdate }) => {
  const [newTag, setNewTag] = useState("");
  const addTag = () => {
    if (newTag.trim()) {
      let t = newTag.trim();
      if (!t.startsWith('#')) t = '#' + t;
      onUpdate([...hashtags, t]);
      setNewTag('');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>Suggested Tags</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {hashtags.map((tag, i) => (
          <span key={i} style={tagStyle}>{tag}<button type="button" onClick={() => { const next = [...hashtags]; next.splice(i, 1); onUpdate(next); }} style={xStyle}>×</button></span>
        ))}
      </div>
      {!isLimited && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input type="text" placeholder="Add a tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} style={tagInputStyle} />
          <button type="button" onClick={addTag} style={addBtnStyle}>Add</button>
        </div>
      )}
      {isLimited && <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Max 5 tags reached for {platformName}.</span>}
    </div>
  );
};

const xStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'currentColor', cursor: 'pointer', padding: 0, marginLeft: '4px', opacity: 0.7 };
const tagInputStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', fontSize: '0.8rem', width: '150px' };
const addBtnStyle: React.CSSProperties = { background: 'hsla(var(--primary) / 0.2)', color: 'hsl(var(--primary))', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' };
