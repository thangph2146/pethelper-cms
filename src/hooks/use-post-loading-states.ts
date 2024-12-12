import { useState } from 'react';

export interface PostLoadingStates {
  isLoading: boolean;
  isDeleting: boolean;
  isStarring: boolean;
  isLikeLoading: boolean;
  isSaving: boolean;
  isSharing: boolean;
  isReporting: boolean;
}

export const usePostLoadingStates = (isInteractionsLoading: boolean) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarring, setIsStarring] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  return {
    states: {
      isLoading: isInteractionsLoading,
      isDeleting,
      isStarring,
      isLikeLoading,
      isSaving,
      isSharing,
      isReporting
    },
    setters: {
      setIsDeleting,
      setIsStarring,
      setIsLikeLoading,
      setIsSaving,
      setIsSharing,
      setIsReporting
    }
  };
}; 