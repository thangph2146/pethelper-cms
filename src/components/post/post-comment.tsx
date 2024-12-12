'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useComments } from '@/hooks/use-comments';
import { useNotifications } from '@/hooks/use-notifications';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MessageCircle, Send } from 'lucide-react';

interface PostCommentProps {
  postId: string;
  authorId: string;
}

export function PostComment({ postId, authorId }: PostCommentProps) {
  const { user } = useAuth();
  const { addComment } = useComments();
  const { sendNotification } = useNotifications();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const comment = await addComment(postId, content);

      // Gửi thông báo cho tác giả bài viết
      if (user.id !== authorId) {
        await sendNotification({
          type: 'comment',
          recipientId: authorId,
          postId,
          commentId: comment.id,
          message: `${user.name} đã bình luận về bài viết của bạn`
        });
      }

      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-start gap-2 p-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Viết bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[60px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              'Đang gửi...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gửi bình luận
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 