import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePostService } from '@/hooks/use-post-service';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Post } from '@/types/post';
import { usePostDialogs } from '@/hooks/use-post-dialogs';
import { usePostInteractionsHandlers } from '@/hooks/use-post-interactions-handlers';
import { usePostStarHandlers } from '@/hooks/use-post-star-handlers';

export const usePostHandlers = (
  post: Post, 
  dialogs: ReturnType<typeof usePostDialogs>,
  interactions?: PostInteractions
) => {
  const router = useRouter();
  const { deletePost } = usePostService();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    isLikeLoading, 
    isSaving, 
    handleLikeClick, 
    handleSaveClick 
  } = usePostInteractionsHandlers(post, interactions);

  const {
    isStarring,
    handleStarClick
  } = usePostStarHandlers(post);

  const handleCardClick = useCallback(() => {
    router.push(`/posts/${post.id}`);
  }, [router, post.id]);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      queryClient.invalidateQueries(['posts']);
      toast.success('Đã xóa bài viết');
      dialogs.setShowDeleteAlert(false);
    } catch (error) {
      toast.error('Không thể xóa bài viết');
    } finally {
      setIsDeleting(false);
    }
  }, [post.id, deletePost, queryClient, dialogs]);

  const handleMenuAction = useCallback((action: string) => {
    switch (action) {
      case 'delete':
        dialogs.openDeleteAlert();
        break;
      case 'report':
        dialogs.openReportDialog();
        break;
      case 'share':
        dialogs.openShareDialog();
        break;
      default:
        break;
    }
  }, [dialogs]);

  return {
    isDeleting,
    isStarring,
    isLikeLoading,
    isSaving,
    handleCardClick,
    handleLikeClick,
    handleSaveClick,
    handleStarClick,
    handleDelete,
    handleMenuAction
  };
}; 