import { useState } from 'react';
import { FormState } from './useUploadFormState';

export const useUploadFormHandlers = (form: FormState, setForm: React.Dispatch<React.SetStateAction<FormState>>) => {
  const [titleUndo, setTitleUndo] = useState<{ val: string; platform?: string } | null>(null);
  const [descUndo, setDescUndo] = useState<{ val: string; platform?: string } | null>(null);

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

  const handleClearTitle = () => { setTitleUndo({ val: form.title }); handleTitleChange(''); setTimeout(() => setTitleUndo(null), 5000); };
  const handleUndoTitle = () => { if (titleUndo) { if (titleUndo.platform) handlePlatformTitleChange(titleUndo.platform, titleUndo.val); else handleTitleChange(titleUndo.val); setTitleUndo(null); } };
  const handleClearDesc = () => { setDescUndo({ val: form.description }); handleDescriptionChange(''); setTimeout(() => setDescUndo(null), 5000); };
  const handleUndoDesc = () => { if (descUndo) { if (descUndo.platform) handlePlatformDescriptionChange(descUndo.platform, descUndo.val); else handleDescriptionChange(descUndo.val); setDescUndo(null); } };
  const handleClearPlatformTitle = (platform: string) => { setTitleUndo({ val: form.platformTitles[platform] || '', platform }); handlePlatformTitleChange(platform, ''); setTimeout(() => setTitleUndo(null), 5000); };
  const handleClearPlatformDesc = (platform: string) => { setDescUndo({ val: form.platformDescriptions[platform] || '', platform }); handlePlatformDescriptionChange(platform, ''); setTimeout(() => setDescUndo(null), 5000); };

  const resetForm = () => { handleTitleChange(''); handleDescriptionChange(''); setTitleUndo(null); setDescUndo(null); };

  return {
    titleUndo, descUndo, handleTitleChange, handleDescriptionChange, appendDescription,
    handlePlatformTitleChange, handlePlatformDescriptionChange, togglePlatformSpecific,
    handleClearTitle, handleUndoTitle, handleClearDesc, handleUndoDesc,
    handleClearPlatformTitle, handleClearPlatformDesc, resetForm
  };
};