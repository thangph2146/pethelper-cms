import { useCallback, useState } from 'react';
import type { PostStats } from '@/types/post';
import { postService } from '@/services/post.service';
import { toast } from 'sonner';

export interface UsePostInteractionsHandlers {
  handleLikeClick: (e: React.MouseEvent) => Promise<void>;
  handleSaveClick: (e: React.MouseEvent) => Promise<void>;
  handleStarClick: (e: React.MouseEvent) => Promise<void>;
  isLikeLoading: boolean;
  isSaving: boolean;
  isStarring: boolean;
}

export const usePostInteractionsHandlers = (
  postId: string,
  stats: PostStats,
  invalidatePost: () => void
): UsePostInteractionsHandlers => {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isStarring, setIsStarring] = useState(false);

  const handleLikeClick = useCallback(async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setIsLikeLoading(true);
      await postService.toggleLike(postId);
      invalidatePost();
    } catch (error) {
      toast.error('Không thể thực hiện thao tác này');
    } finally {
      setIsLikeLoading(false);
    }
  }, [postId, invalidatePost]);

  const handleSaveClick = useCallback(async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setIsSaving(true);
      await postService.toggleSave(postId);
      invalidatePost();
    } catch (error) {
      toast.error('Không thể lưu bài viết');
    } finally {
      setIsSaving(false);
    }
  }, [postId, invalidatePost]);

  const handleStarClick = useCallback(async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setIsStarring(true);
      await postService.toggleStar(postId);
      invalidatePost();
    } catch (error) {
      toast.error('Không thể đánh dấu bài viết');
    } finally {
      setIsStarring(false);
    }
  }, [postId, invalidatePost]);

  return {
    handleLikeClick,
    handleSaveClick,
    handleStarClick,
    isLikeLoading,
    isSaving,
    isStarring
  };
}; 