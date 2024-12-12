import { useMemo } from 'react';

export interface UsePostLoading {
  isLoading: boolean;
  isDeleting: boolean;
  isStarring: boolean;
  isLikeLoading: boolean;
  isSaving: boolean;
}

export const usePostLoading = (
  isInteractionsLoading: boolean,
  isDeleting: boolean,
  isStarring: boolean,
  isLikeLoading: boolean,
  isSaving: boolean
): UsePostLoading => {
  return useMemo(() => ({
    isLoading: isInteractionsLoading,
    isDeleting,
    isStarring,
    isLikeLoading: isLikeLoading || isInteractionsLoading,
    isSaving
  }), [isInteractionsLoading, isDeleting, isStarring, isLikeLoading, isSaving]);
}; 