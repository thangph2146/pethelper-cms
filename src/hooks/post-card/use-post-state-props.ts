import { useMemo } from 'react';
import type { Post } from '@/types/post';

interface StateProps {
  post: Post;
  validatedProps: {
    className?: string;
    onCardClick?: (post: Post) => void;
    [key: string]: unknown;
  };
}

export const usePostStateProps = ({
  post,
  validatedProps,
  className,
  onCardClick
}: StateProps & {
  className?: string;
  onCardClick?: (post: Post) => void;
}) => {
  return useMemo(() => ({
    post,
    validatedProps: {
      ...validatedProps,
      className,
      onCardClick
    }
  }), [post, validatedProps, className, onCardClick]);
}; 