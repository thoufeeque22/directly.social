import { useUploadFormState } from './useUploadFormState';
import { useUploadFormHandlers } from './useUploadFormHandlers';

/**
 * (CA-002): Composable hook for Upload Form state management.
 * Logic extracted to State and Handlers modules to meet 100-line limit.
 */
export function useUploadForm() {
  const { form, setForm } = useUploadFormState();
  const handlers = useUploadFormHandlers(form, setForm);

  return {
    title: form.title,
    description: form.description,
    platformTitles: form.platformTitles,
    platformDescriptions: form.platformDescriptions,
    isPlatformSpecific: form.isPlatformSpecific,
    ...handlers
  };
}