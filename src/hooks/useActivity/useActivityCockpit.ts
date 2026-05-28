import { useRef } from 'react';
import { getDraftFile } from '@/lib/upload/file-store';
import { PostActivityEntry } from './types';
import { useCockpitExecution } from './useCockpitExecution';
import { useCockpitAutoStart } from './useCockpitAutoStart';
import { useCockpitPipeline } from './useCockpitPipeline';

interface CockpitProps {
  setPosts: (posts: PostActivityEntry[]) => void;
  fetchActivity: () => Promise<{ data?: PostActivityEntry[] }>;
  setActiveResumingId: (id: string | null) => void;
}

export function useActivityCockpit({ setPosts, fetchActivity, setActiveResumingId }: CockpitProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const executeCockpitDistribution = useCockpitExecution(setPosts, fetchActivity, setActiveResumingId);
  const executePipeline = useCockpitPipeline(setPosts, fetchActivity, setActiveResumingId);

  useCockpitAutoStart({ setPosts, fetchActivity, setActiveResumingId, executeCockpitDistribution });

  const handleInPlaceResume = async (post: PostActivityEntry) => {
    setActiveResumingId(post.id);
    try {
      const file = await getDraftFile();
      if (!file) {
        if (fileInputRef.current) {
          fileInputRef.current.onchange = (e: Event) => { 
            const target = e.target as HTMLInputElement;
            const selected = target.files?.[0]; 
            if (selected) executePipeline(post, selected); 
          };
          fileInputRef.current.click();
        }
        return;
      }
      await executePipeline(post, file);
    } catch (e: unknown) { 
      setTimeout(() => setActiveResumingId(null), 3000); 
    }
  };

  return { fileInputRef, handleInPlaceResume };
}
