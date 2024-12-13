export const POST_MESSAGES = {
  loading: {
    post: 'Đang tải bài viết...',
    skeleton: 'Đang tải nội dung bài viết'
  },
  success: {
    retry: 'Đã tải lại bài viết'
  },
  aria: {
    post: (author: string) => `Bài viết của ${author}`,
    loading: 'Đang tải nội dung bài viết',
    error: 'Đã xảy ra lỗi khi tải bài viết',
    interactions: {
      like: 'Thích bài viết',
      save: 'Lưu bài viết',
      share: 'Chia sẻ bài viết',
      delete: 'Xóa bài viết'
    }
  },
  errors: {
    required: 'PostCard: post prop is required and must have an id',
    invalidAuthor: 'PostCard: post must have an author with a name',
    loading: {
      post: 'Không thể tải bài viết',
      interaction: 'Không thể thực hiện tương tác'
    },
    boundary: {
      title: 'Đã xảy ra lỗi',
      message: 'Có lỗi xảy ra khi hiển thị bài viết này. Vui lòng thử lại.',
      retry: 'Thử lại'
    },
    content: {
      title: 'Không thể hiển thị nội dung',
      message: 'Có lỗi xảy ra khi hiển thị nội dung bài viết. Vui lòng tải lại trang.'
    }
  },
  tracking: {
    view: 'Post viewed',
    loading: 'Post loading state changed',
    error: 'Post error state changed',
    interaction: 'Post interaction tracked',
    errorTracked: 'Post error tracked'
  }
} as const; 