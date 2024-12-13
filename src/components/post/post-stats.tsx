import { memo } from 'react';
import type { IPostStats } from '@/types/post';

interface PostStatsProps {
  stats: IPostStats;
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
      <span>{stats.likes} lượt thích</span>
      <span>{stats.comments} bình luận</span>
      <span>{stats.saves} lượt lưu</span>
    </div>
  );
}); 