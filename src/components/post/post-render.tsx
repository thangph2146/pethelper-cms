import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostRenderHeader } from './post-render/post-render-header';
import { PostRenderContent } from './post-render/post-render-content';
import { PostRenderFooter } from './post-render/post-render-footer';
import { PostRenderQuickActions } from './post-render/post-render-quick-actions';

interface PostRenderComponentProps {
  props: PostRenderProps;
  'data-testid'?: string;
}

export const PostRender = memo(({ 
  props,
  'data-testid': testId 
}: PostRenderComponentProps) => {
  const { header, content, footer, quickActions } = props;

  return (
    <article
      className="relative"
      role="article"
      aria-label={`Bài viết của ${header.author.name}`}
      data-testid={testId}
    >
      <div className="p-6 space-y-4">
        <PostRenderHeader 
          header={header}
          data-testid={`${testId}-header`}
        />
        
        <PostRenderContent 
          content={content}
          data-testid={`${testId}-content`}
        />
        
        <PostRenderFooter 
          {...footer}
          data-testid={`${testId}-footer`}
        />
      </div>

      <PostRenderQuickActions 
        {...quickActions}
        data-testid={`${testId}-quick-actions`}
      />
    </article>
  );
});

PostRender.displayName = 'PostRender'; 