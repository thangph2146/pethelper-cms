import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PostErrorBoundary } from './post-error-boundary';

interface PostErrorWrapperProps {
  onReset: () => void;
  onError: (error: Error) => void;
  children: React.ReactNode;
}

export const PostErrorWrapper = memo(({
  onReset,
  onError,
  children
}: PostErrorWrapperProps) => {
  return (
    <ErrorBoundary 
      FallbackComponent={PostErrorBoundary}
      onReset={onReset}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
});

PostErrorWrapper.displayName = 'PostErrorWrapper'; 