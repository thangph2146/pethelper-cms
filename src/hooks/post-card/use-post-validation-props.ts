import { useMemo } from 'react';
import type { PostCardProps } from '@/types/post';

export const usePostValidationProps = ({
  post,
  disableInteractions,
  showPreview,
  showQuickActions,
  showMenu
}: Pick<PostCardProps, 'post' | 'disableInteractions' | 'showPreview' | 'showQuickActions' | 'showMenu'>) => {
  return useMemo(() => ({
    post,
    disableInteractions,
    showPreview,
    showQuickActions,
    showMenu
  }), [post, disableInteractions, showPreview, showQuickActions, showMenu]);
}; 