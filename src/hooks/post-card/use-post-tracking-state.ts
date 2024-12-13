import { useEffect } from 'react';
import type { PostState } from './use-post-state';
import type { PostTrackingState } from '@/types/post';
import type { TrackingEvent, TrackingData, TrackingEventType, TrackingContext } from '@/types/tracking';
import { usePostTracking } from '../use-post-tracking';
import { logger } from '@/services/log-service';
import { POST_MESSAGES } from '@/constants/post-messages';
import { TRACKING_EVENTS, TRACKING_COMPONENTS } from '@/constants/tracking';

const createTrackingEvent = (
  event: TrackingEventType,
  message: string,
  data: TrackingData,
  context: TrackingContext
): TrackingEvent => ({
  event,
  message,
  data,
  component: context.component
});

export const usePostTrackingState = (state: PostState): PostTrackingState => {
  const tracking = usePostTracking(state.post);
  
  const context: TrackingContext = {
    component: 'POST_CARD',
    data: {
      postId: state.post.id,
      authorId: state.post.author.id,
      status: state.post.status
    }
  };

  // Track initial view
  useEffect(() => {
    tracking.trackView();
    logger.info(createTrackingEvent(
      'VIEW',
      POST_MESSAGES.tracking.view,
      {
        ...context.data,
        status: state.post.status
      },
      context
    ));
  }, [state.post.id, state.post.status, state.post.author.id, tracking, context]);

  // Track loading state changes
  useEffect(() => {
    if (state.loading.isLoading) {
      logger.debug(createTrackingEvent(
        'LOADING',
        POST_MESSAGES.tracking.loading,
        {
          ...context.data,
          loading: state.loading
        },
        context
      ));
    }
  }, [state.loading, state.post.id, state.post.author.id, context]);

  // Track error state changes
  useEffect(() => {
    if (state.error) {
      logger.error(createTrackingEvent(
        'ERROR',
        POST_MESSAGES.tracking.error,
        {
          ...context.data,
          error: state.error
        },
        context
      ));
    }
  }, [state.error, state.post.id, state.post.author.id, context]);

  return {
    trackInteraction: tracking.trackInteraction,
    trackError: tracking.trackError
  };
}; 