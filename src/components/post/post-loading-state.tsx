import { memo } from 'react';
import { PostLoadingSkeleton } from './post-loading-skeleton';
import { POST_MESSAGES } from '@/constants/post';

interface PostLoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const PostLoadingState = memo(({
  isLoading,
  children
}: PostLoadingStateProps) => {
  if (isLoading) {
    return (
      <PostLoadingSkeleton 
        data-testid="post-skeleton"
        aria-label={POST_MESSAGES.loading.skeleton}
        aria-busy={true}
      />
    );
  }

  return children;
});

PostLoadingState.displayName = 'PostLoadingState'; 