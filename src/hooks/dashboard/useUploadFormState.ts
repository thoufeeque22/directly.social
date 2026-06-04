import { useState, useEffect } from 'react';

export interface FormState {
  title: string;
  description: string;
  platformTitles: Record<string, string>;
  platformDescriptions: Record<string, string>;
  isPlatformSpecific: boolean;
}

export const useUploadFormState = () => {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    platformTitles: {},
    platformDescriptions: {},
    isPlatformSpecific: false
  });

  useEffect(() => {
    try {
      const saved = {
        title: localStorage.getItem('SS_DRAFT_TITLE') || '',
        description: localStorage.getItem('SS_DRAFT_DESC') || '',
        isPlatformSpecific: localStorage.getItem('SS_METADATA_SPECIFIC') === 'true',
        platformTitles: JSON.parse(localStorage.getItem('SS_PLATFORM_TITLES') || '{}'),
        platformDescriptions: JSON.parse(localStorage.getItem('SS_PLATFORM_DESCS') || '{}')
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(saved);
    } catch (e) {
      console.error("Failed to load metadata from localStorage", e);
    }
  }, []);

  return { form, setForm };
};