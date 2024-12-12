import { useMemo } from 'react';
import type { PostInteractions } from '@/types/post';

export interface PostStats {
  hasLiked: boolean;
  hasCommented: boolean;
  hasSaved: boolean;
  likeCount: number;
  commentCount: number;
  saveCount: number;
}

export const usePostStats = (interactions?: PostInteractions) => {
  return useMemo(() => ({
    stats: interactions || {
      hasLiked: false,
      hasCommented: false,
      hasSaved: false,
      likeCount: 0,
      commentCount: 0,
      saveCount: 0
    } satisfies PostStats
  }), [interactions]);
}; 