import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';
import { POST_STATUS_LABELS, POST_URGENCY_LABELS, Post } from '@/types/post';
import { PostImages } from './post-images';
import { cn } from '@/lib/utils';

interface PostPreviewProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusColor: string;
  urgencyColor: string;
  formattedDate: string;
  onImageClick?: (image: string) => void;
}

export const PostPreview = memo(({ 
  post, 
  open, 
  onOpenChange,
  statusColor,
  urgencyColor,
  formattedDate,
  onImageClick
}: PostPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Xem trước bài viết</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={statusColor}>
                  {POST_STATUS_LABELS[post.status]}
                </Badge>
                <Badge variant="outline" className={urgencyColor}>
                  {POST_URGENCY_LABELS[post.urgency]}
                </Badge>
                {post.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </Badge>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              {post.content}
            </div>

            {post.images && post.images.length > 0 && (
              <PostImages 
                images={post.images} 
                onImageClick={onImageClick}
              />
            )}

            {post.contactInfo && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Thông tin liên hệ</h3>
                <p className="text-sm">{post.contactInfo}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}); 