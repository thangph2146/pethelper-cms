import { memo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PostErrorBoundary } from './post-error-boundary';
import { ValidationErrorBoundary } from './containers/validation/validation-error-boundary';
import { trackError } from '@/utils/error-tracking';
import { logger } from '@/services/log-service';
import { isPostValidationError } from './containers/validation/post-validation-error';

interface PostErrorWrapperProps {
  onReset: () => void;
  onError: (error: Error) => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const PostErrorWrapper = memo(({
  onReset,
  onError,
  children,
  'data-testid': testId
}: PostErrorWrapperProps) => {
  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    if (isPostValidationError(error)) {
      error.logError();
    } else {
      logger.error({
        message: 'PostCard Error',
        error,
        data: errorInfo,
        component: 'PostCard'
      });
    }

    trackError(error, errorInfo);
    onError(error);
  }, [onError]);

  const handleReset = useCallback(() => {
    logger.info({
      message: 'PostCard Error Reset',
      component: 'PostCard'
    });
    onReset();
  }, [onReset]);

  const FallbackComponent = useCallback((props: { error: Error }) => {
    return isPostValidationError(props.error) 
      ? <ValidationErrorBoundary {...props} />
      : <PostErrorBoundary {...props} />;
  }, []);

  return (
    <ErrorBoundary 
      FallbackComponent={FallbackComponent}
      onReset={handleReset}
      onError={handleError}
      data-testid={testId}
    >
      {children}
    </ErrorBoundary>
  );
});

PostErrorWrapper.displayName = 'PostErrorWrapper'; 