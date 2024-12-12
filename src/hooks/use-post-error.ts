import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from '@/constants/post';

export interface UsePostError {
  handleError: (error: Error) => void;
  resetError: () => void;
}

export const usePostError = (postId: string): UsePostError => {
  const queryClient = useQueryClient();

  const handleError = useCallback((error: Error) => {
    console.error('Post error:', error);
  }, []);

  const resetError = useCallback(() => {
    queryClient.invalidateQueries(POST_QUERY_KEYS.interactions(postId));
  }, [queryClient, postId]);

  return {
    handleError,
    resetError
  };
}; 