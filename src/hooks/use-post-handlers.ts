import { useMemo } from 'react';
import type { PostHandlerParams } from '@/types/post';
import { usePostInteractionHandlers } from './use-post-interaction-handlers';
import { usePostRenderProps } from './use-post-render-props';

export const usePostHandlers = ({
  postId,
  renderProps,
  handlers,
  setters,
  disabled,
  showQuickActions,
  showMenu,
  loadingStates
}: PostHandlerParams) => {
  // Interaction handlers
  const interactionHandlers = usePostInteractionHandlers({
    postId,
    renderProps,
    handlers,
    setters,
    disabled
  });

  // Render props
  const renderPropsWithHandlers = usePostRenderProps({
    renderProps,
    loadingStates,
    interactionHandlers,
    showQuickActions,
    showMenu
  });

  return {
    interactionHandlers,
    renderPropsWithHandlers
  };
}; 