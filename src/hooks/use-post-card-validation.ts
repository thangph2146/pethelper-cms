import { useMemo } from 'react';
import { POST_CONFIG } from '@/constants/post-config';
import type { PostCardProps } from '@/types/post';

export const usePostCardValidation = ({
  disableInteractions,
  showPreview,
  showQuickActions,
  showMenu
}: Partial<PostCardProps>) => {
  return useMemo(() => ({
    disableInteractions: disableInteractions ?? POST_CONFIG.defaults.disableInteractions,
    showPreview: showPreview ?? POST_CONFIG.defaults.showPreview,
    showQuickActions: showQuickActions ?? POST_CONFIG.defaults.showQuickActions,
    showMenu: showMenu ?? POST_CONFIG.defaults.showMenu
  }), [disableInteractions, showPreview, showQuickActions, showMenu]);
}; 