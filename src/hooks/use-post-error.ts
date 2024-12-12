import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { POST_QUERY_KEYS } from '@/constants/post';
import { toast } from 'react-hot-toast';
import { POST_MESSAGES } from '@/constants/post-messages';

export interface UsePostError {
  handleError: (error: Error) => void;
  resetError: () => void;
}

export const usePostError = (postId: string): UsePostError => {
  const queryClient = useQueryClient();

  const handleError = useCallback((error: Error) => {
    console.error('Post error:', error);
    toast.error(POST_MESSAGES.errors.load);
  }, []);

  const resetError = useCallback(() => {
    queryClient.invalidateQueries(POST_QUERY_KEYS.interactions(postId));
    toast.success(POST_MESSAGES.success.retry);
  }, [queryClient, postId]);

  return {
    handleError,
    resetError
  };
}; 