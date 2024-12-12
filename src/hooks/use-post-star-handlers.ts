import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Post } from '@/types/post';

export const usePostStarHandlers = (post: Post) => {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isStarred, starPost, unstarPost } = useStarredPosts();
  const [isStarring, setIsStarring] = useState(false);

  const handleStarClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsStarring(true);
      if (isStarred(post.id)) {
        await unstarPost(post.id);
        toast.success('Đã bỏ đánh dấu bài viết');
      } else {
        await starPost(post.id);
        toast.success('Đã đánh dấu bài viết');
      }
      queryClient.invalidateQueries(['starred-posts']);
    } catch (error) {
      toast.error('Không thể thực hiện thao tác này');
    } finally {
      setIsStarring(false);
    }
  }, [user, post.id, isStarred, starPost, unstarPost, queryClient]);

  return {
    isStarring,
    handleStarClick
  };
}; 