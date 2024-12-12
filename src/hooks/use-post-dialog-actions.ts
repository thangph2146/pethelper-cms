import { useCallback } from 'react';
import type { UsePostDialogs } from '@/hooks/use-post-dialogs';

export interface UsePostDialogActions {
  handleDelete: () => Promise<void>;
  handleReport: () => void;
  handleShare: () => void;
  handleComment: () => void;
  handleClose: () => void;
}

export const usePostDialogActions = (
  dialogs: UsePostDialogs,
  onDelete: () => Promise<void>
): UsePostDialogActions => {
  const handleDelete = useCallback(async () => {
    try {
      await onDelete();
      dialogs.setShowDeleteAlert(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }, [onDelete, dialogs]);

  const handleReport = useCallback(() => {
    dialogs.setShowReportDialog(true);
  }, [dialogs]);

  const handleShare = useCallback(() => {
    dialogs.setShowShareDialog(true);
  }, [dialogs]);

  const handleComment = useCallback(() => {
    dialogs.setShowComments(true);
  }, [dialogs]);

  const handleClose = useCallback(() => {
    dialogs.setShowDeleteAlert(false);
    dialogs.setShowReportDialog(false);
    dialogs.setShowShareDialog(false);
    dialogs.setShowComments(false);
  }, [dialogs]);

  return {
    handleDelete,
    handleReport,
    handleShare,
    handleComment,
    handleClose
  };
}; 