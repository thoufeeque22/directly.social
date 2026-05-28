import { usePolling } from '@/hooks/usePolling';
import { PostActivityEntry } from './types';

export function useActivityPolling(
  posts: PostActivityEntry[],
  searchQuery: string,
  setPosts: (posts: PostActivityEntry[]) => void,
  fetchActivity: (cursor?: string, search?: string) => Promise<{ data?: PostActivityEntry[], nextCursor?: string | null }>
) {
  const hasActive = posts.some(post => 
    post.platforms.some(p => ['pending', 'uploading', 'processing', 'retrying'].includes(p.status))
  );

  usePolling({
    callback: async () => {
      const data = await fetchActivity(undefined, searchQuery);
      setPosts(data.data || []);
    },
    interval: hasActive ? 5000 : 15000,
    isActive: posts.length > 0
  });
}
