'use client';

// React & UI libs
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Types
import type { PostCardProps } from '@/types/post';

// Components
import { PostErrorWrapper } from './post/post-error-wrapper';
import { PostLoadingState } from './post/post-loading-state';
import { PostMotionContainer } from './post/post-motion-container';
import { PostContentWrapper } from './post/post-content-wrapper';

// Hooks
import { usePostCard } from '@/hooks/use-post-card';
import { usePostCardValidation } from '@/hooks/use-post-card-validation';
import { usePostErrorHandling } from '@/hooks/use-post-error-handling';
import { usePostHandlers } from '@/hooks/use-post-handlers';
import { usePostCardProps } from '@/hooks/use-post-card-props';
import { usePostContentProps } from '@/hooks/use-post-content-props';

// Constants
import { POST_CONFIG } from '@/constants/post-config';

export const PostCard = memo(({ 
  post,
  className,
  disableInteractions,
  showPreview,
  showQuickActions,
  showMenu,
  onCardClick
}: PostCardProps) => {
  // Validate props
  const validatedProps = usePostCardValidation({
    disableInteractions,
    showPreview,
    showQuickActions,
    showMenu
  });

  // Core hooks
  const {
    view,
    loading,
    handlers,
    renderProps,
    dialogs,
    motionProps
  } = usePostCard(post, {
    className,
    ...validatedProps,
    onCardClick
  });

  // Error and loading handling
  const {
    loadingStates,
    setters,
    isAnyLoading,
    disableInteractions: disableState,
    errorProps,
    loadingProps
  } = usePostErrorHandling(post.id, loading.isLoading);

  // Handlers
  const {
    interactionHandlers,
    renderPropsWithHandlers
  } = usePostHandlers({
    postId: post.id,
    renderProps,
    handlers,
    setters,
    disabled: validatedProps.disableInteractions,
    showQuickActions: validatedProps.showQuickActions,
    showMenu: validatedProps.showMenu,
    loadingStates
  });

  // Card props
  const { cardProps, motionDivProps } = usePostCardProps({
    post,
    view,
    handlers: interactionHandlers,
    disableInteractions: disableState,
    motionProps,
    isAnyLoading,
    testIds: POST_CONFIG.testIds
  });

  // Content props
  const contentProps = usePostContentProps({
    loadingStates,
    cardProps,
    renderProps: renderPropsWithHandlers,
    showPreview: validatedProps.showPreview,
    post,
    view,
    dialogs,
    handlers: interactionHandlers
  });

  return (
    <PostErrorWrapper {...errorProps}>
      <PostLoadingState {...loadingProps}>
        <PostMotionContainer motionProps={motionDivProps}>
          <PostContentWrapper {...contentProps} />
        </PostMotionContainer>
      </PostLoadingState>
    </PostErrorWrapper>
  );
});

PostCard.displayName = 'PostCard';

