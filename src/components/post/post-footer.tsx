import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostFooterProps {
  stats: {
    hasLiked: boolean;
    hasCommented: boolean;
    hasSaved: boolean;
    likeCount: number;
    commentCount: number;
    saveCount: number;
  };
  onLike: (e: React.MouseEvent) => Promise<void>;
  onComment: () => void;
  onSave: (e: React.MouseEvent) => Promise<void>;
  isLikeLoading?: boolean;
  isSaving?: boolean;
}

export const PostFooter = memo(({ 
  stats, 
  onLike, 
  onComment, 
  onSave, 
  isLikeLoading, 
  isSaving 
}: PostFooterProps) => {
  const { hasLiked, hasCommented, hasSaved, likeCount, commentCount, saveCount } = stats;

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
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
        {likeCount > 0 && <span className="ml-1">({likeCount})</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onComment}
        className={cn(
          'flex-1 group transition-colors',
          hasCommented && 'text-blue-500'
        )}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Bình luận</span>
        {commentCount > 0 && <span className="ml-1">({commentCount})</span>}
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
        {saveCount > 0 && <span className="ml-1">({saveCount})</span>}
      </Button>
    </div>
  );
}); 