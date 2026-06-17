import { useState } from 'react';
import { FormState } from './useUploadFormState';
import { useUploadFormPlatformHandlers } from './useUploadFormPlatformHandlers';

export const useUploadFormHandlers = (form: FormState, setForm: React.Dispatch<React.SetStateAction<FormState>>) => {
  const [titleUndo, setTitleUndo] = useState<{ val: string; platform?: string } | null>(null);
  const [descUndo, setDescUndo] = useState<{ val: string; platform?: string } | null>(null);
  const ph = useUploadFormPlatformHandlers(form, setForm);

  const handleTitleChange = (val: string) => { setForm(p => ({ ...p, title: val })); localStorage.setItem('SS_DRAFT_TITLE', val); };
  const handleDescriptionChange = (val: string) => { setForm(p => ({ ...p, description: val })); localStorage.setItem('SS_DRAFT_DESC', val); };
  const handleHashtagsChange = (val: string) => { setForm(p => ({ ...p, hashtags: val })); localStorage.setItem('SS_DRAFT_HASHTAGS', val); };
  const handleFirstCommentChange = (val: string) => { setForm(p => ({ ...p, firstCommentText: val })); localStorage.setItem('SS_DRAFT_COMMENT', val); };
  const handleScheduledAtChange = (val: string) => { setForm(p => ({ ...p, scheduledAt: val })); localStorage.setItem('SS_DRAFT_SCHEDULE', val); };

  const appendDescription = (val: string, platform?: string) => {
    setForm(prev => {
      if (platform) {
        const current = prev.platformDescriptions[platform] || '';
        const sep = current && !current.endsWith('\n') ? '\n' : '';
        const next = { ...prev.platformDescriptions, [platform]: current + sep + val };
        localStorage.setItem('SS_PLATFORM_DESCS', JSON.stringify(next));
        return { ...prev, platformDescriptions: next };
      }
      const current = prev.description || '';
      const sep = current && !current.endsWith('\n') ? '\n' : '';
      const nextDesc = current + sep + val;
      localStorage.setItem('SS_DRAFT_DESC', nextDesc);
      return { ...prev, description: nextDesc };
    });
  };

  const togglePlatformOverride = (platform: string, enabled: boolean) => {
    setForm(prev => {
      let nextOverridden = [...prev.overriddenPlatforms];
      const nextTitles = { ...prev.platformTitles }, nextDescs = { ...prev.platformDescriptions };
      const nextHashtags = { ...prev.platformHashtags }, nextComments = { ...prev.platformFirstComments }, nextSchedules = { ...prev.platformSchedules };
      if (enabled) {
        if (!nextOverridden.includes(platform)) {
          nextOverridden.push(platform);
          nextTitles[platform] = prev.title; nextDescs[platform] = prev.description;
          nextHashtags[platform] = prev.hashtags; nextComments[platform] = prev.firstCommentText; nextSchedules[platform] = prev.scheduledAt;
        }
      } else {
        nextOverridden = nextOverridden.filter(p => p !== platform);
        delete nextTitles[platform]; delete nextDescs[platform]; delete nextHashtags[platform]; delete nextComments[platform]; delete nextSchedules[platform];
      }
      localStorage.setItem('SS_OVERRIDDEN_PLATFORMS', JSON.stringify(nextOverridden));
      localStorage.setItem('SS_PLATFORM_TITLES', JSON.stringify(nextTitles));
      localStorage.setItem('SS_PLATFORM_DESCS', JSON.stringify(nextDescs));
      localStorage.setItem('SS_PLATFORM_HASHTAGS', JSON.stringify(nextHashtags));
      localStorage.setItem('SS_PLATFORM_COMMENTS', JSON.stringify(nextComments));
      localStorage.setItem('SS_PLATFORM_SCHEDULES', JSON.stringify(nextSchedules));
      return { ...prev, overriddenPlatforms: nextOverridden, platformTitles: nextTitles, platformDescriptions: nextDescs, platformHashtags: nextHashtags, platformFirstComments: nextComments, platformSchedules: nextSchedules };
    });
  };

  const handleClearTitle = () => { setTitleUndo({ val: form.title }); handleTitleChange(''); setTimeout(() => setTitleUndo(null), 5000); };
  const handleUndoTitle = () => { if (titleUndo) { if (titleUndo.platform) ph.handlePlatformTitleChange(titleUndo.platform, titleUndo.val); else handleTitleChange(titleUndo.val); setTitleUndo(null); } };
  const handleClearDesc = () => { setDescUndo({ val: form.description }); handleDescriptionChange(''); setTimeout(() => setDescUndo(null), 5000); };
  const handleUndoDesc = () => { if (descUndo) { if (descUndo.platform) ph.handlePlatformDescriptionChange(descUndo.platform, descUndo.val); else handleDescriptionChange(descUndo.val); setDescUndo(null); } };
  const handleClearPlatformTitle = (platform: string) => { setTitleUndo({ val: form.platformTitles[platform] || '', platform }); ph.handlePlatformTitleChange(platform, ''); setTimeout(() => setTitleUndo(null), 5000); };
  const handleClearPlatformDesc = (platform: string) => { setDescUndo({ val: form.platformDescriptions[platform] || '', platform }); ph.handlePlatformDescriptionChange(platform, ''); setTimeout(() => setDescUndo(null), 5000); };

  const resetForm = () => { handleTitleChange(''); handleDescriptionChange(''); setTitleUndo(null); setDescUndo(null); };

  return {
    ...ph, titleUndo, descUndo, handleTitleChange, handleDescriptionChange, handleHashtagsChange, handleFirstCommentChange, handleScheduledAtChange,
    appendDescription, togglePlatformOverride, resetToGlobal: (p: string) => togglePlatformOverride(p, false), togglePlatformSpecific: (v: boolean) => { setForm(prev => ({ ...prev, isPlatformSpecific: v })); localStorage.setItem('SS_METADATA_SPECIFIC', String(v)); },
    handleClearTitle, handleUndoTitle, handleClearDesc, handleUndoDesc, handleClearPlatformTitle, handleClearPlatformDesc, resetForm
  };
};
