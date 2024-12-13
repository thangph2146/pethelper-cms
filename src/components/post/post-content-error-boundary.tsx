import { memo } from 'react';
import { Alert } from '@/components/ui/alert';
import { POST_MESSAGES } from '@/constants/post-messages';

interface PostContentErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PostContentErrorBoundary = memo(({
  error,
  resetErrorBoundary
}: PostContentErrorBoundaryProps) => {
  return (
    <Alert 
      variant="warning" 
      className="my-2"
      data-testid="post-content-error"
    >
      <h4 className="font-medium">
        {POST_MESSAGES.errors.content.title}
      </h4>
      <p className="text-sm text-muted-foreground">
        {POST_MESSAGES.errors.content.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 text-sm underline hover:no-underline"
        data-testid="post-content-error-retry"
      >
        {POST_MESSAGES.errors.boundary.retry}
      </button>
    </Alert>
  );
});

PostContentErrorBoundary.displayName = 'PostContentErrorBoundary'; 