import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  hasLiked: boolean;
  hasSaved: boolean;
  onLike: (e: React.MouseEvent) => Promise<void>;
  onComment: () => void;
  onSave: (e: React.MouseEvent) => Promise<void>;
  isLikeLoading: boolean;
  isSaving: boolean;
  stats: {
    likeCount: number;
    commentCount: number;
    saveCount: number;
  };
}

export const PostActions = memo(({
  hasLiked,
  hasSaved,
  onLike,
  onComment,
  onSave,
  isLikeLoading,
  isSaving,
  stats
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-2 pt-4 border-t">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        disabled={isLikeLoading}
        className={cn(
          'flex-1 group transition-colors',
          hasLiked && 'text-red-500'
        )}
      >
        <Heart className={cn(
          'h-4 w-4 mr-2',
          hasLiked && 'fill-current'
        )} />
        <span className="hidden sm:inline">Thích</span>
        {stats.likeCount > 0 && <span className="ml-1">({stats.likeCount})</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onComment}
        className="flex-1 group transition-colors"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Bình luận</span>
        {stats.commentCount > 0 && <span className="ml-1">({stats.commentCount})</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        disabled={isSaving}
        className={cn(
          'flex-1 group transition-colors',
          hasSaved && 'text-yellow-500'
        )}
      >
        {hasSaved ? (
          <BookmarkCheck className="h-4 w-4 mr-2" />
        ) : (
          <Bookmark className="h-4 w-4 mr-2" />
        )}
        <span className="hidden sm:inline">
          {hasSaved ? 'Đã lưu' : 'Lưu'}
        </span>
        {stats.saveCount > 0 && <span className="ml-1">({stats.saveCount})</span>}
      </Button>
    </div>
  );
}); 