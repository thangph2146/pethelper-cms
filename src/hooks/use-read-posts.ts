import { useLocalStorage } from '@/hooks/use-local-storage';
import { useCallback } from 'react';

export function useReadPosts() {
  const [readPosts, setReadPosts] = useLocalStorage<string[]>('read-posts', []);

  const markAsRead = useCallback((postId: string) => {
    setReadPosts(prev => {
      if (prev.includes(postId)) return prev;
      return [...prev, postId];
    });
  }, [setReadPosts]);

  const isRead = useCallback((postId: string) => {
    return readPosts.includes(postId);
  }, [readPosts]);

  const clearReadPosts = useCallback(() => {
    setReadPosts([]);
  }, [setReadPosts]);

  return {
    markAsRead,
    isRead,
    clearReadPosts,
    readPosts
  };
} 