import { useLocalStorage } from '@/hooks/use-local-storage';
import { useCallback } from 'react';

export function useStarredPosts() {
  const [starredPosts, setStarredPosts] = useLocalStorage<string[]>('starred-posts', []);

  const toggleStar = useCallback((postId: string) => {
    setStarredPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      }
      return [...prev, postId];
    });
  }, [setStarredPosts]);

  const isStarred = useCallback((postId: string) => {
    return starredPosts.includes(postId);
  }, [starredPosts]);

  const clearStarredPosts = useCallback(() => {
    setStarredPosts([]);
  }, [setStarredPosts]);

  return {
    toggleStar,
    isStarred,
    clearStarredPosts,
    starredPosts
  };
} 