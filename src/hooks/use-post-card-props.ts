import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/constants/animation';
import { POST_MESSAGES } from '@/constants/post';
import type { Post } from '@/types/post';
import type { PostCardView, PostCardHandlers, PostMotionProps } from '@/types/post';

interface UsePostCardPropsParams {
  post: Post;
  view: PostCardView;
  handlers: PostCardHandlers;
  disableInteractions: {
    className: string;
    'aria-disabled': boolean;
  };
  motionProps: PostMotionProps;
  isAnyLoading: boolean;
}

export const usePostCardProps = ({
  post,
  view,
  handlers,
  disableInteractions,
  motionProps,
  isAnyLoading
}: UsePostCardPropsParams) => {
  const cardProps = useMemo(() => ({
    className: cn(view.className, disableInteractions.className),
    onClick: handlers.handleCardClick,
    'data-testid': 'post-card',
    'aria-disabled': disableInteractions['aria-disabled']
  }), [view.className, disableInteractions, handlers.handleCardClick]);

  const motionDivProps = useMemo(() => ({
    ...motionProps,
    initial: ANIMATION_CONFIG.initial,
    animate: ANIMATION_CONFIG.animate,
    exit: ANIMATION_CONFIG.exit,
    transition: ANIMATION_CONFIG.transition,
    'data-testid': 'post-card-container',
    role: 'article',
    'aria-label': POST_MESSAGES.aria.post(post.author.name),
    'aria-busy': isAnyLoading,
    className: 'relative'
  }), [motionProps, post.author.name, isAnyLoading]);

  return {
    cardProps,
    motionDivProps
  };
}; 