import type { Post } from '@/types/post';
import { usePostCard } from './use-post-card';
import { usePostErrorHandling } from './use-post-error-handling';
import { usePostTracking } from './use-post-tracking';
import { usePostHandlersManager } from './use-post-handlers-manager';
import { usePostPropsManager } from './use-post-props-manager';

interface UsePostStateManagerParams {
  post: Post;
  validatedProps: {
    showPreview: boolean;
    showQuickActions: boolean;
    showMenu: boolean;
    className?: string;
    onCardClick?: (post: Post) => void;
  };
}

export const usePostStateManager = ({
  post,
  validatedProps
}: UsePostStateManagerParams) => {
  // Core state
  const cardState = usePostCard(post, {
    className: validatedProps.className,
    ...validatedProps
  });

  // Error state
  const errorState = usePostErrorHandling(
    post.id,
    cardState.loading.isLoading
  );

  // Tracking state
  const trackingState = usePostTracking({
    post,
    isLoading: errorState.isAnyLoading,
        isError: errorState.isError
  });

  // Handler state
  const handlerState = usePostHandlersManager({
    postId: post.id,
    handlers: cardState.handlers,
    renderProps: cardState.renderProps,
    setters: errorState.setters,
    disabled: errorState.disableInteractions.ariaDisabled,
    showQuickActions: validatedProps.showQuickActions,
    showMenu: validatedProps.showMenu,
    loadingStates: errorState.loadingStates,
    ...trackingState
  });

  // Props state
  const propState = usePostPropsManager({
    post,
    view: cardState.view,
    handlers: handlerState.handlers,
    renderProps: handlerState.renderProps,
    loadingStates: errorState.loadingStates,
    disableState: errorState.disableInteractions,
    motionProps: cardState.motionProps,
    isAnyLoading: errorState.isAnyLoading,
    showPreview: validatedProps.showPreview,
    dialogs: cardState.dialogs
  });

  return {
    errorState,
    propState
  };
}; 