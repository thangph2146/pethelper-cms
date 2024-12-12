import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePostService } from '@/hooks/use-post-service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Post } from '@/types/post';

export const usePostInteractionsHandlers = (post: Post, interactions?: PostInteractions) => {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { likePost, unlikePost, savePost, unsavePost } = usePostService();

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLikeClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsLikeLoading(true);
      if (interactions?.hasLiked) {
        await unlikePost(post.id);
        toast.success('Đã bỏ thích bài viết');
      } else {
        await likePost(post.id);
        toast.success('Đã thích bài viết');
      }
      queryClient.invalidateQueries(['post-interactions', post.id]);
    } catch (error) {
      toast.error('Không thể thực hiện thao tác này');
    } finally {
      setIsLikeLoading(false);
    }
  }, [user, post.id, interactions?.hasLiked, likePost, unlikePost, queryClient]);

  const handleSaveClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsSaving(true);
      if (interactions?.hasSaved) {
        await unsavePost(post.id);
        toast.success('Đã bỏ lưu bài viết');
      } else {
        await savePost(post.id);
        toast.success('Đã lưu bài viết');
      }
      queryClient.invalidateQueries(['post-interactions', post.id]);
    } catch (error) {
      toast.error('Không thể thực hiện thao tác này');
    } finally {
      setIsSaving(false);
    }
  }, [user, post.id, interactions?.hasSaved, savePost, unsavePost, queryClient]);

  return {
    isLikeLoading,
    isSaving,
    handleLikeClick,
    handleSaveClick
  };
}; 