import { memo } from 'react';
import { PostLoadingState } from './post-loading-state';
import { PostLoadingSkeleton } from './post-loading-skeleton';
import type { LoadingContainerProps } from '@/types/loading';

export const PostLoadingContainer = memo(({
  isLoading,
  'data-testid': testId,
  children,
  ...props
}: LoadingContainerProps) => {
  const loadingProps = {
    ...props,
    isLoading,
    'data-testid': testId,
    'aria-busy': isLoading,
    'data-loading': isLoading,
    'data-error': false
  };

  if (isLoading) {
    return <PostLoadingSkeleton {...loadingProps} />;
  }

  return (
    <PostLoadingState {...loadingProps}>
      {children}
    </PostLoadingState>
  );
});

PostLoadingContainer.displayName = 'PostLoadingContainer'; 