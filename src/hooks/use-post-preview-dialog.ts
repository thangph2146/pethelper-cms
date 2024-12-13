import { useCallback } from 'react';
import type { Post } from '@/types/post';
import { usePostPreview } from './use-post-preview';

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

  const handleImageClick = useCallback((image: string) => {
    preview.setSelectedImage(image);
  }, [preview]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    preview.setShowPreview(true);
  }, [preview]);

  return {
    preview: {
      showPreview: preview.showPreview,
      selectedImage: preview.selectedImage,
      handleQuickView,
      handleImageClick,
      setShowPreview: preview.setShowPreview
    },
    view
  };
}; 