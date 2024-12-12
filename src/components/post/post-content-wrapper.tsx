import { memo } from 'react';
import { PostLoadingOverlay } from './post-loading-overlay';
import { PostCardContent } from './post-card-content';
import { PostPreviewWrapper } from './post-preview-wrapper';
import type { 
  PostLoadingStates, 
  Post, 
  PostCardView, 
  PostDialogProps,
  PostRenderProps 
} from '@/types/post';

interface PostContentWrapperProps {
  loading: PostLoadingStates;
  cardProps: {
    className: string;
    onClick: () => void;
    'data-testid': string;
    'aria-disabled': boolean;
  };
  renderProps: PostRenderProps;
  showPreview: boolean;
  post: Post;
  view: PostCardView;
  dialogs: PostDialogProps['dialogs'];
  onDelete: () => Promise<void>;
  onShare: () => Promise<void>;
}

export const PostContentWrapper = memo(({
  loading,
  cardProps,
  renderProps,
  showPreview,
  post,
  view,
  dialogs,
  onDelete,
  onShare
}: PostContentWrapperProps) => {
  return (
    <>
      <PostLoadingOverlay loading={loading} />

      <PostCardContent
        cardProps={cardProps}
        renderProps={renderProps}
      />

      {showPreview && (
        <PostPreviewWrapper
          post={post}
          view={view}
          dialogs={dialogs}
          loading={loading}
          onDelete={onDelete}
          onShare={onShare}
        />
      )}
    </>
  );
});

PostContentWrapper.displayName = 'PostContentWrapper'; 