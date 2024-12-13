import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const PostContentSkeleton = memo(() => {
  return (
    <div className="space-y-4 p-4" data-testid="post-content-skeleton">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
});

PostContentSkeleton.displayName = 'PostContentSkeleton'; 