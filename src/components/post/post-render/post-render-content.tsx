import { memo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { PostContent } from '../post-content';
import { PostImages } from '../post-images';

type PostRenderContentProps = PostRenderProps['content'];

export const PostRenderContent = memo((props: PostRenderContentProps) => {
  const { images, onImageClick, ...contentProps } = props;

  return (
    <div className="space-y-4">
      <PostContent {...contentProps} />
      {images && images.length > 0 && (
        <PostImages
          images={images}
          onImageClick={onImageClick}
        />
      )}
    </div>
  );
});

PostRenderContent.displayName = 'PostRenderContent'; 