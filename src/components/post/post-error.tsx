import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PostErrorProps {
  error: Error;
  onRetry?: () => void;
}

export const PostError = memo(({ error, onRetry }: PostErrorProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 text-red-500">
        <AlertTriangle className="h-6 w-6" />
        <div className="space-y-1">
          <p className="font-medium">Có lỗi xảy ra khi hiển thị bài viết</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          Thử lại
        </Button>
      )}
    </Card>
  );
}); 

interface PostErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const PostCardErrorBoundary = ({ error, resetErrorBoundary }: PostErrorBoundaryProps) => (
  <PostError 
    error={error}
    onRetry={resetErrorBoundary}
  />
); 