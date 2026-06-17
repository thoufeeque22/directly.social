import { FormState } from './useUploadFormState';

export const useUploadFormPlatformHandlers = (
  form: FormState, 
  setForm: React.Dispatch<React.SetStateAction<FormState>>
) => {
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

  const handlePlatformHashtagChange = (platform: string, val: string) => {
    setForm(prev => {
      const next = { ...prev.platformHashtags, [platform]: val };
      localStorage.setItem('SS_PLATFORM_HASHTAGS', JSON.stringify(next));
      return { ...prev, platformHashtags: next };
    });
  };

  const handlePlatformFirstCommentChange = (platform: string, val: string) => {
    setForm(prev => {
      const next = { ...prev.platformFirstComments, [platform]: val };
      localStorage.setItem('SS_PLATFORM_COMMENTS', JSON.stringify(next));
      return { ...prev, platformFirstComments: next };
    });
  };

  const handlePlatformScheduleChange = (platform: string, val: string) => {
    setForm(prev => {
      const next = { ...prev.platformSchedules, [platform]: val };
      localStorage.setItem('SS_PLATFORM_SCHEDULES', JSON.stringify(next));
      return { ...prev, platformSchedules: next };
    });
  };

  return {
    handlePlatformTitleChange,
    handlePlatformDescriptionChange,
    handlePlatformHashtagChange,
    handlePlatformFirstCommentChange,
    handlePlatformScheduleChange
  };
};
