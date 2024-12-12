export interface IPost {
  _id: string;
  id: string;
  title: string;
  content: string;
  type: PostType;
  category: PostType;
  status: PostStatus;
  urgency: PostUrgency;
  location: string;
  description: string;
  contactInfo: string;
  images: string[];
  author: {
    _id: string;
    id: string;
    name: string;
    email: string;
  };
  user_id: string;
  contact: {
    phone: string;
    email?: string;
  };
  likes: string[];
  comments: {
    _id: string;
    id: string;
    user: {
      _id: string;
      id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  $assertPopulated?: <T>() => T;
  $clearModifiedPaths?: () => void;
  $clone?: () => IPost;
}

export interface CreatePostData {
  title: string;
  content: string;
  image_url?: string;
  category_id?: string;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  image_url?: string;
  category_id?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export const POST_TYPES = ['dog', 'cat', 'other'] as const;
export const POST_STATUSES = ['need_help', 'helping', 'helped'] as const;
export const POST_URGENCIES = ['high', 'medium', 'low'] as const;

export type PostType = typeof POST_TYPES[number];
export type PostStatus = typeof POST_STATUSES[number];
export type PostUrgency = typeof POST_URGENCIES[number];

export interface PostFilters {
  keyword?: string;
  type?: PostType;
  status?: PostStatus;
  urgency?: PostUrgency;
  limit?: number;
}

export interface PostsResponse {
  data: IPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export const POST_TYPE_LABELS: Record<PostType | 'all', string> = {
  all: 'Tất cả',
  dog: 'Chó',
  cat: 'Mèo',
  other: 'Khác'
} as const;

export const POST_STATUS_LABELS: Record<PostStatus | 'all', string> = {
  all: 'Tất cả trạng thái',
  need_help: 'Cần giúp đỡ',
  helping: 'Đang hỗ trợ',
  helped: 'Đã giải quyết'
} as const;

export const POST_URGENCY_LABELS: Record<PostUrgency | 'all', string> = {
  all: 'Tất cả mức độ',
  high: 'Khẩn cấp',
  medium: 'Trung bình',
  low: 'Thấp'
} as const;

export interface PostCardProps {
  post: Pick<IPost, 'id' | 'title' | 'content' | 'user_id' | 'status' | 'created_at' | 'updated_at'>;
}