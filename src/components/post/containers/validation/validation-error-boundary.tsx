import { memo } from 'react';
import { ValidationAlert } from './validation-alert';
import { isPostValidationError } from './post-validation-error';
import { createFormatter } from './validation-formatter';
import { POST_MESSAGES } from '@/constants/post-messages';

interface ValidationErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ValidationErrorBoundary = memo(({
  error,
  resetErrorBoundary
}: ValidationErrorBoundaryProps) => {
  if (!isPostValidationError(error)) {
    return null;
  }

  const formatter = createFormatter()
    .withMessages(error.messages)
    .withOptions({ capitalize: true });

  return (
    <ValidationAlert
      title={POST_MESSAGES.errors.boundary.title}
      messages={formatter.getFormattedMessages()}
      onRetry={resetErrorBoundary}
      variant="error"
      className="border-destructive/50 bg-destructive/5"
    />
  );
});

ValidationErrorBoundary.displayName = 'ValidationErrorBoundary'; 