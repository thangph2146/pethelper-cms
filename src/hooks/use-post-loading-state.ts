import { useMemo } from 'react';
import type { PostLoadingStates } from './use-post-loading-states';

export const usePostLoadingState = (loadingStates: PostLoadingStates) => {
  const isAnyLoading = useMemo(() => 
    Object.values(loadingStates).some(Boolean)
  , [loadingStates]);

  const activeLoadingState = useMemo(() => 
    Object.entries(loadingStates).find(([_, value]) => value)?.[0]
  , [loadingStates]);

  const disableInteractions = useMemo(() => ({
    className: isAnyLoading ? "pointer-events-none" : "",
    'aria-disabled': isAnyLoading
  }), [isAnyLoading]);

  return {
    isAnyLoading,
    activeLoadingState,
    disableInteractions
  };
}; 