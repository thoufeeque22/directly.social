import React from 'react';
import { PLATFORMS } from '@/lib/core/constants';

interface TabsProps {
  platformIds: string[];
  activePlatform: string;
  onSelect: (id: string) => void;
}

export const PlatformTabs: React.FC<TabsProps> = ({ platformIds, activePlatform, onSelect }) => (
  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
    {platformIds.map(pid => {
      const p = PLATFORMS.find(info => info.id === pid);
      const isActive = activePlatform === pid;
      return (
        <button key={pid} onClick={() => onSelect(pid)} style={tabStyle(isActive)}>
          <span>{p?.icon}</span>
          <span style={{ fontWeight: isActive ? 600 : 400 }}>{p?.name}</span>
        </button>
      );
    })}
  </div>
);

const tabStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.75rem',
  border: `1px solid ${isActive ? 'hsl(var(--primary))' : 'hsla(var(--border) / 0.5)'}`,
  background: isActive ? 'hsla(var(--primary) / 0.1)' : 'transparent',
  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
  cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap', transition: 'all 0.2s'
});
