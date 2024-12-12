import { useCallback } from 'react';
import type { Post } from '@/types/post';

export interface UsePostPreviewDialog {
  preview: {
    showPreview: boolean;
    selectedImage: string | null;
    handleQuickView: (e: React.MouseEvent) => void;
    handleImageClick: (image: string) => void;
    setShowPreview: (show: boolean) => void;
  };
  view: {
    statusColor: string;
    urgencyColor: string;
    formattedDate: string;
  };
}

export const usePostPreviewDialog = (
  post: Post,
  view: {
    statusColor: string;
    urgencyColor: string;
    formattedDate: string;
  }
): UsePostPreviewDialog => {
  const preview = usePostPreview(post);

  return {
    preview: {
      showPreview: preview.showPreview,
      selectedImage: preview.selectedImage,
      handleQuickView: preview.handleQuickView,
      handleImageClick: preview.handleImageClick,
      setShowPreview: preview.setShowPreview
    },
    view
  };
}; 