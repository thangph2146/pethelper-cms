import { useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { POST_MESSAGES } from '@/constants/post';

export const usePostInteractions = (postId: string) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleInteraction = useCallback(async (
    action: () => Promise<void>,
    requireAuth = true
  ) => {
    if (requireAuth && !user) {
      router.push('/login');
      return;
    }

    try {
      await action();
    } catch (error) {
      console.error('Post interaction error:', error);
      toast.error(POST_MESSAGES.errors.interaction);
    }
  }, [user, router]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: 'Chia sẻ bài viết',
        url: `/posts/${postId}`
      });
      toast.success(POST_MESSAGES.success.share);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error(POST_MESSAGES.errors.share);
      }
    }
  }, [postId]);

  return {
    handleInteraction,
    handleShare
  };
}; 