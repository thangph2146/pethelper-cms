import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PostErrorBoundary } from './post-error-boundary';
import { PostContentErrorBoundary } from './post-content-error-boundary';

interface PostErrorContainerProps {
  'data-testid'?: string;
  errorProps: {
    onReset: () => void;
    onError: (error: Error) => void;
  };
  children: React.ReactNode;
}

export const PostErrorContainer = memo(({
  'data-testid': testId,
  errorProps,
  children
}: PostErrorContainerProps) => {
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