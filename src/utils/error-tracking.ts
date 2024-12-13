import { logger } from '@/services/log-service';
import { analytics } from '@/services/analytics-service';

interface ErrorInfo {
  componentStack?: string;
  digest?: string;
  postId?: string;
}

export const trackError = (error: Error, errorInfo?: ErrorInfo) => {
  // Log error
  logger.error({
    message: 'Unhandled Error',
    error,
    data: errorInfo,
    component: errorInfo?.componentStack?.split('\n')[1]?.trim() || 'Unknown'
  });

  // Track error analytics
  analytics.trackError(error, {
    postId: errorInfo?.postId,
    component: errorInfo?.componentStack?.split('\n')[1]?.trim() || 'Unknown',
    digest: errorInfo?.digest
  });

  // Gửi error tới service tracking (Sentry, etc)
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { extra: errorInfo });
  // }
}; 