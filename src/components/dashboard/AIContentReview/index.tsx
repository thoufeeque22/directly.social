import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PLATFORMS, PLATFORM_LIMITS } from '@/lib/core/constants';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { ReviewHeader, AIDisclaimer } from './AIContentReview.Header';
import { PlatformTabs } from './AIContentReview.Tabs';
import { ReviewFields } from './AIContentReview.Fields';
import { ReviewHashtags } from './AIContentReview.Hashtags';
import { ReviewActions } from './AIContentReview.Actions';

interface Props { previews: Record<string, AIWriteResult>; onConfirm: (v: Record<string, AIWriteResult>) => void; onBack: () => void; isProcessing: boolean; }

export const AIContentReview: React.FC<Props> = ({ previews, onConfirm, onBack, isProcessing }) => {
  const [edited, setEdited] = useState(previews);
  const platformIds = Object.keys(previews);
  const [activePid, setActivePid] = useState(platformIds[0]);

  const activeData = edited[activePid];
  const activeInfo = PLATFORMS.find(p => p.id === activePid) || PLATFORMS[0];
  const limits = PLATFORM_LIMITS[activePid] || { description: 2000 };
  const isLimited = ['instagram', 'tiktok', 'global'].includes(activePid) && activeData.hashtags.length >= 5;

  const update = (f: keyof AIWriteResult, v: string | string[]) => setEdited(prev => ({ ...prev, [activePid]: { ...prev[activePid], [f]: v } }));

  return (
    <GlassCard style={{ padding: '2rem', animation: 'slideUp 0.4s ease-out' }}>
      <ReviewHeader />
      <AIDisclaimer />
      <PlatformTabs platformIds={platformIds} activePlatform={activePid} onSelect={setActivePid} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <ReviewFields activePlatform={activePid} activeData={activeData} limits={limits} onUpdate={update} />
        <ReviewHashtags hashtags={activeData.hashtags} platformName={activeInfo.name} isLimited={isLimited} onUpdate={(tags) => update('hashtags', tags)} />
      </div>
      <ReviewActions onBack={onBack} onConfirm={() => onConfirm(edited)} isProcessing={isProcessing} />
    </GlassCard>
  );
};
