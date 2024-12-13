import { memo, Suspense } from 'react';
import { PostErrorContainer } from './post-error-container';
import { PostLoadingContainer } from './post-loading-container';
import { PostMotionContainer } from './post-motion-container';
import { PostContentWrapper } from '../post-content-wrapper';
import { PostContentSkeleton } from '../post-content-skeleton';
import { CONTAINER_TEST_IDS } from './constants';
import { getTestId } from './utils';
import type { PostContainerProps } from './container-types';

export const PostContainer = memo(({
  errorProps,
  loadingProps,
  motionProps,
  contentProps
}: PostContainerProps) => {
  return (
    <PostErrorContainer
      errorProps={errorProps}
      data-testid={getTestId(CONTAINER_TEST_IDS.error)}
    >
      <PostLoadingContainer
        {...loadingProps}
        data-testid={getTestId(CONTAINER_TEST_IDS.loading)}
      >
        <PostMotionContainer motionProps={motionProps}>
          <Suspense fallback={<PostContentSkeleton />}>
            <PostContentWrapper 
              {...contentProps}
              data-testid={getTestId(CONTAINER_TEST_IDS.content)}
            />
          </Suspense>
        </PostMotionContainer>
      </PostLoadingContainer>
    </PostErrorContainer>
  );
});

PostContainer.displayName = 'PostContainer'; 