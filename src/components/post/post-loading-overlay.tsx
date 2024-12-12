import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOADING_MESSAGES } from '@/constants/loading';
import type { PostLoadingStates } from '@/hooks/use-post-loading-states';

interface PostLoadingOverlayProps {
  loading: PostLoadingStates;
}

export const PostLoadingOverlay = memo(({ loading }: PostLoadingOverlayProps) => {
  const isLoading = Object.values(loading).some(Boolean);
  const message = Object.entries(loading).find(([_, value]) => value)?.[0];

  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center z-50"
      )}
      data-testid="post-loading-overlay"
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm text-muted-foreground">
          {message && LOADING_MESSAGES[message]}
        </p>
      </div>
    </div>
  );
});

PostLoadingOverlay.displayName = 'PostLoadingOverlay'; 