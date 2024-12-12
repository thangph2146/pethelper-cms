import { useMemo } from 'react';
import type { Post } from '@/types/post';
import { cn } from '@/lib/utils';
import { getStatusColor, getUrgencyColor, formatDate } from '@/utils/post';

export interface PostViewConfig {
  isAuthor: boolean;
  isRead: boolean;
  isStarred: boolean;
  isHovered: boolean;
  hasInteractions: boolean;
}

export interface PostView {
  header: {
    author: Post['author'];
    date: string;
    status: Post['status'];
    statusColor: string;
    urgencyColor: string;
    isAuthor: boolean;
  };
  content: {
    title: string;
    content: string;
    images?: string[];
  };
  className: string;
}

export const usePostView = (
  post: Post,
  config: PostViewConfig
): PostView => {
  const { isAuthor, isRead, isStarred, isHovered, hasInteractions } = config;

  const statusColor = useMemo(() => getStatusColor(post.status), [post.status]);
  const urgencyColor = useMemo(() => getUrgencyColor(post.urgency), [post.urgency]);
  const formattedDate = useMemo(() => formatDate(post.created_at), [post.created_at]);
  
  const className = useMemo(() => cn(
    'relative transition-all duration-200',
    {
      'bg-muted/50': isRead,
      'ring-2 ring-primary': isStarred,
      'scale-[1.01]': isHovered && !hasInteractions,
      'scale-[1.02]': isHovered && hasInteractions
    }
  ), [isRead, isStarred, isHovered, hasInteractions]);

  return useMemo(() => ({
    header: {
      author: post.author,
      date: formattedDate,
      status: post.status,
      statusColor,
      urgencyColor,
      isAuthor
    },
    content: {
      title: post.title,
      content: post.content,
      images: post.images
    },
    className
  }), [
    post,
    formattedDate,
    statusColor,
    urgencyColor,
    className,
    isAuthor
  ]);
}; 