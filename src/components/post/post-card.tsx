'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { ReportDialog } from '@/components/report/report-dialog';
import type { IPost, IAuthor } from '@backend/models/Post';

interface PostCardProps {
  post: IPost;
  onLike?: () => void;
  onUnlike?: () => void;
}

const statusColors = {
  need_help: 'text-red-500',
  helping: 'text-yellow-500',
  helped: 'text-green-500',
};

const statusText = {
  need_help: 'Cần giúp đỡ',
  helping: 'Đang giúp đỡ',
  helped: 'Đã được giúp đỡ',
};

export function PostCard({ post, onLike, onUnlike }: PostCardProps) {
  const isLiked = post.likes?.some(like => like.toString() === post.currentUserId?.toString());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={(post.author as IAuthor)?.image} alt={(post.author as IAuthor)?.name} />
          <AvatarFallback>{(post.author as IAuthor)?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{(post.author as IAuthor)?.name}</p>
          <p className="text-sm text-gray-500">
            {format(new Date(post.createdAt), 'dd/MM/yyyy')}
          </p>
        </div>
        <span className={`ml-auto ${statusColors[post.status.replace('-', '_') as keyof typeof statusColors]}`}>
          {statusText[post.status.replace('-', '_') as keyof typeof statusText]}
        </span>
      </CardHeader>

      <Link href={`/posts/${post._id}`}>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          {(post.images ?? []).length > 0 && (
            <div className="relative aspect-video">
              <Image
                src={(post.images ?? [])[0]}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <p className="text-gray-600 line-clamp-3">{post.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.animalType === 'dog' ? '🐕' : post.animalType === 'cat' ? '🐈' : '🐾'}</span>
            <span>📍 {post.location}</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={isLiked ? onUnlike : onLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </Button>
          <Button size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>
        <ReportDialog postId={post._id} />
      </CardFooter>
    </Card>
  );
} 