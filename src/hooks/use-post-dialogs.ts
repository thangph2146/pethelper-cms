import { useState } from 'react';
import type { Post } from '@/types/post';

export const usePostDialogs = (post: Post) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const openDeleteAlert = () => setShowDeleteAlert(true);
  const openReportDialog = () => setShowReportDialog(true);
  const openComments = () => setShowComments(true);
  const openShareDialog = () => setShowShareDialog(true);

  return {
    showDeleteAlert,
    setShowDeleteAlert,
    showReportDialog,
    setShowReportDialog,
    showComments,
    setShowComments,
    showShareDialog,
    setShowShareDialog,
    openDeleteAlert,
    openReportDialog,
    openComments,
    openShareDialog
  };
}; 