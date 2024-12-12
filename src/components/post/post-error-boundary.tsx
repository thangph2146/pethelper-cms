import { memo } from 'react';
import { PostError } from './post-error';

interface PostErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PostErrorBoundary = memo(({ 
  error, 
  resetErrorBoundary 
}: PostErrorBoundaryProps) => (
  <PostError 
    error={error}
    onRetry={resetErrorBoundary}
  />
)); 