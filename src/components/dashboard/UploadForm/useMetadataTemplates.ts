'use client';

import { useState, useEffect } from 'react';
import { getMetadataTemplates, createMetadataTemplate } from '@/app/actions/metadata';

interface Template {
  id: string;
  name: string;
  content: string;
}

export function useMetadataTemplates(isOpen: boolean) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await getMetadataTemplates();
      setTemplates(data as Template[]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTemplates();
  }, [isOpen]);

  const saveTemplate = async (name: string, content: string) => {
    if (!name.trim() || !content.trim()) return null;
    setIsSaving(true);
    try {
      const newTemplate = await createMetadataTemplate({ name, content });
      setTemplates(prev => [newTemplate as Template, ...prev]);
      return newTemplate;
    } catch (error) {
      console.error('Failed to save template:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { templates, isLoading, isSaving, saveTemplate };
}
