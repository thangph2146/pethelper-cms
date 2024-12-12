import { useMemo } from 'react';
import type { PostRenderProps } from '@/types/post';
import type { PostLoadingStates } from './use-post-loading-states';
import type { PostInteractionHandlers } from './use-post-interaction-handlers';

interface UsePostRenderPropsParams {
  renderProps: PostRenderProps;
  loadingStates: PostLoadingStates;
  interactionHandlers: PostInteractionHandlers;
}

export const usePostRenderProps = ({
  renderProps,
  loadingStates,
  interactionHandlers
}: UsePostRenderPropsParams) => {
  return useMemo(() => ({
    ...renderProps,
    loading: loadingStates,
    handlers: interactionHandlers,
    footer: {
      ...renderProps.footer,
      onLike: interactionHandlers.handleLike,
      onSave: interactionHandlers.handleSave,
      onShare: interactionHandlers.handleShare
    },
    quickActions: {
      ...renderProps.quickActions,
      onStar: interactionHandlers.handleStar
    }
  }), [renderProps, loadingStates, interactionHandlers]);
}; 