'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { PostService } from '@/services/post.service';
import { toast } from 'react-hot-toast';
import type { ICommentPopulated } from '@backend/models/Comment';

interface PostCommentProps {
  postId: string;
  comments: ICommentPopulated[] | undefined;
  onCommentAdded: () => void;
}

export function PostComment({ postId, comments, onCommentAdded }: PostCommentProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await PostService.addComment(postId, content);
      setContent('');
      onCommentAdded();
      toast.success('Thêm bình luận thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bình luận ({comments?.length ?? 0})</h3>
      
      {session && (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            className="mb-2"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={String(comment._id)} className="flex gap-3">
            <Avatar>
              <AvatarImage 
                src={comment.author.image} 
                alt={comment.author.name || 'User avatar'} 
              />
              <AvatarFallback>
                {comment.author.name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.author.name}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 