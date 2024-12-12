import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostStats } from '../post-stats';
import { PostActions } from '../post-actions';

type PostRenderFooterProps = PostRenderProps['footer'];

export const PostRenderFooter = memo((props: PostRenderFooterProps) => {
  const { stats, isLiked, isSaved, onLike, onComment, onSave, isLikeLoading, isSaving } = props;

  return (
    <div className="space-y-2">
      <PostStats 
        stats={stats}
        isLoading={isLikeLoading} 
      />
      <PostActions
        hasLiked={isLiked}
        hasSaved={isSaved}
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

PostRenderFooter.displayName = 'PostRenderFooter'; 