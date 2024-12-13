import { useMemo } from 'react';
import type { PostCardHandlers, PostCardRenderProps, PostCardLoadingSetters } from '@/types/post';
import { usePostHandlers } from './use-post-handlers';

interface UsePostHandlersManagerParams {
  postId: string;
  handlers: PostCardHandlers;
  renderProps: PostCardRenderProps;
  setters: PostCardLoadingSetters;
  disabled: boolean;
  showQuickActions: boolean;
  showMenu: boolean;
  loadingStates: any;
  trackInteraction: (action: string) => void;
  trackError: (error: Error) => void;
}

export const usePostHandlersManager = ({
  postId,
  handlers,
  renderProps,
  setters,
  disabled,
  showQuickActions,
  showMenu,
  loadingStates,
  trackInteraction,
  trackError
}: UsePostHandlersManagerParams) => {
  // Handlers with tracking
  const handlersWithTracking = useMemo(() => ({
    ...handlers,
    onInteraction: (action: string) => {
      try {
        handlers.onInteraction?.(action);
        trackInteraction(action);
      } catch (error) {
        trackError(error as Error);
      }
    }
  }), [handlers, trackInteraction, trackError]);

  // Post interaction handlers
  const {
    interactionHandlers,
    renderPropsWithHandlers
  } = usePostHandlers({
    postId,
    renderProps,
    handlers: handlersWithTracking,
    setters,
    disabled,
    showQuickActions,
    showMenu,
    loadingStates
  });

  return {
    handlers: interactionHandlers,
    renderProps: renderPropsWithHandlers
  };
}; 