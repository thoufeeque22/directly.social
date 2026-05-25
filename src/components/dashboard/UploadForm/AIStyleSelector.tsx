import React from 'react';
import { STYLE_MODES, StyleMode } from '@/lib/core/constants';

interface Props {
  contentMode: StyleMode;
  onModeChange: (mode: StyleMode) => void;
  customStyleText: string;
  onCustomStyleChange: (text: string) => void;
}

const DESCRIPTIONS: Record<StyleMode, string> = {
  Smart: " Let AI decide the best strategy for each platform.",
  "Gen-Z": " High-energy, trendy, and scroll-stopping vibes.",
  SEO: " Search-optimized content for long-term discoverability.",
  Story: " Narrative storytelling to build a human connection.",
  Custom: " Define your own unique persona and writing style."
};

export const AIStyleSelector: React.FC<Props> = ({ contentMode, onModeChange, customStyleText, onCustomStyleChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Writing Strategy</label>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {STYLE_MODES.map(mode => (
        <button key={mode} type="button" title={DESCRIPTIONS[mode]} onClick={() => onModeChange(mode)}
          style={{
            padding: '0.55rem 1.15rem', borderRadius: '2rem',
            border: `1px solid ${contentMode === mode ? 'hsl(var(--primary))' : 'hsla(var(--border) / 0.4)'}`,
            background: contentMode === mode ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--muted) / 0.1)',
            color: contentMode === mode ? 'white' : 'hsl(var(--muted-foreground))',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: contentMode === mode ? 700 : 500, transition: 'all 0.2s',
          }}
        >
          {mode}
        </button>
      ))}
    </div>
    {contentMode === 'Custom' && (
      <input type="text" value={customStyleText} onChange={(e) => onCustomStyleChange(e.target.value)}
        placeholder="Describe your custom vibe..." style={customInputStyle} />
    )}
  </div>
);

const customInputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
  background: 'hsla(var(--background) / 0.5)', border: '1px solid hsla(var(--primary) / 0.3)',
  color: 'white', fontSize: '0.85rem', outline: 'none'
};
