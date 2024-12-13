import { useMemo } from 'react';
import { usePostLoadingManager } from '../use-post-loading-manager';

interface LoadingProps {
  isAnyLoading: boolean;
  isError: boolean;
}

export const usePostLoadingProps = ({ 
  isAnyLoading, 
  isError 
}: LoadingProps) => {
  const loadingProps = useMemo(() => ({
    isLoading: isAnyLoading,
    isError
  }), [isAnyLoading, isError]);

  const { loadingProps: loadingStateProps, loadingState } = usePostLoadingManager(loadingProps);

  return {
    loadingStateProps,
    loadingState
  };
}; 