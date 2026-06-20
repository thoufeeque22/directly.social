/* eslint-disable max-lines */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMetadataTemplates, deleteMetadataTemplate, updateMetadataTemplate } from '@/app/actions/metadata';

export interface Template {
  id: string;
  name: string;
  description: string;
  firstComment: string;
  category: string;
}

interface DBTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

const isDBTemplate = (item: unknown): item is DBTemplate =>
  !!item &&
  typeof item === 'object' &&
  'id' in item && typeof (item as Record<string, unknown>).id === 'string' &&
  'name' in item && typeof (item as Record<string, unknown>).name === 'string' &&
  'content' in item && typeof (item as Record<string, unknown>).content === 'string' &&
  'category' in item && typeof (item as Record<string, unknown>).category === 'string';

const parseContent = (content: string) => {
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object' && 'description' in parsed && 'firstComment' in parsed) {
      return { description: String(parsed.description), firstComment: String(parsed.firstComment) };
    }
  } catch {}
  return { description: content, firstComment: '' };
};

export function useTemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return templates.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(q) ||
                          t.description.toLowerCase().includes(q) ||
                          t.firstComment.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || t.category === categoryFilter.toLowerCase().replace(' ', '_');
      return matchSearch && matchCat;
    });
  }, [templates, searchQuery, categoryFilter]);

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await getMetadataTemplates();
      if (Array.isArray(data)) {
        setTemplates(data.filter(isDBTemplate).map(t => {
          const { description, firstComment } = parseContent(t.content);
          return { id: t.id, name: t.name, description, firstComment, category: t.category };
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleUpdate = useCallback(async (id: string, values: { name: string; description: string; firstComment: string }) => {
    setUpdatingId(id);
    try {
      const content = JSON.stringify({ description: values.description, firstComment: values.firstComment });
      const updated = await updateMetadataTemplate(id, { name: values.name, content });
      if (isDBTemplate(updated)) {
        const parsed = parseContent(updated.content);
        setTemplates(prev => prev.map(t => t.id === id ? { id, name: updated.name, category: updated.category, ...parsed } : t));
      } else {
        throw new Error('Invalid template data returned from server.');
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMetadataTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    filteredTemplates,
    isLoading,
    deletingId,
    updatingId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    handleUpdate,
    handleDelete
  };
}
