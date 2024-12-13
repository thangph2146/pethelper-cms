import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PostErrorBoundary } from '../post-error-boundary';
import { PostContentErrorBoundary } from '../post-content-error-boundary';
import type { ErrorContainerProps } from './container-types';

export const PostErrorContainer = memo(({
  errorProps,
  'data-testid': testId,
  children
}: ErrorContainerProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={PostErrorBoundary}
      {...errorProps}
      data-testid={testId}
    >
      <ErrorBoundary FallbackComponent={PostContentErrorBoundary}>
        {children}
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

PostErrorContainer.displayName = 'PostErrorContainer'; 