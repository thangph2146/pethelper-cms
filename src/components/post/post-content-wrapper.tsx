import { memo } from 'react';
import { areEqual } from 'react-window';
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

interface PostContentProps {
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
  'data-testid'?: string;
}

export const PostContentWrapper = memo(({
  loading,
  cardProps,
  renderProps,
  showPreview,
  post,
  view,
  dialogs,
  'data-testid': testId
}: PostContentProps) => {
  return (
    <div data-testid={testId}>
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
        />
      )}
    </div>
  );
}, areEqual);

PostContentWrapper.displayName = 'PostContentWrapper'; 