import { memo } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { POST_MESSAGES } from '@/constants/post-messages';
import { POST_CONFIG } from '@/constants/post-config';

interface PostErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PostErrorBoundary = memo(({
  error,
  resetErrorBoundary
}: PostErrorBoundaryProps) => {
  return (
    <Alert 
      variant="error"
      data-testid={POST_CONFIG.testIds.errorAlert}
    >
      <h3 className="font-semibold">
        {POST_MESSAGES.errors.boundary.title}
      </h3>
      <p className="text-sm">
        {POST_MESSAGES.errors.boundary.message}
      </p>
      <Button 
        onClick={resetErrorBoundary}
        variant="outline"
        size="sm"
        className="mt-2"
        data-testid={POST_CONFIG.testIds.errorRetry}
      >
        {POST_MESSAGES.errors.boundary.retry}
      </Button>
    </Alert>
  );
});

PostErrorBoundary.displayName = 'PostErrorBoundary'; 