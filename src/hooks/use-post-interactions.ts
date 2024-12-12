import { useQuery } from '@tanstack/react-query';
import { usePostService } from './use-post-service';

export function usePostInteractions(postId: string) {
  const { getInteractionStats } = usePostService();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['post-interactions', postId],
    queryFn: () => getInteractionStats(postId),
    staleTime: 1000 * 60 // 1 phút
  });

  return {
    stats,
    isLoading,
    hasLiked: stats?.hasLiked || false,
    hasCommented: stats?.hasCommented || false,
    hasSaved: stats?.hasSaved || false,
    likeCount: stats?.likeCount || 0,
    commentCount: stats?.commentCount || 0,
    saveCount: stats?.saveCount || 0
  };
} 