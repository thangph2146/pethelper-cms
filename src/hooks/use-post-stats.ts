import { useMemo } from 'react';
import type { PostStats } from '@/types/post';

export interface UsePostStats {
  stats: PostStats;
  hasInteractions: boolean;
  isLiked: boolean;
  isSaved: boolean;
}

export const usePostStats = (
  interactions: {
    hasLiked: boolean;
    hasSaved: boolean;
    likeCount: number;
    commentCount: number;
    saveCount: number;
  } | undefined
): UsePostStats => {
  const stats = useMemo<PostStats>(() => ({
    likes: interactions?.likeCount || 0,
    comments: interactions?.commentCount || 0,
    saves: interactions?.saveCount || 0,
    hasLiked: interactions?.hasLiked || false,
    hasSaved: interactions?.hasSaved || false
  }), [interactions]);

  const hasInteractions = useMemo(() => (
    stats.likes > 0 || stats.comments > 0 || stats.saves > 0
  ), [stats]);

  return {
    stats,
    hasInteractions,
    isLiked: stats.hasLiked,
    isSaved: stats.hasSaved
  };
}; 