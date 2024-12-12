import { memo } from 'react';
import { PostStats } from './post-stats';
import { PostActions } from './post-actions';
import type { PostStats as PostStatsType } from '@/hooks/use-post-stats';

interface PostFooterProps {
  stats: PostStatsType;
  onLike: (e: React.MouseEvent) => Promise<void>;
  onComment: () => void;
  onSave: (e: React.MouseEvent) => Promise<void>;
  isLikeLoading: boolean;
  isSaving: boolean;
}

export const PostFooter = memo(({ 
  stats,
  onLike,
  onComment,
  onSave,
  isLikeLoading,
  isSaving
}: PostFooterProps) => {
  return (
    <div className="space-y-2">
      <PostStats stats={stats} isLoading={isLikeLoading} />
      <PostActions
        hasLiked={stats.hasLiked}
        hasSaved={stats.hasSaved}
        onLike={onLike}
        onComment={onComment}
        onSave={onSave}
        isLikeLoading={isLikeLoading}
        isSaving={isSaving}
        stats={stats}
      />
    </div>
  );
}); 