import { useState } from 'react';
import { updateScheduledPost } from '@/app/actions/activity/update-schedule';
import { deleteScheduledPost, publishNowAction } from '@/app/actions/activity/delete-schedule';
import { PostActivityEntry } from '@/app/(dashboard)/schedule/types';

export function useScheduleActions(
  setPosts: React.Dispatch<React.SetStateAction<PostActivityEntry[]>>,
  fetchSchedule: () => void,
  setEditingPost: React.Dispatch<React.SetStateAction<PostActivityEntry | null>>,
  editingPost: PostActivityEntry | null
) {
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled post? The video file will be deleted.')) return;
    try {
      await deleteScheduledPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    } catch (err: unknown) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handlePublishNow = async (id: string) => {
    if (!confirm('Publish this post immediately?')) return;
    try {
      await publishNowAction(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
      alert('Post moved to publishing queue! Check Activity in a few moments.');
    } catch (err: unknown) {
      alert(`Failed to publish: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingPost) return;
    setIsSaving(true);
    try {
      await updateScheduledPost(editingPost.id, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        scheduledAt: formData.get('scheduledAt') as string,
      });
      setEditingPost(null);
      fetchSchedule();
      globalThis.dispatchEvent(new CustomEvent('refresh-upcoming'));
    } catch (err: unknown) {
      alert(`Update failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, setIsSaving, handleDelete, handlePublishNow, handleUpdate };
}
