import { useCallback } from 'react';
import type { Post } from '@/types/post';
import { analytics } from '@/services/analytics-service';

interface UsePostTrackingResult {
  trackView: () => void;
  trackInteraction: (action: string) => void;
  trackError: (error: Error) => void;
}

export const usePostTracking = (post: Post): UsePostTrackingResult => {
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