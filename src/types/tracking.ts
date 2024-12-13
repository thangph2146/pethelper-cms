import type { Post } from './post';
import { TRACKING_EVENTS, TRACKING_ACTIONS, TRACKING_COMPONENTS } from '@/constants/tracking';

export interface TrackingEvent {
  event: string;
  message: string;
  data: Record<string, unknown>;
  component: string;
}

export interface TrackingData {
  postId: string;
  authorId: string;
  status: string;
  action?: string;
  error?: Error;
  loading?: Record<string, boolean>;
}

export interface TrackingHandlers {
  trackView: (post: Post) => void;
  trackInteraction: (post: Post, action: string) => void;
  trackError: (post: Post, error: Error) => void;
  trackLoading: (post: Post, loading: Record<string, boolean>) => void;
}

// Type-safe tracking constants
export type TrackingComponent = keyof typeof TRACKING_COMPONENTS;
export type TrackingAction = keyof typeof TRACKING_ACTIONS;
export type TrackingEventType = keyof typeof TRACKING_EVENTS.POST;

// Type-safe tracking functions
export interface TrackingService {
  trackEvent: (event: TrackingEventType, data: TrackingData) => void;
  trackAction: (action: TrackingAction, data: TrackingData) => void;
  trackError: (error: Error, data: Partial<TrackingData>) => void;
}

// Type-safe tracking context
export interface TrackingContext {
  component: TrackingComponent;
  data: Partial<TrackingData>;
} 