import { memo } from 'react';
import type { LoadingStateProps } from '@/types/loading';

export const PostLoadingState = memo(({
  isLoading,
  'aria-busy': ariaBusy,
  'data-loading': dataLoading,
  'data-error': dataError,
  'data-testid': testId,
  children
}: LoadingStateProps) => {
  return (
    <div
      role="status"
      aria-busy={ariaBusy}
      data-loading={dataLoading}
      data-error={dataError}
      data-testid={testId}
      className={isLoading ? 'opacity-50' : undefined}
    >
      {children}
    </div>
  );
});

PostLoadingState.displayName = 'PostLoadingState'; 