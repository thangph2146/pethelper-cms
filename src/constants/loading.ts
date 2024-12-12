export const LOADING_STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const LOADING_MESSAGES = {
  isLoading: 'Đang tải...',
  isDeleting: 'Đang xóa bài viết...',
  isLikeLoading: 'Đang xử lý...',
  isSaving: 'Đang lưu...',
  isStarring: 'Đang đánh dấu...',
  isSharing: 'Đang chia sẻ...',
  isReporting: 'Đang gửi báo cáo...'
} as const;

export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];
export type LoadingStateKey = keyof typeof LOADING_MESSAGES; 