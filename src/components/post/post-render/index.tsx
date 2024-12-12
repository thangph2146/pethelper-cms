import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostRenderHeader } from './post-render-header';
import { PostRenderContent } from './post-render-content';
import { PostRenderFooter } from './post-render-footer';
import { PostRenderQuickActions } from './post-render-quick-actions';

interface PostRenderComponentProps {
  props: PostRenderProps;
}

export const PostRender = memo(({ props }: PostRenderComponentProps) => {
  const { header, content, footer, quickActions } = props;

  return (
    <>
      <div 
        className="p-6 space-y-4"
        role="article"
        aria-label="Post content"
      >
        <PostRenderHeader 
          {...header} 
          data-testid="post-render-header"
        />
        <PostRenderContent 
          {...content} 
          data-testid="post-render-content"
        />
        <PostRenderFooter 
          {...footer} 
          data-testid="post-render-footer"
        />
      </div>
      <PostRenderQuickActions 
        {...quickActions} 
        data-testid="post-render-quick-actions"
      />
    </>
  );
});

PostRender.displayName = 'PostRender'; 