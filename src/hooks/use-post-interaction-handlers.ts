import { useMemo } from 'react';
import type { PostRenderProps } from '@/types/post';
import { usePostInteractions } from './use-post-interactions';
import { usePostLoadingStates } from './use-post-loading-states';

interface UsePostInteractionHandlersProps {
  postId: string;
  renderProps: PostRenderProps;
  handlers: {
    handleDelete: () => Promise<void>;
  };
  setters: ReturnType<typeof usePostLoadingStates>['setters'];
}

export const usePostInteractionHandlers = ({
  postId,
  renderProps,
  handlers,
  setters
}: UsePostInteractionHandlersProps) => {
  const { handleInteraction, handleShare } = usePostInteractions(postId);

  return useMemo(() => ({
    ...handlers,
    handleDelete: async () => {
      try {
        setters.setIsDeleting(true);
        await handlers.handleDelete();
      } finally {
        setters.setIsDeleting(false);
      }
    },
    handleLike: async (e: React.MouseEvent) => {
      await handleInteraction(async () => {
        try {
          setters.setIsLikeLoading(true);
          await renderProps.footer.onLike(e);
        } finally {
          setters.setIsLikeLoading(false);
        }
      });
    },
    handleSave: async (e: React.MouseEvent) => {
      await handleInteraction(async () => {
        try {
          setters.setIsSaving(true);
          await renderProps.footer.onSave(e);
        } finally {
          setters.setIsSaving(false);
        }
      });
    },
    handleStar: async (e: React.MouseEvent) => {
      await handleInteraction(async () => {
        try {
          setters.setIsStarring(true);
          await renderProps.quickActions.onStar(e);
        } finally {
          setters.setIsStarring(false);
        }
      });
    },
    handleShare: async () => {
      try {
        setters.setIsSharing(true);
        await handleShare();
      } finally {
        setters.setIsSharing(false);
      }
    }
  }), [
    handlers,
    setters,
    handleInteraction,
    handleShare,
    renderProps.footer,
    renderProps.quickActions
  ]);
}; 