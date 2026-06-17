import { useState, useEffect } from 'react';

export interface FormState {
  title: string;
  description: string;
  hashtags: string;
  firstCommentText: string;
  scheduledAt: string;
  platformTitles: Record<string, string>;
  platformDescriptions: Record<string, string>;
  overriddenPlatforms: string[];
  platformHashtags: Record<string, string>;
  platformFirstComments: Record<string, string>;
  platformSchedules: Record<string, string>;
  isPlatformSpecific: boolean;
}

export const useUploadFormState = () => {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    hashtags: '',
    firstCommentText: '',
    scheduledAt: '',
    platformTitles: {},
    platformDescriptions: {},
    overriddenPlatforms: [],
    platformHashtags: {},
    platformFirstComments: {},
    platformSchedules: {},
    isPlatformSpecific: false
  });

  useEffect(() => {
    try {
      const saved = {
        title: localStorage.getItem('SS_DRAFT_TITLE') || '',
        description: localStorage.getItem('SS_DRAFT_DESC') || '',
        hashtags: localStorage.getItem('SS_DRAFT_HASHTAGS') || '',
        firstCommentText: localStorage.getItem('SS_DRAFT_COMMENT') || '',
        scheduledAt: localStorage.getItem('SS_DRAFT_SCHEDULE') || '',
        isPlatformSpecific: localStorage.getItem('SS_METADATA_SPECIFIC') === 'true',
        platformTitles: JSON.parse(localStorage.getItem('SS_PLATFORM_TITLES') || '{}'),
        platformDescriptions: JSON.parse(localStorage.getItem('SS_PLATFORM_DESCS') || '{}'),
        overriddenPlatforms: JSON.parse(localStorage.getItem('SS_OVERRIDDEN_PLATFORMS') || '[]'),
        platformHashtags: JSON.parse(localStorage.getItem('SS_PLATFORM_HASHTAGS') || '{}'),
        platformFirstComments: JSON.parse(localStorage.getItem('SS_PLATFORM_COMMENTS') || '{}'),
        platformSchedules: JSON.parse(localStorage.getItem('SS_PLATFORM_SCHEDULES') || '{}')
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(saved);
    } catch (e) {
      console.error("Failed to load metadata from localStorage", e);
    }
  }, []);

  return { form, setForm };
};