import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostHeader } from '../post-header';
import { PostMenu } from '../post-menu';

interface PostRenderHeaderProps {
  header: PostRenderProps['header'];
}

export const PostRenderHeader = memo(({ header }: PostRenderHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <PostHeader {...header} />
      <PostMenu 
        isAuthor={header.isAuthor}
        onAction={header.onMenuAction}
      />
    </div>
  );
});

PostRenderHeader.displayName = 'PostRenderHeader'; 