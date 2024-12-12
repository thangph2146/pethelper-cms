import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Star, StarOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostQuickActionsProps {
  isStarred: boolean;
  onQuickView: (e: React.MouseEvent) => void;
  onStar: (e: React.MouseEvent) => Promise<void>;
  isStarring?: boolean;
}

export const PostQuickActions = memo(({
  isStarred,
  onQuickView,
  onStar,
  isStarring
}: PostQuickActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={onQuickView}
        aria-label="Xem nhanh bài viết"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "h-8 w-8",
          isStarred && "text-yellow-500"
        )}
        onClick={onStar}
        disabled={isStarring}
        aria-label={isStarred ? "Bỏ đánh dấu" : "Đánh dấu"}
      >
        {isStarring ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isStarred ? (
          <StarOff className="h-4 w-4" />
        ) : (
          <Star className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}); 