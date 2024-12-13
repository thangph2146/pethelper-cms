import { useMemo } from 'react';
import { validatePost } from '@/utils/post-validation';
import { usePostCardValidation } from '@/hooks/use-post-card-validation';
import type { Post, PostCardProps } from '@/types/post';

interface UsePostValidationParams {
  post: Post | null | undefined;
  disableInteractions?: boolean;
  showPreview?: boolean;
  showQuickActions?: boolean;
  showMenu?: boolean;
}

export const usePostValidation = ({
  post,
  disableInteractions,
  showPreview,
  showQuickActions,
  showMenu
}: UsePostValidationParams) => {
  // Validate post
  const validatedPost = useMemo(() => validatePost(post), [post]);

  // Validate props
  const validatedProps = usePostCardValidation({
    disableInteractions,
    showPreview,
    showQuickActions,
    showMenu
  });

  return {
    post: validatedPost,
    props: validatedProps
  };
}; 