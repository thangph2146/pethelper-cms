import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostHeader } from './post-header';
import { PostContent } from './post-content';
import { PostFooter } from './post-footer';
import { PostQuickActions } from './post-quick-actions';
import { PostImages } from './post-images';

interface PostRenderComponentProps {
  props: PostRenderProps;
}

export const PostRender = memo(({ props }: PostRenderComponentProps) => {
  const { header, content, footer, quickActions } = props;

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <PostHeader {...header} />
          <PostMenu 
            isAuthor={header.isAuthor}
            onAction={header.onMenuAction}
          />
        </div>

        <PostContent
          {...content}
          showContent={content.showContent}
          toggleContent={content.toggleContent}
          contentRef={content.contentRef}
        />
        {content.images?.length > 0 && (
          <PostImages
            images={content.images}
            onImageClick={content.onImageClick}
          />
        )}

        <PostFooter {...footer} />
      </div>

      <PostQuickActions {...quickActions} />
    </>
  );
}); 