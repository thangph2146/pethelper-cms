import { memo } from 'react';
import type { PostStats } from '@/hooks/use-post-stats';

interface PostStatsProps {
  stats: PostStats;
  isLoading?: boolean;
}

export const PostStats = memo(({ stats, isLoading }: PostStatsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{stats.likeCount} lượt thích</span>
      <span>{stats.commentCount} bình luận</span>
      <span>{stats.saveCount} lượt lưu</span>
    </div>
  );
}); 