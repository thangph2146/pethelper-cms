import { useMemo } from 'react';
import type { PostLoadingState } from '@/types/post';

interface UsePostLoadingManagerParams {
  isLoading: boolean;
  isError: boolean;
}

export const usePostLoadingManager = ({
  isLoading,
  isError
}: UsePostLoadingManagerParams) => {
  const loadingProps = useMemo(() => ({
    isLoading,
    'aria-busy': isLoading,
    'data-loading': isLoading,
    'data-error': isError
  }), [isLoading, isError]);

  const loadingState = useMemo<PostLoadingState>(() => ({
    isLoading,
    isError,
    isSuccess: !isLoading && !isError,
    status: isError ? 'error' : isLoading ? 'loading' : 'success'
  }), [isLoading, isError]);

  return {
    loadingProps,
    loadingState
  };
}; 