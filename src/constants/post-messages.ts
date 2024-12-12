export const POST_MESSAGES = {
  loading: {
    post: 'Đang tải bài viết...',
    skeleton: 'Loading post'
  },
  aria: {
    post: (author: string) => `Post by ${author}`,
    loading: 'Loading post content'
  }
} as const; 