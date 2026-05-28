import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { disclaimerStyle } from './AIContentReview.styles';

export const ReviewHeader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <AutoAwesomeIcon sx={{ fontSize: 24, color: 'hsl(var(--primary))' }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Review AI Strategy</h2>
    </div>
    <span style={stepBadgeStyle}>Step 2 of 2</span>
  </div>
);

export const AIDisclaimer: React.FC = () => (
  <div style={disclaimerStyle}>
    <p style={{ fontSize: '0.85rem', color: 'hsl(45, 100%, 40%)', margin: 0, lineHeight: 1.5 }}>
      <strong>⚠️ AI Content Disclaimer:</strong> Our Intelligence Layer generates platform-specific hooks. Captions may contain creative inaccuracies. Please verify hashtags and links before distributing.
    </p>
  </div>
);

const stepBadgeStyle: React.CSSProperties = { fontSize: '0.75rem', padding: '4px 10px', borderRadius: '2rem', background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', fontWeight: 600, border: '1px solid hsla(var(--primary) / 0.3)' };
