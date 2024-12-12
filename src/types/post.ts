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

export const DISTANCE_OPTIONS = {
  all: 'Tất cả',
  '5': 'Dưới 5km',
  '10': 'Dưới 10km',
  '20': 'Dưới 20km',
  '50': 'Dưới 50km'
} as const;

export const TIME_RANGE_OPTIONS = {
  all: 'Tất cả thời gian',
  today: 'Hôm nay',
  week: '7 ngày qua',
  month: '30 ngày qua'
} as const;

export interface PostFilters {
  keyword?: string;
  type?: PostType;
  status?: PostStatus;
  urgency?: PostUrgency;
  distance?: number;
  timeRange?: keyof typeof TIME_RANGE_OPTIONS;
  dateFrom?: string;
  dateTo?: string;
  readStatus?: 'all' | 'read' | 'unread';
  starred?: boolean;
  interaction?: 'liked' | 'commented' | 'saved';
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
  likes: number;
  comments: number;
  saves: number;
  hasLiked: boolean;
  hasSaved: boolean;
}

export interface GetPostByIdParams {
  id: string;
}

export interface GetPostByIdResponse {
  data: IPost;
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
  post: Post;
  className?: string;
  disableInteractions?: boolean;
  showPreview?: boolean;
  showQuickActions?: boolean;
  showMenu?: boolean;
  onCardClick?: (post: Post) => void;
}

export interface PostCardHandlers {
  handleCardClick: () => void;
  handleDelete: () => Promise<void>;
  handleLike: (e: React.MouseEvent) => Promise<void>;
  handleSave: (e: React.MouseEvent) => Promise<void>;
  handleStar: (e: React.MouseEvent) => Promise<void>;
  handleShare: () => Promise<void>;
}

export interface PostCardView {
  className: string;
  header: {
    statusColor: string;
    urgencyColor: string;
    date: string;
  };
}

export interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

export const READ_STATUS_OPTIONS = {
  all: 'Tất cả',
  read: 'Đã xem',
  unread: 'Chưa xem'
} as const;

export interface PostInteractionStats {
  hasLiked: boolean;
  hasCommented: boolean;
  hasSaved: boolean;
  likeCount: number;
  commentCount: number;
  saveCount: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  status: 'need_help' | 'helping' | 'helped';
  urgency: 'high' | 'medium' | 'low';
  location?: string;
  contactInfo?: string;
  images?: string[];
  viewCount?: number;
}

export interface PostRenderProps {
  header: {
    author: Post['author'];
    date: string;
    status: Post['status'];
    statusColor: string;
    isAuthor: boolean;
    onMenuAction: (action: string) => void;
  };
  content: {
    title: string;
    content: string;
    images?: string[];
    showContent: boolean;
    toggleContent: () => void;
    contentRef: RefObject<HTMLDivElement>;
    onImageClick: (image: string) => void;
  };
  footer: {
    stats: PostStats;
    isLiked: boolean;
    isSaved: boolean;
    hasInteractions: boolean;
    onLike: (e: React.MouseEvent) => Promise<void>;
    onComment: () => void;
    onSave: (e: React.MouseEvent) => Promise<void>;
    onShare: () => Promise<void>;
  };
  quickActions: {
    isStarred: boolean;
    onQuickView: (e: React.MouseEvent) => void;
    onStar: (e: React.MouseEvent) => Promise<void>;
  };
  loading: PostLoadingStates;
  handlers: {
    handleDelete: () => Promise<void>;
    handleLike: (e: React.MouseEvent) => Promise<void>;
    handleSave: (e: React.MouseEvent) => Promise<void>;
    handleStar: (e: React.MouseEvent) => Promise<void>;
    handleShare: () => Promise<void>;
  };
}

import type { MotionProps } from 'framer-motion';

export interface PostMotionProps extends MotionProps {
  'data-testid'?: string;
  role?: string;
  'aria-label'?: string;
  'aria-busy'?: boolean;
  className?: string;
}

export interface PostHandlerParams {
  postId: string;
  renderProps: PostRenderProps;
  handlers: PostCardHandlers;
  setters: PostLoadingSetters;
  disabled: boolean;
  showQuickActions: boolean;
  showMenu: boolean;
  loadingStates: PostLoadingStates;
}

export interface PostLoadingSetters {
  setIsDeleting: (loading: boolean) => void;
  setIsLikeLoading: (loading: boolean) => void;
  setIsSaving: (loading: boolean) => void;
  setIsStarring: (loading: boolean) => void;
  setIsSharing: (loading: boolean) => void;
  setIsReporting: (loading: boolean) => void;
}

export interface PostErrorHandlingResult {
  loadingStates: PostLoadingStates;
  setters: PostLoadingSetters;
  isAnyLoading: boolean;
  disableInteractions: {
    className: string;
    'aria-disabled': boolean;
  };
  errorProps: {
    onReset: () => void;
    onError: (error: Error) => void;
  };
  loadingProps: {
    isLoading: boolean;
  };
}