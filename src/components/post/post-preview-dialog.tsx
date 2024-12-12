import { memo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Post } from '@/types/post';
import { PostHeader } from './post-header';
import { PostContent } from './post-content';
import { PostImages } from './post-images';

interface PostPreviewDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string | null;
  onImageClick: (image: string) => void;
  statusColor: string;
  urgencyColor: string;
  formattedDate: string;
}

export const PostPreviewDialog = memo(({
  post,
  open,
  onOpenChange,
  selectedImage,
  onImageClick,
  statusColor,
  urgencyColor,
  formattedDate
}: PostPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <PostHeader
            author={post.author}
            date={formattedDate}
            status={post.status}
            statusColor={statusColor}
            urgencyColor={urgencyColor}
          />

          <PostContent
            title={post.title}
            content={post.content}
            showContent={true}
          />

          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {post.images.map((image) => (
                <div
                  key={image}
                  className={`relative aspect-square cursor-pointer ${
                    selectedImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onImageClick(image)}
                >
                  <img
                    src={image}
                    alt={post.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}); 