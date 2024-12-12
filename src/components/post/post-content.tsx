import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PostContentProps {
  title: string;
  content: string;
  showContent: boolean;
  toggleContent: (e: React.MouseEvent) => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

export const PostContent = memo(({ title, content, showContent, toggleContent, contentRef }: PostContentProps) => {
  return (
    <div className="space-y-2">
      <h3 
        className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors"
      >
        {title}
      </h3>

      <div 
        ref={contentRef}
        className={cn(
          "text-sm text-muted-foreground overflow-hidden transition-all",
          showContent ? "line-clamp-none" : "line-clamp-3"
        )}
      >
        {content}
      </div>

      {contentRef.current?.scrollHeight > 60 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleContent}
          className="text-xs hover:text-primary transition-colors"
        >
          {showContent ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      )}
    </div>
  );
}); 