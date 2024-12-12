import { memo } from 'react';
import { Card } from '@/components/ui/card';

interface PostLoadingSkeletonProps {
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}

export const PostLoadingSkeleton = memo(({
  'data-testid': testId = 'post-skeleton',
  'aria-label': ariaLabel = 'Loading post',
  'aria-busy': ariaBusy = true
}: PostLoadingSkeletonProps) => {
  return (
    <Card className="p-6 space-y-4" data-testid={testId}>
      <div className="flex items-center gap-4" aria-busy={ariaBusy} aria-label={ariaLabel}>
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    </Card>
  );
});

PostLoadingSkeleton.displayName = 'PostLoadingSkeleton'; 