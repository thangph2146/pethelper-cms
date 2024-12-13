'use client';

import { memo } from 'react';
import type { PostCardProps } from '@/types/post';
import { PostWrapper } from './post/post-wrapper';
import { usePostCardState } from '@/hooks/use-post-card-state';
import { usePostRenderState } from '@/hooks/post-card/use-post-render-state';

/**
 * PostCard component displays a post with loading, error handling and interaction capabilities
 */
export const PostCard = memo((props: PostCardProps) => {
  const { wrapperProps, state, tracking } = usePostCardState(props);
  const renderState = usePostRenderState({ 
    state,
    wrapperProps,
    onInteraction: tracking.trackInteraction,
    onError: tracking.trackError
  });

  return <PostWrapper {...renderState.wrapperProps} />;
});

PostCard.displayName = 'PostCard';

