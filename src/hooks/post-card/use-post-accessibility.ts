import { useMemo } from 'react';
import type { Post } from '@/types/post';
import { POST_MESSAGES } from '@/constants/post-messages';

interface AccessibilityProps {
  role: string;
  'aria-label': string;
  'aria-busy'?: boolean;
  'aria-invalid'?: boolean;
  'aria-disabled'?: boolean;
}

export const usePostAccessibility = ({
  post,
  isLoading,
  isError,
  isDisabled
}: {
  post: Post;
  isLoading: boolean;
  isError: boolean;
  isDisabled: boolean;
}): AccessibilityProps => {
  return useMemo(() => ({
    role: 'article',
    'aria-label': POST_MESSAGES.aria.post(post.author.name),
    'aria-busy': isLoading,
    'aria-invalid': isError,
    'aria-disabled': isDisabled
  }), [post.author.name, isLoading, isError, isDisabled]);
}; 