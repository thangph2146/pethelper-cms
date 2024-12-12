import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { POST_QUERY_KEYS } from '@/constants/post';

export interface UsePostQuery {
  invalidatePost: () => void;
  prefetchPost: () => void;
  invalidatePostList: () => void;
}

export const usePostQuery = (postId: string): UsePostQuery => {
  const queryClient = useQueryClient();

  const invalidatePost = useCallback(() => {
    queryClient.invalidateQueries(POST_QUERY_KEYS.interactions(postId));
  }, [queryClient, postId]);

  const prefetchPost = useCallback(() => {
    queryClient.prefetchQuery(POST_QUERY_KEYS.interactions(postId));
  }, [queryClient, postId]);

  const invalidatePostList = useCallback(() => {
    queryClient.invalidateQueries(POST_QUERY_KEYS.list);
  }, [queryClient]);

  return {
    invalidatePost,
    prefetchPost,
    invalidatePostList
  };
}; 