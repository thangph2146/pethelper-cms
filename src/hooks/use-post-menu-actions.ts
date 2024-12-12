import { useCallback } from 'react';
import type { UsePostDialogs } from '@/hooks/use-post-dialogs';
import { POST_MENU_ACTIONS } from '@/constants/post';

export interface UsePostMenuActions {
  handleMenuAction: (action: string) => void;
  isMenuLoading: boolean;
}

export const usePostMenuActions = (
  dialogs: UsePostDialogs,
  isAuthor: boolean,
  isDeleting: boolean
): UsePostMenuActions => {
  const handleMenuAction = useCallback((action: string) => {
    switch (action) {
      case POST_MENU_ACTIONS.DELETE:
        dialogs.setShowDeleteAlert(true);
        break;
      case POST_MENU_ACTIONS.REPORT:
        dialogs.setShowReportDialog(true);
        break;
      case POST_MENU_ACTIONS.SHARE:
        dialogs.setShowShareDialog(true);
        break;
      default:
        break;
    }
  }, [dialogs]);

  return {
    handleMenuAction,
    isMenuLoading: isDeleting
  };
}; 