import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostContent } from '../post-content';
import { PostImages } from '../post-images';

interface PostRenderContentProps {
  content: PostRenderProps['content'];
}

export const PostRenderContent = memo(({ content }: PostRenderContentProps) => {
  return (
    <>
      <PostContent
        {...content}
        showContent={content.showContent}
        toggleContent={content.toggleContent}
        contentRef={content.contentRef}
      />
      {content.images && content.images.length > 0 && (
        <PostImages
          images={content.images}
          onImageClick={content.onImageClick}
        />
      )}
    </>
  );
});

PostRenderContent.displayName = 'PostRenderContent'; 