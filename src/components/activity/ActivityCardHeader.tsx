import React from 'react';
import styles from '@/app/(dashboard)/activity/activity.module.css';
import { PlatformResult } from '@/hooks/useActivity';

interface ActivityCardHeaderProps {
  title: string;
  description?: string | null;
  isCardActive: boolean;
  isOptimistic: boolean;
  isPostCancelled: boolean;
  platforms: PlatformResult[];
}

export function ActivityCardHeader({
  title,
  isCardActive,
  isOptimistic,
  isPostCancelled,
  platforms
}: ActivityCardHeaderProps) {
  // Logic to determine if we should surface platform-specific titles
  const platformTitles = platforms
    .map(p => p.metadata?.title)
    .filter((t): t is string => !!t && t.length > 0);
  
  const uniquePlatformTitles = Array.from(new Set(platformTitles));
  const hasMultipleTitles = uniquePlatformTitles.length > 1;
  
  // If the main title is just the date fallback and we have platform-specific titles
  // Let's use the first platform title as the primary one
  const displayTitle = ((!title || title.trim() === '' || title === 'Untitled Post' || title.match(/^\d+ [A-Z][a-z]+ \d{4}$/)) && platformTitles.length > 0)
    ? platformTitles[0]
    : (title || 'Untitled Post');

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h3 className={styles.postTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {isCardActive && <span className={styles.processingDot} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle}</span>
        {isOptimistic && !isPostCancelled && <span style={{ opacity: 0.6, fontSize: '0.7em' }}>(Initializing)</span>}
        {hasMultipleTitles && (
          <span style={{ 
            fontSize: '0.65rem', 
            background: 'hsla(var(--primary)/0.2)', 
            color: 'hsl(var(--primary))', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            Multi-Title
          </span>
        )}
      </h3>
    </div>
  );
}
