import type { UsePostInteractionsHandlers } from './use-post-interactions-handlers';

export interface PostLoadingState {
  isLoading: boolean;
  isDeleting: boolean;
  isStarring: boolean;
  isLikeLoading: boolean;
  isSaving: boolean;
}

export interface UsePostLoadingConfig {
  isInteractionsLoading: boolean;
  isDeleting: boolean;
  isStarring: boolean;
  isLikeLoading: boolean;
  isSaving: boolean;
}

export const usePostLoading = (config: UsePostLoadingConfig): PostLoadingState => {
  const {
    isInteractionsLoading,
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving
  } = config;

  return {
    isLoading: isInteractionsLoading,
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving
  };
}; 