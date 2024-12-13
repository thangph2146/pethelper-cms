import { useCallback } from 'react';
import { analytics } from '@/services/analytics-service';
import type { Post } from '@/types/post';

export const usePostAnalytics = (post: Post) => {
  const trackView = useCallback(() => {
    analytics.trackEvent('post_view', {
      postId: post.id,
      authorId: post.author.id,
      status: post.status
    });
  }, [post]);

  const trackInteraction = useCallback((action: string) => {
    analytics.trackEvent('post_interaction', {
      postId: post.id,
      action,
      authorId: post.author.id
    });
  }, [post]);

  const trackError = useCallback((error: Error) => {
    analytics.trackError(error, {
      postId: post.id,
      component: 'PostCard'
    });
  }, [post.id]);

  return {
    trackView,
    trackInteraction,
    trackError
  };
}; 