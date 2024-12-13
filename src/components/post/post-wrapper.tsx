import { memo } from 'react';
import { PostContainer } from './containers/post-container';
import type { PostWrapperProps } from '@/types/post';

export const PostWrapper = memo(({
  wrapperProps,
  errorProps,
  loadingProps,
  motionProps,
  contentProps,
  'data-testid': testId
}: PostWrapperProps) => {
  return (
    <div {...wrapperProps} data-testid={testId}>
      <PostContainer
        errorProps={errorProps}
        loadingProps={loadingProps}
        motionProps={motionProps}
        contentProps={contentProps}
        data-testid={`${testId}-container`}
      />
    </div>
  );
});

PostWrapper.displayName = 'PostWrapper'; 