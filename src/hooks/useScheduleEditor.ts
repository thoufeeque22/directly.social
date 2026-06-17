import { useState } from 'react';
import { useScheduleData } from './useScheduleData';
import { useScheduleActions } from './useScheduleActions';
import { useScheduleAI } from './useScheduleAI';
import { PostActivityEntry } from '@/app/schedule/types';

export function useScheduleEditor() {
  const [editingPost, setEditingPost] = useState<PostActivityEntry | null>(null);

  const dataProps = useScheduleData();
  const { setPosts, fetchSchedule } = dataProps;

  const actionProps = useScheduleActions(
    setPosts, fetchSchedule, setEditingPost, editingPost
  );
  
  const aiProps = useScheduleAI(
    editingPost, setEditingPost, fetchSchedule, actionProps.setIsSaving
  );

  return {
    ...dataProps,
    ...actionProps,
    ...aiProps,
    editingPost,
    setEditingPost
  };
}
