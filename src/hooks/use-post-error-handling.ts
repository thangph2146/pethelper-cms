import { useMemo } from 'react';
import type { PostErrorHandlingResult } from '@/types/post';
import { usePostError } from './use-post-error';
import { usePostLoadingStates } from './use-post-loading-states';
import { usePostLoadingState } from './use-post-loading-state';

export const usePostErrorHandling = (
  postId: string, 
  isLoading: boolean
): PostErrorHandlingResult => {
  // Error handling
  const { resetError, handleError } = usePostError(postId);

  // Loading states
  const { states: loadingStates, setters } = usePostLoadingStates(isLoading);
  const { isAnyLoading, disableInteractions } = usePostLoadingState(loadingStates);

  // Memoized props
  const errorProps = useMemo(() => ({
    onReset: resetError,
    onError: handleError
  }), [resetError, handleError]);

  const loadingProps = useMemo(() => ({
    isLoading: loadingStates.isLoading
  }), [loadingStates.isLoading]);

  return {
    loadingStates,
    setters,
    isAnyLoading,
    disableInteractions,
    errorProps,
    loadingProps
  };
}; 