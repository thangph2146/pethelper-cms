import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostQuickActions } from '../post-quick-actions';

type PostRenderQuickActionsProps = PostRenderProps['quickActions'];

export const PostRenderQuickActions = memo((props: PostRenderQuickActionsProps) => {
  const { isStarred, onQuickView, onStar, isStarring } = props;

  return (
    <div className="absolute top-4 right-4">
      <PostQuickActions
        isStarred={isStarred}
        onQuickView={onQuickView}
        onStar={onStar}
        isStarring={isStarring}
      />
    </div>
  );
});

PostRenderQuickActions.displayName = 'PostRenderQuickActions'; 