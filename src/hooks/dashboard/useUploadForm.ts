/* eslint-disable max-lines */
import { useState, useEffect } from 'react';

interface FormState {
  title: string;
  description: string;
  platformTitles: Record<string, string>;
  platformDescriptions: Record<string, string>;
  isPlatformSpecific: boolean;
}

export function useUploadForm() {
  const initialState = {
    title: '',
    description: '',
    platformTitles: {},
    platformDescriptions: {},
    isPlatformSpecific: false
  };

  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: localStorage.getItem('SS_DRAFT_TITLE') || '',
        description: localStorage.getItem('SS_DRAFT_DESC') || '',
        isPlatformSpecific: localStorage.getItem('SS_METADATA_SPECIFIC') === 'true',
        platformTitles: JSON.parse(localStorage.getItem('SS_PLATFORM_TITLES') || '{}'),
        platformDescriptions: JSON.parse(localStorage.getItem('SS_PLATFORM_DESCS') || '{}')
      });
    } catch (e) {
      console.error("Failed to load metadata from localStorage", e);
    }
  }, []);
  
  const [titleUndo, setTitleUndo] = useState<string | null>(null);
  const [descUndo, setDescUndo] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setForm(prev => ({ ...prev, title: val }));
    localStorage.setItem('SS_DRAFT_TITLE', val);
  };

  const handleDescriptionChange = (val: string) => {
    setForm(prev => ({ ...prev, description: val }));
    localStorage.setItem('SS_DRAFT_DESC', val);
  };

  const appendDescription = (val: string, platform?: string) => {
    setForm(prev => {
      if (platform) {
        const current = prev.platformDescriptions[platform] || '';
        const separator = current && !current.endsWith('\n') ? '\n' : '';
        const nextDescs = { ...prev.platformDescriptions, [platform]: current + separator + val };
        localStorage.setItem('SS_PLATFORM_DESCS', JSON.stringify(nextDescs));
        return { ...prev, platformDescriptions: nextDescs };
      } else {
        const current = prev.description || '';
        const separator = current && !current.endsWith('\n') ? '\n' : '';
        const nextDesc = current + separator + val;
        localStorage.setItem('SS_DRAFT_DESC', nextDesc);
        return { ...prev, description: nextDesc };
      }
    });
  };

  const handlePlatformTitleChange = (platform: string, val: string) => {
    setForm(prev => {
      const nextTitles = { ...prev.platformTitles, [platform]: val };
      localStorage.setItem('SS_PLATFORM_TITLES', JSON.stringify(nextTitles));
      return { ...prev, platformTitles: nextTitles };
    });
  };

  const handlePlatformDescriptionChange = (platform: string, val: string) => {
    setForm(prev => {
      const nextDescs = { ...prev.platformDescriptions, [platform]: val };
      localStorage.setItem('SS_PLATFORM_DESCS', JSON.stringify(nextDescs));
      return { ...prev, platformDescriptions: nextDescs };
    });
  };

  const togglePlatformSpecific = (val: boolean) => {
    setForm(prev => ({ ...prev, isPlatformSpecific: val }));
    localStorage.setItem('SS_METADATA_SPECIFIC', String(val));
  };

  const handleClearTitle = () => {
    setTitleUndo(form.title);
    handleTitleChange('');
    setTimeout(() => setTitleUndo(null), 5000);
  };

  const handleUndoTitle = () => {
    if (titleUndo) {
      handleTitleChange(titleUndo);
      setTitleUndo(null);
    }
  };

  const handleClearDesc = () => {
    setDescUndo(form.description);
    handleDescriptionChange('');
    setTimeout(() => setDescUndo(null), 5000);
  };

  const handleUndoDesc = () => {
    if (descUndo) {
      handleDescriptionChange(descUndo);
      setDescUndo(null);
    }
  };

  const resetForm = () => {
    handleTitleChange('');
    handleDescriptionChange('');
    setTitleUndo(null);
    setDescUndo(null);
  };

  return {
    title: form.title,
    description: form.description,
    platformTitles: form.platformTitles,
    platformDescriptions: form.platformDescriptions,
    isPlatformSpecific: form.isPlatformSpecific,
    titleUndo,
    descUndo,
    handleTitleChange,
    handleDescriptionChange,
    appendDescription,
    handlePlatformTitleChange,
    handlePlatformDescriptionChange,
    togglePlatformSpecific,
    handleClearTitle,
    handleUndoTitle,
    handleClearDesc,
    handleUndoDesc,
    resetForm
  };
}
