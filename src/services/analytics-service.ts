type EventName = 
  | 'post_view'
  | 'post_like'
  | 'post_save'
  | 'post_share'
  | 'post_error'
  | 'post_interaction';

interface AnalyticsPayload {
  event: EventName;
  properties?: Record<string, unknown>;
  error?: Error;
}

class AnalyticsService {
  private track({ event, properties, error }: AnalyticsPayload) {
    // Gửi event tới analytics service (Google Analytics, Mixpanel, etc)
    if (window.gtag) {
      window.gtag('event', event, properties);
    }

    // Log cho development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, properties, error);
    }
  }

  trackEvent(event: EventName, properties?: Record<string, unknown>) {
    this.track({ event, properties });
  }

  trackError(error: Error, properties?: Record<string, unknown>) {
    this.track({
      event: 'post_error',
      properties,
      error
    });
  }
}

export const analytics = new AnalyticsService(); 