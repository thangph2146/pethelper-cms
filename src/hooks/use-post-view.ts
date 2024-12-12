import { useMemo } from 'react';
import type { Post } from '@/types/post';

export interface PostView {
  header: {
    author: Post['author'];
    date: string;
    status: Post['status'];
    statusColor: string;
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
  formattedDate: string,
  statusColor: string,
  cardClassName: string,
  isAuthor: boolean
): PostView => {
  return useMemo(() => ({
    header: {
      author: post.author,
      date: formattedDate,
      status: post.status,
      statusColor,
      isAuthor
    },
    content: {
      title: post.title,
      content: post.content,
      images: post.images
    },
    className: cardClassName
  }), [post, formattedDate, statusColor, cardClassName, isAuthor]);
}; 