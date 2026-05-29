'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useUploadForm } from '@/hooks/dashboard/useUploadForm';
import { UploadFormProps, UploadFormContextType } from './UploadFormContext.types';
import { getSelectedPlatforms } from './UploadFormContext.utils';
import { getByosConfigAction } from '@/lib/actions/settings';

const UploadFormContext = createContext<UploadFormContextType | undefined>(undefined);

const useBYOSConfig = (initial?: { provider: string; bucketName: string } | null) => {
  const [config, setConfig] = useState<{ active: boolean; provider: 'S3' | 'R2' | null }>({ 
    active: !!initial, 
    provider: (initial?.provider as 'S3' | 'R2') || null 
  });
  
  useEffect(() => {
    if (initial) return; // Skip fetch if we already have initial data
    
    let mounted = true;
    getByosConfigAction()
      .then(data => {
        if (mounted && data?.config) {
          setConfig({ active: true, provider: data.config.provider as 'S3' | 'R2' });
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [initial]);
  return config;
};

export const UploadFormProvider: React.FC<{ children: React.ReactNode; props: UploadFormProps }> = ({ children, props }) => {
  const uploadFormState = useUploadForm();
  const [showGallery, setShowGallery] = useState(false);
  const byos = useBYOSConfig(props.initialByosConfig);

  const selectedPlatforms = useMemo(() => 
    getSelectedPlatforms(props.selectedAccountIds, props.accounts), 
    [props.selectedAccountIds, props.accounts]
  );

  const value = {
    ...props, ...uploadFormState, selectedPlatforms, 
    byosActive: byos.active, byosProvider: byos.provider, 
    showGallery, setShowGallery
  };

  return <UploadFormContext.Provider value={value}>{children}</UploadFormContext.Provider>;
};

export const useUploadFormContext = () => {
  const context = useContext(UploadFormContext);
  if (!context) throw new Error('useUploadFormContext must be used within an UploadFormProvider');
  return context;
};
