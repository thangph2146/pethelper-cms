import { useMemo } from 'react';
import type { PostCardProps } from '@/types/post';
import { usePostValidationProps } from './post-card/use-post-validation-props';
import { usePostStateProps } from './post-card/use-post-state-props';
import { usePostValidation } from './use-post-validation';
import { usePostStateManager } from './use-post-state-manager';
import { usePostLoadingProps } from './post-card/use-post-loading-props';
import { usePostAnimationProps } from './post-card/use-post-animation-props';
import { usePostWrapperProps } from './post-card/use-post-wrapper-props';
import { usePostWrapperDeps } from './post-card/use-post-wrapper-deps';
import { usePostTracking } from './use-post-tracking';
import { usePostState } from './post-card/use-post-state';
import { usePostTrackingState } from './post-card/use-post-tracking-state';

export const usePostCardState = (props: PostCardProps) => {
  const {
    post: postProp,
    className,
    disableInteractions,
    showPreview,
    showQuickActions,
    showMenu,
    onCardClick
  } = props;

  // Validation props & state
  const validationProps = usePostValidationProps({
    post: postProp,
    disableInteractions,
    showPreview,
    showQuickActions,
    showMenu
  });

  const { post, props: validatedProps } = usePostValidation(validationProps);

  // State props & management
  const stateProps = usePostStateProps({
    post,
    validatedProps,
    className,
    onCardClick
  });

  const { errorState, propState } = usePostStateManager(stateProps);

  // Loading props & state
  const { loadingStateProps, loadingState } = usePostLoadingProps({
    isAnyLoading: errorState.isAnyLoading,
    isError: errorState.isError
  });

  // Animation props & state
  const { motionProps } = usePostAnimationProps({
    isDisabled: errorState.disableInteractions['aria-disabled'],
    isLoading: loadingState.isLoading
  });

  // Analytics tracking
  usePostTracking({
    post,
    isLoading: loadingState.isLoading,
    isError: errorState.isError
  });

  // Post state
  const state = usePostState({
    post,
    loading: loadingState,
    error: errorState.isError
  });

  // Tracking state
  const tracking = usePostTrackingState(state);

  // Wrapper dependencies & props
  const wrapperDeps = usePostWrapperDeps({
    propState,
    errorState,
    loadingStateProps,
    motionProps
  });

  const wrapperProps = usePostWrapperProps(wrapperDeps);

  return {
    wrapperProps,
    state,
    tracking
  };
}; 