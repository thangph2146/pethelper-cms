export const POST_TYPES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'other', label: 'Khác' }
] as const;

export const POST_STATUS = {
  NEED_HELP: 'need_help',
  HELPING: 'helping',
  HELPED: 'helped'
} as const;

export const POST_URGENCY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const POST_STATUS_LABELS = {
  [POST_STATUS.NEED_HELP]: 'Cần giúp đỡ',
  [POST_STATUS.HELPING]: 'Đang hỗ trợ',
  [POST_STATUS.HELPED]: 'Đã giải quyết'
} as const;

export const POST_URGENCY_LABELS = {
  [POST_URGENCY.HIGH]: 'Khẩn cấp',
  [POST_URGENCY.MEDIUM]: 'Trung bình',
  [POST_URGENCY.LOW]: 'Thấp'
} as const;

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Mới nhất' },
  { value: 'createdAt_asc', label: 'Cũ nhất' },
  { value: 'urgency_desc', label: 'Khẩn cấp nhất' },
  { value: 'urgency_asc', label: 'Ít khẩn cấp nhất' }
] as const;

export const ANIMAL_TYPE = {
  DOG: 'dog',
  CAT: 'cat',
  OTHER: 'other',
} as const;

export const STATUS_COLORS = {
  [POST_STATUS.NEED_HELP]: 'text-red-500',
  [POST_STATUS.HELPING]: 'text-yellow-500',
  [POST_STATUS.HELPED]: 'text-green-500',
} as const;

export const STATUS_TEXT = {
  [POST_STATUS.NEED_HELP]: 'Cần giúp đỡ',
  [POST_STATUS.HELPING]: 'Đang giúp đỡ',
  [POST_STATUS.HELPED]: 'Đã được giúp đỡ',
} as const;

export const ANIMAL_TYPE_TEXT = {
  [ANIMAL_TYPE.DOG]: 'Chó',
  [ANIMAL_TYPE.CAT]: 'Mèo',
  [ANIMAL_TYPE.OTHER]: 'Khác',
} as const;

export const ANIMAL_TYPE_EMOJI = {
  [ANIMAL_TYPE.DOG]: '🐕',
  [ANIMAL_TYPE.CAT]: '🐈',
  [ANIMAL_TYPE.OTHER]: '🐾',
} as const;

export const POST_QUERY_KEYS = {
  interactions: (postId: string) => ['post-interactions', postId] as const,
  details: (postId: string) => ['post-details', postId] as const,
  list: ['posts'] as const,
  stats: (postId: string) => ['post-stats', postId] as const,
  comments: (postId: string) => ['post-comments', postId] as const
} as const;

export const POST_MESSAGES = {
  errors: {
    delete: 'Không thể xóa bài viết',
    load: 'Có lỗi xảy ra khi hiển thị bài viết',
    retry: 'Thử lại',
    like: 'Không thể thực hiện thao tác này',
    save: 'Không thể lưu bài viết',
    star: 'Không thể đánh dấu bài viết'
  },
  success: {
    delete: 'Đã xóa bài viết',
    like: 'Đã thích bài viết',
    unlike: 'Đã bỏ thích bài viết',
    save: 'Đã lưu bài viết',
    unsave: 'Đã bỏ lưu bài viết',
    star: 'Đã đánh dấu bài viết',
    unstar: 'Đã bỏ đánh dấu bài viết'
  }
} as const;

export const POST_MENU_ACTIONS = {
  DELETE: 'delete',
  REPORT: 'report',
  SHARE: 'share'
} as const;

export const POST_MENU_ITEMS = {
  DELETE: 'Xóa bài viết',
  REPORT: 'Báo cáo',
  SHARE: 'Chia sẻ'
} as const; 