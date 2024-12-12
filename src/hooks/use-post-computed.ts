import { useMemo } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Post } from '@/types/post';
import { cn } from '@/lib/utils';

export const usePostComputed = (post: Post, isRead: (id: string) => boolean, isStarred: (id: string) => boolean, isHovered: boolean) => {
  return useMemo(() => ({
    formattedDate: format(new Date(post.created_at), 'HH:mm dd/MM/yyyy'),
    statusColor: {
      need_help: 'text-red-500 bg-red-50',
      helping: 'text-yellow-500 bg-yellow-50',
      helped: 'text-green-500 bg-green-50'
    }[post.status],
    urgencyColor: {
      high: 'text-red-500',
      medium: 'text-yellow-500', 
      low: 'text-green-500'
    }[post.urgency],
    cardClassName: cn(
      "group relative overflow-hidden transition-all cursor-pointer",
      isRead(post.id) ? "bg-muted/50" : "hover:shadow-md",
      isHovered && "ring-1 ring-primary/10",
      isStarred(post.id) && "ring-2 ring-yellow-400/50"
    )
  }), [post.created_at, post.status, post.urgency, post.id, isRead, isStarred, isHovered]);
}; 