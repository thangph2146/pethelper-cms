import { memo } from 'react';
import { PostHeader } from '../post-header';
import { PostMenu } from '../post-menu';
import type { PostRenderProps } from '@/types/post';

type PostRenderHeaderProps = PostRenderProps['header'];

export const PostRenderHeader = memo((props: PostRenderHeaderProps) => {
  const { isAuthor, onMenuAction, ...headerProps } = props;

  return (
    <div 
      className="flex items-center justify-between"
      data-testid="post-render-header"
    >
      <PostHeader 
        {...headerProps} 
        data-testid="post-header"
      />
      <PostMenu 
        isAuthor={isAuthor}
        onAction={onMenuAction}
        data-testid="post-menu"
      />
    </div>
  );
});

PostRenderHeader.displayName = 'PostRenderHeader'; 