import { useMemo } from 'react';
import type { PostCardHandlers } from '@/types/post';

interface UsePostEnhancedHandlersProps {
  handlers: PostCardHandlers;
  setters: {
    setIsDeleting: (loading: boolean) => void;
    setIsLikeLoading: (loading: boolean) => void;
    setIsSaving: (loading: boolean) => void;
    setIsStarring: (loading: boolean) => void;
    setIsSharing: (loading: boolean) => void;
    setIsReporting: (loading: boolean) => void;
  };
  onLike: (e: React.MouseEvent) => Promise<void>;
  onSave: (e: React.MouseEvent) => Promise<void>;
  onStar: (e: React.MouseEvent) => Promise<void>;
}

export const usePostEnhancedHandlers = ({
  handlers,
  setters,
  onLike,
  onSave,
  onStar
}: UsePostEnhancedHandlersProps) => {
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
      try {
        setters.setIsLikeLoading(true);
        await onLike(e);
      } finally {
        setters.setIsLikeLoading(false);
      }
    },
    handleSave: async (e: React.MouseEvent) => {
      try {
        setters.setIsSaving(true);
        await onSave(e);
      } finally {
        setters.setIsSaving(false);
      }
    },
    handleStar: async (e: React.MouseEvent) => {
      try {
        setters.setIsStarring(true);
        await onStar(e);
      } finally {
        setters.setIsStarring(false);
      }
    }
  }), [handlers, setters, onLike, onSave, onStar]);
}; 