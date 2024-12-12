import { useState, useRef, useEffect } from 'react';
import { useReadPosts } from '@/hooks/use-read-posts';
import type { Post } from '@/types/post';

export interface UsePostPreview {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleQuickView: (e: React.MouseEvent) => void;
  handleImageClick: (image: string) => void;
}

export const usePostPreview = (post: Post): UsePostPreview => {
  const { isRead, markAsRead } = useReadPosts();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const previewTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (previewTimeout.current) {
        clearTimeout(previewTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showPreview && !isRead(post.id)) {
      markAsRead(post.id);
    }
  }, [showPreview, post.id, isRead, markAsRead]);

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return {
    showPreview,
    setShowPreview,
    selectedImage,
    setSelectedImage,
    handleQuickView,
    handleImageClick
  };
}; 