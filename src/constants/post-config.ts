export const POST_CONFIG = {
  defaults: {
    showPreview: true,
    showQuickActions: true,
    showMenu: true,
    disableInteractions: false
  },
  testIds: {
    wrapper: 'post-card-wrapper',
    error: 'post-card-error',
    errorAlert: 'post-error-alert',
    errorRetry: 'post-error-retry',
    loading: 'post-card-loading',
    motion: 'post-card-motion',
    content: 'post-card-content',
    contentError: 'post-content-error',
    contentErrorRetry: 'post-content-error-retry',
    contentSkeleton: 'post-content-skeleton',
    card: 'post-card',
    container: 'post-card-container',
    render: 'post-render',
    skeleton: 'post-skeleton'
  }
} as const; 