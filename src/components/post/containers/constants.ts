export const CONTAINER_TEST_IDS = {
  wrapper: 'post-card-wrapper',
  error: 'post-card-error',
  errorAlert: 'post-error-alert',
  errorRetry: 'post-error-retry',
  loading: 'post-card-loading',
  motion: 'post-card-motion',
  content: 'post-card-content',
  contentError: 'post-content-error',
  contentErrorRetry: 'post-content-error-retry',
  contentSkeleton: 'post-content-skeleton'
} as const;

export const CONTAINER_MESSAGES = {
  error: {
    title: 'Đã xảy ra lỗi',
    message: 'Có lỗi xảy ra khi hiển thị bài viết này. Vui lòng thử lại.',
    retry: 'Thử lại'
  },
  loading: {
    skeleton: 'Đang tải bài viết...',
    content: 'Đang tải nội dung...'
  }
} as const;

export const VALIDATION_MESSAGES = {
  // Required field messages
  required: {
    title: 'Tiêu đề là bắt buộc',
    content: 'Nội dung là bắt buộc',
    authorId: 'ID tác giả là bắt buộc',
    authorName: 'Tên tác giả là bắt buộc'
  },

  // Length validation messages
  length: {
    title: {
      min: 'Tiêu đề phải có ít nhất 10 ký tự',
      max: 'Tiêu đề không được vượt quá 200 ký tự'
    },
    content: {
      min: 'Nội dung phải có ít nhất 20 ký tự',
      max: 'Nội dung không được vượt quá 5000 ký tự'
    }
  },

  // Limit validation messages
  limits: {
    images: 'Tối đa 10 hình ảnh được phép tải lên',
    likes: 'Số lượt thích không hợp lệ',
    comments: 'Số lượt bình luận không hợp lệ',
    saves: 'Số lượt lưu không hợp lệ'
  },

  // Status validation messages
  status: {
    invalid: 'Trạng thái không hợp lệ'
  }
} as const;

export const VALIDATION_LIMITS = {
  // Content limits
  content: {
    title: {
      min: 10,
      max: 200
    },
    body: {
      min: 20,
      max: 5000
    }
  },

  // Media limits
  media: {
    images: 10
  },

  // Interaction limits
  interactions: {
    likes: 1000000,
    comments: 100000,
    saves: 100000
  }
} as const;

export const VALID_POST_STATUSES = [
  'need_help',
  'helping', 
  'helped'
] as const; 