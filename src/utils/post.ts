import { POST_STATUS, POST_URGENCY } from '@/constants/post';

export const getStatusColor = (status: Post['status']): string => {
  switch (status) {
    case POST_STATUS.NEED_HELP:
      return 'text-red-500';
    case POST_STATUS.HELPING:
      return 'text-yellow-500';
    case POST_STATUS.HELPED:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const getUrgencyColor = (urgency: Post['urgency']): string => {
  switch (urgency) {
    case POST_URGENCY.HIGH:
      return 'text-red-500';
    case POST_URGENCY.MEDIUM:
      return 'text-yellow-500';
    case POST_URGENCY.LOW:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getPostUrl = (postId: string): string => {
  return `/posts/${postId}`;
};

export const getPostShareUrl = (postId: string): string => {
  return `${window.location.origin}/posts/${postId}`;
};

export const getPostImageUrl = (imageUrl: string): string => {
  return imageUrl.startsWith('http') ? imageUrl : `/images/${imageUrl}`;
}; 